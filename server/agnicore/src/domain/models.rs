use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AccessRequest {
    pub user_id: Uuid,
    pub resource: String,
    pub action: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AccessDecision {
    pub allowed: bool,
    pub risk_score: i32,
    pub reason: String,
}