use async_trait::async_trait;
use crate::domain::{AccessRequest, AccessDecision};

#[async_trait]
pub trait PolicyService: Send + Sync {
    async fn evaluate_policy(&self, request: &AccessRequest) -> Result<AccessDecision, crate::errors::AppError>;
}

pub struct DefaultPolicyService;

#[async_trait]
impl PolicyService for DefaultPolicyService {
    async fn evaluate_policy(&self, request: &AccessRequest) -> Result<AccessDecision, crate::errors::AppError> {
        // TODO: Implement actual policy evaluation
        // For now, simple rule-based decision
        let risk_score = if request.resource.contains("admin") { 80 } else { 20 };
        let allowed = risk_score < 50;

        Ok(AccessDecision {
            allowed,
            risk_score,
            reason: if allowed { "Policy allows access".to_string() } else { "High risk resource".to_string() },
        })
    }
}