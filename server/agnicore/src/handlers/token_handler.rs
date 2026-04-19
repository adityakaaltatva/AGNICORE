use axum::Json;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Deserialize)]
pub struct TokenRequest {
    pub user_id: String,
    pub role: String,
}

#[derive(Serialize)]
pub struct TokenResponse {
    pub token: String,
}

/// Issue a JWT for testing — remove in real prod, or guard with admin secret.
pub async fn issue_token(
    Json(req): Json<TokenRequest>,
) -> Result<Json<TokenResponse>, crate::errors::AppError> {
    // TODO: Implement proper JWT token issuance
    // For now, return a mock token
    let token = format!("mock_jwt_{}_{}", req.user_id, Uuid::new_v4());
    Ok(Json(TokenResponse { token }))
}