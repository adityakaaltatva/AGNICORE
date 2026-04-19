pub mod access;
pub mod health;

use axum::Router;

pub fn create_routes() -> Router {
    Router::new()
        .nest("/access", access::create_route())
        .nest("/health", health::create_route())
}