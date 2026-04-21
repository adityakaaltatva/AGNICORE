use axum::{extract::State, Json};
use serde::{Deserialize, Serialize};
use jsonwebtoken::{encode, Header, EncodingKey, Algorithm};
use chrono::{Utc, Duration};
use crate::app::AppState;
use crate::errors::app_error::AppError;

#[derive(Deserialize)]
pub struct TokenRequest {
    pub user_id: String,
    pub role: String,
}

#[derive(Serialize)]
pub struct TokenResponse {
    pub token: String,
}

#[derive(Serialize, Deserialize)]
struct Claims {
    sub: String,
    role: String,
    exp: usize,
}

pub async fn issue_token(
    State(state): State<AppState>,
    Json(req): Json<TokenRequest>,
) -> Result<Json<TokenResponse>, AppError> {
    let expiration = Utc::now()
        .checked_add_signed(Duration::hours(state.settings.jwt_expiry_hours))
        .expect("valid timestamp")
        .timestamp() as usize;

    let claims = Claims {
        sub: req.user_id.clone(),
        role: req.role.clone(),
        exp: expiration,
    };

    let header = Header::new(Algorithm::HS256);
    let encoding_key = EncodingKey::from_secret(state.settings.jwt_secret.as_ref());
    let token = encode(&header, &claims, &encoding_key)
        .map_err(|e| AppError::InternalServerError)?;

    Ok(Json(TokenResponse { token }))
}