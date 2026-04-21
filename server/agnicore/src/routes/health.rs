use axum::{routing::get, Json, Router};
use serde_json::json;
use crate::app::AppState;

pub fn create_route() -> Router<AppState> {
    Router::new().route("/health", get(health_check))
}

async fn health_check() -> Json<serde_json::Value> {
    Json(json!({ "status": "ok", "service": "agnicore" }))
}