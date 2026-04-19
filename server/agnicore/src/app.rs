use axum::Router;

#[derive(Clone)]
pub struct AppState {
    // Add your shared state here
}

pub async fn create_app() -> Result<Router, Box<dyn std::error::Error>> {
    let app = Router::new()
        .nest("/api", crate::routes::create_routes());

    Ok(app)
}

async fn root() -> &'static str {
    "Agnicore API Server"
}