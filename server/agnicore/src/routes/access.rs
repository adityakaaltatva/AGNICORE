use axum::{routing::post, Router};
use crate::handlers::{access_handler, token_handler};
use crate::app::AppState;

pub fn create_route() -> Router<AppState> {
    Router::new()
        .route("/access", post(access_handler::handle_access))
        .route("/token", post(token_handler::issue_token))
}