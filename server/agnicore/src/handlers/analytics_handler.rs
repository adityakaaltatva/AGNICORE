use axum::{extract::State, Json};
use serde_json::json;

use crate::app::AppState;
use crate::errors::app_error::AppError;

pub async fn get_analytics(
    State(state): State<AppState>,
) -> Result<Json<serde_json::Value>, AppError> {

    // 🔹 Total requests
    let total_requests: i64 = sqlx::query_scalar(
        "SELECT COUNT(*) FROM logs"
    )
    .fetch_one(&state.pool)
    .await
    .unwrap_or(0);

    // 🔹 Average risk
    let avg_risk: f64 = sqlx::query_scalar(
        "SELECT AVG(risk_score) FROM logs"
    )
    .fetch_one(&state.pool)
    .await
    .unwrap_or(0.0);

    // 🔹 Denied requests
    let denied_count: i64 = sqlx::query_scalar(
        "SELECT COUNT(*) FROM logs WHERE decision = 'DENY'"
    )
    .fetch_one(&state.pool)
    .await
    .unwrap_or(0);

    // 🔹 Top risky users
    let risky_users = sqlx::query_as::<_, (String, i64)>(
        "SELECT user, COUNT(*) as count 
         FROM logs 
         WHERE risk_score > 50 
         GROUP BY user 
         ORDER BY count DESC 
         LIMIT 5"
    )
    .fetch_all(&state.pool)
    .await
    .unwrap_or(vec![]);

    Ok(Json(json!({
        "total_requests": total_requests,
        "average_risk": avg_risk,
        "denied_requests": denied_count,
        "top_risky_users": risky_users
    })))
}