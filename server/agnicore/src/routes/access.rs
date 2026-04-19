use axum::{routing::post, Router};
use crate::handlers::{access_handler, token_handler};

pub fn create_route() -> Router {
    Router::new()
        .route("/access", post(access_handler::handle_access))
        .route("/token", post(token_handler::issue_token))
}