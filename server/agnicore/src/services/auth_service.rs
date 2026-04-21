use async_trait::async_trait;
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use chrono::Utc;
use jsonwebtoken::{decode, Algorithm, DecodingKey, Validation};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct User {
    pub id: Uuid,
    pub username: String,
    pub email: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: String,
    pub role: String,   // 🔥 ADD THIS
    pub exp: usize,
}

#[async_trait]
pub trait AuthService: Send + Sync {
    async fn authenticate(&self, token: &str) -> Result<User, crate::errors::AppError>;
    async fn validate_token(&self, token: &str) -> Result<bool, crate::errors::AppError>;
}

pub struct DefaultAuthService;

#[async_trait]
impl AuthService for DefaultAuthService {
    async fn authenticate(&self, token: &str) -> Result<User, crate::errors::AppError> {
        // TODO: Implement actual authentication logic
        // For now, return a mock user
        if token.is_empty() {
            return Err(crate::errors::AppError::Unauthorized);
        }

        Ok(User {
            id: Uuid::new_v4(),
            username: "test_user".to_string(),
            email: "test@example.com".to_string(),
        })
    }

    async fn validate_token(&self, token: &str) -> Result<bool, crate::errors::AppError> {
        // TODO: Implement actual token validation
        Ok(!token.is_empty())
    }
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