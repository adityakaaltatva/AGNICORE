use async_trait::async_trait;
use jsonwebtoken::{decode, Algorithm, DecodingKey, Validation};
use serde::{Deserialize, Serialize};
use std::env;
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

#[derive(Debug, Clone, Deserialize)]
struct Claims {
    sub: String,
    exp: usize,
}

fn jwt_secret() -> Result<String, crate::errors::AppError> {
    let secret = env::var("JWT_SECRET").map_err(|_| crate::errors::AppError::InternalServerError)?;
    if secret.len() < 32 {
        return Err(crate::errors::AppError::InternalServerError);
    }
    Ok(secret)
}

#[async_trait]
impl AuthService for DefaultAuthService {
    async fn authenticate(&self, token: &str) -> Result<User, crate::errors::AppError> {
        let secret = jwt_secret()?;
        let claims = decode::<Claims>(
            token,
            &DecodingKey::from_secret(secret.as_bytes()),
            &Validation::new(Algorithm::HS256),
        )
        .map_err(|_| crate::errors::AppError::Unauthorized)?
        .claims;

        let user_id = Uuid::parse_str(&claims.sub).map_err(|_| crate::errors::AppError::Unauthorized)?;

        Ok(User {
            id: user_id,
            username: "authenticated_user".to_string(),
            email: format!("{}@agnicore.local", user_id),
        })
    }

    async fn validate_token(&self, token: &str) -> Result<bool, crate::errors::AppError> {
        if token.is_empty() {
            return Ok(false);
        }

        let secret = jwt_secret()?;
        Ok(
            decode::<Claims>(
                token,
                &DecodingKey::from_secret(secret.as_bytes()),
                &Validation::new(Algorithm::HS256),
            )
            .is_ok(),
        )
    }
}
