pub mod access;
pub mod health;
pub mod mfa;

use axum::Router;
use axum::routing::get;
use std::sync::Arc;
use crate::repository::log_repository::LogRepository;
use crate::handlers::analytics_handler;

pub fn create_routes() -> Router<Arc<dyn LogRepository>> {
    Router::new()
        .nest("/access", access::create_route())
        .nest("/health", health::create_route())
        .nest("/mfa", mfa::create_route())
        .route("/analytics", get(analytics_handler::get_analytics))
}