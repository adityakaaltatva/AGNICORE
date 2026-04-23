use axum::{routing::post, Router};
use std::sync::Arc;
use crate::handlers::mfa_handler;
use crate::repository::log_repository::LogRepository;

pub fn create_route() -> Router<Arc<dyn LogRepository>> {
    Router::new()
        .route("/setup", post(mfa_handler::setup_mfa))
        .route("/verify", post(mfa_handler::verify_mfa))
}