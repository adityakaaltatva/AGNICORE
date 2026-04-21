pub mod access;
pub mod health;

use axum::Router;
use crate::app::AppState;

pub fn create_routes() -> Router<AppState> {
    Router::new()
        .nest("/access", access::create_route())
        .nest("/health", health::create_route())
}