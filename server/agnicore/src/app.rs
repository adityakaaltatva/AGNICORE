use axum::Router;
use sqlx::SqlitePool;
use crate::config::settings::Settings;

#[derive(Clone)]
pub struct AppState {
    pub pool: SqlitePool,
    pub settings: Settings,
}

pub async fn create_app() -> Result<Router, Box<dyn std::error::Error>> {
    // Load settings (placeholder - implement proper loading)
    let settings = Settings::default();
    let pool = crate::db::connection::connect_db(&settings.database_url)
        .await
        .map_err(|e| format!("Failed to connect to database: {}", e))?;

    let state = AppState { pool, settings };

    let app = Router::new()
        .nest("/api", crate::routes::create_routes())
        .with_state(state);

    Ok(app)
}

async fn root() -> &'static str {
    "Agnicore API Server"
}