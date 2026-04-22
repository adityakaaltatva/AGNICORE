use std::env;
use std::sync::Arc;

use axum::extract::{Json, State};
use chrono::{Utc, Timelike};
use jsonwebtoken::{decode, Algorithm, DecodingKey, Validation};
use serde::{Deserialize, Serialize};
use serde_json::json;
use crate::repository::log_repository::LogRepository;

#[derive(Deserialize)]
pub struct AccessRequest {
    pub token: String,
    pub resource: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct Claims {
    sub: String,
    role: String,   // 🔥 ADD THIS
    exp: usize,
}

fn jwt_secret() -> Result<String, crate::errors::AppError> {
    let secret = env::var("JWT_SECRET").map_err(|_| crate::errors::AppError::InternalServerError)?;
    if secret.len() < 32 {
        return Err(crate::errors::AppError::InternalServerError);
    }
    Ok(secret)
}

fn validate_resource(resource: &str) -> Result<(), crate::errors::AppError> {
    let trimmed = resource.trim();
    let is_valid = !trimmed.is_empty()
        && trimmed.len() <= 128
        && trimmed
            .chars()
            .all(|ch| ch.is_ascii_alphanumeric() || matches!(ch, '/' | '_' | '-' | '.'));

    if is_valid {
        Ok(())
    } else {
        Err(crate::errors::AppError::BadRequest(
            "resource must be 1-128 chars and only contain letters, numbers, /, _, -, or .".to_string(),
        ))
    }
}

pub async fn handle_access(
    State(repo): State<Arc<dyn LogRepository>>,
    Json(req): Json<AccessRequest>,
) -> Result<Json<serde_json::Value>, crate::errors::AppError> {
    validate_resource(&req.resource)?;

    let secret = jwt_secret()?;
    let token_data = decode::<Claims>(
        &req.token,
        &DecodingKey::from_secret(secret.as_ref()),
        &Validation::new(Algorithm::HS256),
    )
    .map_err(|_| crate::errors::AppError::Unauthorized)?;

    let user = token_data.claims.sub;
    let hour = Utc::now().hour();
    let mut risk = 0;

    if req.resource.contains("admin") {
        risk += 40;
    }

    // Time anomaly
    if hour < 6 || hour > 22 {
        risk += 20;
    }

    // IP-based risk
    if ip.starts_with("192.168") || ip.starts_with("10.") || ip == "127.0.0.1" {
        risk += 5;
    } else {
        risk += 15;
    }

    // 🔥 Behavioral risk (frequency)
    if recent_count > 5 {
        risk += 20;
    }
    if recent_count > 10 {
        risk += 30;
    }
    if recent_count > 20 {
        risk += 50;
    }

    // 🧠 Decision
    let decision = if risk >= 60 {
        "DENY"
    } else if risk >= 30 {
        "VERIFY"
    } else {
        "ALLOW"
    };

    // PERSIST
    repo.log_access(&user, &req.resource, risk, decision).await?;

    Ok(Json(json!({
        "user": user,
        "role": role,
        "resource": req.resource,
        "ip": ip,
        "hour": hour,
        "request_count": recent_count,
        "risk_score": risk,
        "decision": decision
    })))
}

pub async fn handle_get_logs(
    State(repo): State<Arc<dyn LogRepository>>,
) -> Result<Json<Vec<crate::domain::models::LogEntry>>, crate::errors::AppError> {
    let logs = repo.get_recent_logs(50).await?;
    Ok(Json(logs))
}

