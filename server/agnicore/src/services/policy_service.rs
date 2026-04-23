use async_trait::async_trait;

use crate::domain::{AccessRequest, AccessDecision};
use crate::errors::app_error::AppError;

#[async_trait]
pub trait PolicyService: Send + Sync {
    async fn evaluate_policy(
        &self,
        request: &AccessRequest,
    ) -> Result<AccessDecision, AppError>;
}

pub struct DefaultPolicyService;

#[async_trait]
impl PolicyService for DefaultPolicyService {
    async fn evaluate_policy(
        &self,
        request: &AccessRequest,
    ) -> Result<AccessDecision, AppError> {

        // 🔥 STEP 1 — Extract context
        let user = &request.user;
        let role = &request.role;
        let resource = &request.resource;
        let risk_score = request.risk_score;
        let device_trust = request.device_trust;
        let request_count = request.request_count;

        // 🔥 STEP 2 — Role-based restriction
        if resource == "admin" && role != "admin" {
            return Ok(AccessDecision {
                allowed: false,
                decision: "DENY".to_string(),
                risk_score,
                reason: "Unauthorized role attempting admin access".to_string(),
                mfa_required: false,
            });
        }

        // 🔥 STEP 3 — Device trust check
        if device_trust == 0 {
            return Ok(AccessDecision {
                allowed: false,
                decision: "CHALLENGE".to_string(),
                risk_score,
                reason: "Unknown device detected".to_string(),
                mfa_required: true,
            });
        }

        // 🔥 STEP 4 — Behavior anomaly (burst traffic)
        if request_count > 20 {
            return Ok(AccessDecision {
                allowed: false,
                decision: "DENY".to_string(),
                risk_score,
                reason: "Abnormal request frequency detected".to_string(),
                mfa_required: false,
            });
        }

        // 🔥 STEP 5 — Risk-based decision (core logic)
        let (decision, allowed, mfa_required, reason) = if risk_score < 40 {
            (
                "ALLOW",
                true,
                false,
                "Low risk access",
            )
        } else if risk_score < 70 {
            (
                "CHALLENGE",
                false,
                true,
                "Medium risk - MFA required",
            )
        } else {
            (
                "DENY",
                false,
                false,
                "High risk access denied",
            )
        };

        // 🔥 STEP 6 — Return final decision
        Ok(AccessDecision {
            allowed,
            decision: decision.to_string(),
            risk_score,
            reason: reason.to_string(),
            mfa_required,
        })
    }
}