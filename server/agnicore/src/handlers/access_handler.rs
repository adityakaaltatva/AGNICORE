use axum::extract::{Json, State, ConnectInfo};
use serde::{Deserialize, Serialize};
use serde_json::json;
use jsonwebtoken::{decode, DecodingKey, Validation, Algorithm};
use chrono::{Utc, Timelike};
use uuid::Uuid;
use std::net::SocketAddr;
use crate::app::AppState;
use crate::errors::app_error::AppError;

#[derive(Deserialize)]
pub struct AccessRequest {
    pub token: String,
    pub resource: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct Claims {
    sub: String,
    exp: usize,
}

pub async fn handle_access(
    ConnectInfo(addr): ConnectInfo<SocketAddr>,
    State(state): State<AppState>,
    Json(req): Json<AccessRequest>,
) -> Result<Json<serde_json::Value>, AppError> {
    // Extract client IP
    let ip = addr.ip().to_string();
    // JWT validation
    let secret = &state.settings.jwt_secret;
    let user = match decode::<Claims>(
        &req.token,
        &DecodingKey::from_secret(secret.as_ref()),
        &Validation::new(Algorithm::HS256),
    ) {
        Ok(data) => {
            // Check if token is expired
            let now = Utc::now().timestamp() as usize;
            if data.claims.exp < now {
                "expired_user".to_string()
            } else {
                data.claims.sub
            }
        }
        Err(_) => "invalid_user".to_string(),
    };

    // Context
    let hour = Utc::now().hour();

    // Risk calculation
    let mut risk = 0;

    if user == "invalid_user" || user == "expired_user" {
        risk += 50;
    }

    if req.resource == "admin" {
        risk += 40;
    }

    if hour < 6 || hour > 22 {
        risk += 20;
    }

    // IP-based risk assessment
    if ip.starts_with("192.168") || ip.starts_with("10.") || ip == "127.0.0.1" {
        risk += 5; // local network (low risk)
    } else {
        risk += 15; // external network
    }

    // Decision
    let decision = if risk >= 60 {
        "DENY"
    } else {
        "ALLOW"
    };

    // Log to database
    sqlx::query(
        "INSERT INTO logs (id, user, resource, ip, risk_score, decision, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)"
    )
    .bind(Uuid::new_v4().to_string())
    .bind(&user)
    .bind(&req.resource)
    .bind(&ip)
    .bind(risk)
    .bind(decision)
    .bind(Utc::now().to_string())
    .execute(&state.pool)
    .await
    .map_err(|e| AppError::DatabaseError(e.to_string()))?;

    Ok(Json(json!({
        "user": user,
        "resource": req.resource,
        "ip": ip,
        "hour": hour,
        "risk_score": risk,
        "decision": decision
    })))
}