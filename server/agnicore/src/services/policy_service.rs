use async_trait::async_trait;

use crate::domain::{AccessRequest, AccessDecision};
use crate::errors::app_error::AppError;

#[async_trait]
pub trait PolicyService: Send + Sync {
    async fn evaluate_policy(
        &self,
        request: &AccessRequest,
        risk_score: i32,
    ) -> Result<AccessDecision, AppError>;
}

pub struct DefaultPolicyService;

#[async_trait]
impl PolicyService for DefaultPolicyService {
    async fn evaluate_policy(
        &self,
        request: &AccessRequest,
        risk_score: i32,
    ) -> Result<AccessDecision, AppError> {
        // 🔥 STEP 1 — Admin resource requires special scrutiny
        if request.resource.contains("admin") && risk_score > 40 {
            return Ok(AccessDecision {
                allowed: false,
                decision: "DENY".to_string(),
                risk_score,
                reason: "Admin access restricted at elevated risk level".to_string(),
                mfa_required: true,
            });
        }

        // 🔥 STEP 2 — Risk-based decision (core logic)
        let (decision, allowed, mfa_required, reason) = if risk_score < 30 {
            (
                "ALLOW",
                true,
                false,
                "Low risk access",
            )
        } else if risk_score < 60 {
            (
                "VERIFY",
                false,
                true,
                "Medium risk - verification required",
            )
        } else {
            (
                "DENY",
                false,
                false,
                "High risk access denied",
            )
        };

        // 🔥 STEP 3 — Return final decision
        Ok(AccessDecision {
            allowed,
            decision: decision.to_string(),
            risk_score,
            reason: reason.to_string(),
            mfa_required,
        })
    }
}