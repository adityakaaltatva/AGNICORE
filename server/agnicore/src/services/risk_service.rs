use async_trait::async_trait;
use crate::domain::AccessRequest;
use serde::{Deserialize, Serialize};
use chrono::Utc;
use jsonwebtoken::{decode, Algorithm, DecodingKey, Validation};

#[async_trait]
pub trait RiskService: Send + Sync {
    async fn calculate_risk(&self, request: &AccessRequest) -> Result<i32, crate::errors::AppError>;
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: String,
    pub role: String,   // 🔥 ADD THIS
    pub exp: usize,
}
//
pub struct DefaultRiskService;

#[async_trait]
impl RiskService for DefaultRiskService {
    async fn calculate_risk(&self, request: &AccessRequest) -> Result<i32, crate::errors::AppError> {
        let mut risk = 0;
        if request.resource.contains("admin") {
            risk += 40;
        }
        if request.action == "write" {
            risk += 20;
        }

        // Add risk based on time of day
        let hour = crate::utils::time::current_hour();
        if hour < 6 || hour > 22 {
            risk += 20;
        }

        Ok(risk.min(100))
    }
}

pub fn calculate_risk(
    user: &str,
    resource: &str,
    hour: u32,
    ip: &str,
    request_count: i64,
) -> i32 {

    let mut risk = 0;

    if user == "invalid_user" || user == "expired_user" {
        risk += 50;
    }

    if resource == "admin" {
        risk += 40;
    }

    if hour < 6 || hour > 22 {
        risk += 20;
    }

    if ip.starts_with("192.168") || ip.starts_with("10.") || ip == "127.0.0.1" {
        risk += 5;
    } else {
        risk += 15;
    }

    if request_count > 5 {
        risk += 20;
    }
    if request_count > 10 {
        risk += 30;
    }
    if request_count > 20 {
        risk += 50;
    }

    risk
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