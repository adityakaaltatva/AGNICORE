use axum::extract::Json;
use serde::{Deserialize, Serialize};
use serde_json::json;
use jsonwebtoken::{decode, DecodingKey, Validation, Algorithm};
use chrono::{Utc, Timelike};
use uuid::Uuid;
use sqlx::SqlitePool;

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
    Json(req): Json<AccessRequest>,
) -> Json<serde_json::Value> {

    let pool = SqlitePool::connect("sqlite:agnicore.db").await.unwrap();

    // JWT
    let secret = "mysecret";

    let user = match decode::<Claims>(
        &req.token,
        &DecodingKey::from_secret(secret.as_ref()),
        &Validation::new(Algorithm::HS256),
    ) {
        Ok(data) => data.claims.sub,
        Err(_) => "invalid_user".to_string(),
    };

    // Context
    let hour = Utc::now().hour();

    // Risk
    let mut risk = 0;

    if user == "invalid_user" {
        risk += 50;
    }

    if req.resource == "admin" {
        risk += 40;
    }

    if hour < 6 || hour > 22 {
        risk += 20;
    }

    // Decision
    let decision = if risk >= 60 {
        "DENY"
    } else {
        "ALLOW"
    };

    // 🔥 LOG TO DATABASE
    let _ = sqlx::query(
        "INSERT INTO logs (id, user, resource, risk_score, decision, created_at)
         VALUES (?, ?, ?, ?, ?, ?)"
    )
    .bind(Uuid::new_v4().to_string())
    .bind(&user)
    .bind(&req.resource)
    .bind(risk)
    .bind(decision)
    .bind(Utc::now().to_string())
    .execute(&pool)
    .await;

    Json(json!({
        "user": user,
        "resource": req.resource,
        "risk_score": risk,
        "decision": decision
    }))
}