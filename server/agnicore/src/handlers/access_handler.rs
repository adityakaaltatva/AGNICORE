use axum::{extract::Query, response::Json};
use serde::Deserialize;
use serde_json::json;

#[derive(Deserialize)]
pub struct AccessRequest {
    pub token: String,
    pub resource: String,
}

pub async fn handle_access(
    Query(req): Query<AccessRequest>,
) -> Json<serde_json::Value> {

    // Step 1: Fake token validation
    let user = if req.token == "valid" {
        "user123"
    } else {
        "unknown"
    };

    // Step 2: Risk calculation
    let mut risk = 0;

    if req.resource == "admin" {
        risk += 40;
    }

    if req.token != "valid" {
        risk += 50;
    }

    // Step 3: Decision
    let decision = if risk > 50 {
        "DENY"
    } else {
        "ALLOW"
    };

    Json(json!({
        "user": user,
        "resource": req.resource,
        "risk_score": risk,
        "decision": decision
    }))
}