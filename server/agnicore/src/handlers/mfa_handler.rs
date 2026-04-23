use axum::Json;
use serde::Deserialize;
use serde_json::json;

use crate::services::mfa_service;

pub async fn setup_mfa() -> Json<serde_json::Value> {
    let secret = mfa_service::generate_secret();
    let url = mfa_service::generate_otpauth_url("user123", &secret);

    Json(json!({
        "secret": secret,
        "qr_url": url
    }))
}

#[derive(Deserialize)]
pub struct VerifyRequest {
    pub secret: String,
    pub code: String,
}

pub async fn verify_mfa(
    Json(req): Json<VerifyRequest>
) -> Json<serde_json::Value> {

    let valid = mfa_service::verify_otp(&req.secret, &req.code);

    Json(json!({
        "valid": valid
    }))
}