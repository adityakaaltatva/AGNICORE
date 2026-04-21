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
    role: String,   // 🔥 ADD THIS
    exp: usize,
}

pub fn validate_token(token: &str, secret: &str) -> (String, String) {
    match decode::<Claims>(
        token,
        &DecodingKey::from_secret(secret.as_ref()),
        &Validation::new(Algorithm::HS256),
    ) {
        Ok(data) => {
            let now = Utc::now().timestamp() as usize;
            if data.claims.exp < now {
                ("expired_user".to_string(), "unknown".to_string())
            } else {
                (data.claims.sub, data.claims.role)
            }
        }
        Err(_) => ("invalid_user".to_string(), "unknown".to_string()),
    }
}

pub async fn handle_access(
    ConnectInfo(addr): ConnectInfo<SocketAddr>,
    State(state): State<AppState>,
    Json(req): Json<AccessRequest>,
) -> Result<Json<serde_json::Value>, AppError> {

    // 🔹 Extract IP
    let ip = addr.ip().to_string();

    // 🔐 JWT Validation
    let secret = &state.settings.jwt_secret;

    let (user, role) = validate_token(&req.token, secret);

    // 🕒 Context
    let hour = Utc::now().hour();

    // 🔥 STEP 1: Frequency (last 5 minutes)
    let recent_count: i64 = sqlx::query_scalar(
        "SELECT COUNT(*) FROM logs 
         WHERE user = ? 
         AND datetime(created_at) > datetime('now', '-5 minutes')"
    )
    .bind(&user)
    .fetch_one(&state.pool)
    .await
    .unwrap_or(0);

    // ⚠️ STEP 2: Risk Calculation
    let mut risk = 0;

    // Identity risk
    if user == "invalid_user" || user == "expired_user" {
        risk += 50;
    }

    // Resource sensitivity
    if req.resource == "admin" {
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
    } else {
        "ALLOW"
    };

    // 🗂️ Logging
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

    // 📤 Response
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