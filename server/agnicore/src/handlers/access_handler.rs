use std::sync::Arc;

use axum::extract::{Json, State};
use serde::Deserialize;
use serde_json::json;
use crate::repository::log_repository::LogRepository;
use crate::services::auth_service::{AuthService, DefaultAuthService};
use crate::services::risk_service::{RiskService, DefaultRiskService};
use crate::services::policy_service::{PolicyService, DefaultPolicyService};
use crate::services::context_service::{ContextService, DefaultContextService};
use crate::domain::AccessRequest as DomainAccessRequest;

#[derive(Deserialize)]
pub struct AccessRequest {
    pub token: String,
    pub resource: String,
    pub action: Option<String>,
}

fn validate_resource(resource: &str) -> Result<(), crate::errors::AppError> {
    let trimmed = resource.trim();
    let is_valid = !trimmed.is_empty()
        && trimmed.len() <= 128
        && trimmed
            .chars()
            .all(|ch| ch.is_ascii_alphanumeric() || matches!(ch, '/' | '_' | '-' | '.' | ' '));

    if is_valid {
        Ok(())
    } else {
        Err(crate::errors::AppError::BadRequest(
            "resource must be 1-128 chars and only contain letters, numbers, /, _, -, or .".to_string(),
        ))
    }
}

pub async fn handle_access(
    State(repo): State<Arc<dyn LogRepository>>,
    Json(req): Json<AccessRequest>,
) -> Result<Json<serde_json::Value>, crate::errors::AppError> {
    validate_resource(&req.resource)?;

    // Approach B: Direct Instantiation
    let auth_service = DefaultAuthService;
    let risk_service = DefaultRiskService;
    let policy_service = DefaultPolicyService;
    let context_service = DefaultContextService;

    // 1. Authenticate
    let user = auth_service.authenticate(&req.token).await?;

    // 2. Prepare domain request
    let mut domain_req = DomainAccessRequest {
        user_id: user.id,
        resource: req.resource.clone(),
        action: req.action.unwrap_or_else(|| "read".to_string()),
    };

    // 3. Enrich context
    context_service.enrich_context(&mut domain_req).await?;

    // 4. Evaluate Policy
    let risk_score = risk_service.calculate_risk(&domain_req).await?;
    let decision_res = policy_service.evaluate_policy(&domain_req, risk_score).await?;

    // Use the risk score from risk_service if it's more dynamic
    let final_risk = risk_score.max(decision_res.risk_score);
    let final_decision = if final_risk >= 60 {
        "DENY"
    } else if final_risk >= 30 {
        "VERIFY"
    } else {
        "ALLOW"
    };

    // PERSIST
    repo.log_access(&user.id.to_string(), &req.resource, final_risk, final_decision).await?;

    Ok(Json(json!({
        "user": user.username,
        "user_id": user.id,
        "resource": req.resource,
        "risk_score": final_risk,
        "decision": final_decision,
        "reason": decision_res.reason
    })))
}

pub async fn handle_get_logs(
    State(repo): State<Arc<dyn LogRepository>>,
) -> Result<Json<Vec<crate::domain::models::LogEntry>>, crate::errors::AppError> {
    let logs = repo.get_recent_logs(50).await?;
    Ok(Json(logs))
}
