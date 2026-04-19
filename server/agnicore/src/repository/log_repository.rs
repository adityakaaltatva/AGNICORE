use async_trait::async_trait;
use crate::domain::AccessRequest;

#[async_trait]
pub trait LogRepository: Send + Sync {
    async fn log_access(&self, request: &AccessRequest, decision: &str) -> Result<(), crate::errors::AppError>;
}

pub struct DefaultLogRepository;

#[async_trait]
impl LogRepository for DefaultLogRepository {
    async fn log_access(&self, request: &AccessRequest, decision: &str) -> Result<(), crate::errors::AppError> {
        // TODO: Implement actual logging to database
        tracing::info!("Access logged: user={}, resource={}, decision={}", request.user_id, request.resource, decision);
        Ok(())
    }
}