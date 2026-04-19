use async_trait::async_trait;
use crate::domain::AccessRequest;

#[async_trait]
pub trait RiskService: Send + Sync {
    async fn calculate_risk(&self, request: &AccessRequest) -> Result<i32, crate::errors::AppError>;
}

pub struct DefaultRiskService;

#[async_trait]
impl RiskService for DefaultRiskService {
    async fn calculate_risk(&self, request: &AccessRequest) -> Result<i32, crate::errors::AppError> {
        // TODO: Implement actual risk calculation
        // For now, simple heuristic
        let mut risk = 0;
        if request.resource.contains("admin") {
            risk += 40;
        }
        if request.action == "write" {
            risk += 20;
        }
        Ok(risk)
    }
}