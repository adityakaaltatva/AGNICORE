use axum::{Router, routing::get};
use sqlx::SqlitePool;

use crate::config::settings::Settings;
use crate::handlers::{access_handler, analytics_handler};

#[derive(Clone)]
pub struct AppState {
    pub pool: SqlitePool,
    pub settings: Settings,
}

pub async fn create_app() -> Result<Router, Box<dyn std::error::Error>> {
    // 🔹 Load settings
    let settings = Settings::default();

    // 🔹 Connect DB
    let pool = crate::db::connection::connect_db(&settings.database_url)
        .await
        .map_err(|e| format!("DB connection failed: {}", e))?;

    let state = AppState { pool, settings };

    // 🔹 API routes (grouped)
    let api_routes = Router::new()
        .route("/access", axum::routing::post(access_handler::handle_access))
        .route("/analytics", get(analytics_handler::get_analytics));

    // 🔹 Build app
    let app = Router::new()
        .route("/", get(root))                  // health/root
        .nest("/api", api_routes)               // main API
        .with_state(state);

    Ok(app)
}

// 🔹 Root endpoint
async fn root() -> &'static str {
    "Agnicore API Server Running"
}