pub mod access;
pub mod health;

use axum::Router;
use std::sync::Arc;
use crate::repository::log_repository::LogRepository;

pub fn create_routes() -> Router<Arc<dyn LogRepository>> {
    Router::new()
        .nest("/access", access::create_route())
        .nest("/health", health::create_route())
}