use async_trait::async_trait;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct User {
    pub id: Uuid,
    pub username: String,
    pub email: String,
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