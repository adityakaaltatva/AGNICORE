use axum::{routing::{get, post}, Router};
use std::sync::Arc;
use crate::handlers::{access_handler, token_handler, metrics_handler};
use crate::repository::log_repository::LogRepository;

pub fn create_route() -> Router<Arc<dyn LogRepository>> {
    Router::new()
        .route("/access", post(access_handler::handle_access))
        .route("/token", post(token_handler::issue_token))
        .route("/logs", get(access_handler::handle_get_logs))
        .route("/metrics", get(metrics_handler::handle_get_metrics))
}