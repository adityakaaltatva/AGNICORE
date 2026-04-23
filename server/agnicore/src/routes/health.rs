use axum::{routing::get, Json, Router};
use std::sync::Arc;
use serde_json::json;
use crate::repository::log_repository::LogRepository;

pub fn create_route() -> Router<Arc<dyn LogRepository>> {
    Router::new().route("/", get(health_check))
}

async fn health_check() -> Json<serde_json::Value> {
    Json(json!({ "status": "ok", "service": "agnicore" }))
}