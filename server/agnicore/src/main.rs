mod app;
mod config;
mod db;
mod errors;
mod handlers;
mod routes;
mod domain;
mod repository;
mod services;
mod middleware;
mod utils;
mod errors;
mod db;

use std::sync::Arc;

use std::net::SocketAddr;
use tokio::net::TcpListener;
use axum::{routing::get, Router};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};


#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    dotenvy::dotenv().ok();

    // 🔹 Initialize logging
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "agnicore=debug,tower_http=debug".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    // 🔹 Initialize Database Schema
    let pool = db::connection::connect_db().await?;
    sqlx::query(
        "CREATE TABLE IF NOT EXISTS logs (
            id TEXT PRIMARY KEY,
            user TEXT NOT NULL,
            resource TEXT NOT NULL,
            risk_score INTEGER NOT NULL,
            decision TEXT NOT NULL,
            created_at TEXT NOT NULL
        )"
    )
    .execute(&pool)
    .await?;

    // 🔹 Build router
    let log_repo = Arc::new(repository::log_repository::SqliteLogRepository::new(pool.clone()));
    
    let cors = tower_http::cors::CorsLayer::new()
        .allow_origin("http://localhost:5173".parse::<axum::http::HeaderValue>().unwrap())
        .allow_methods([axum::http::Method::GET, axum::http::Method::POST])
        .allow_headers([axum::http::HeaderName::from_static("content-type")]);

    let app = Router::new()
        .route("/", get(root))
        .nest("/api", routes::create_routes())
        .with_state(log_repo)
        .layer(cors);

    // 🔹 Server address
    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
    tracing::info!("listening on {}", addr);

    // 🔹 Bind TCP listener
    let listener = TcpListener::bind(addr).await?;

    // 🔹 Start server with client IP support
    axum::serve(
        listener,
        app.into_make_service_with_connect_info::<SocketAddr>(),
    )
    .await?;

    Ok(())
}

async fn root() -> &'static str {
    "Agnicore running"
}
