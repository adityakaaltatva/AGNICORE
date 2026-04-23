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
use std::env;
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
        .allow_origin(tower_http::cors::Any)
        .allow_methods([axum::http::Method::GET, axum::http::Method::POST])
        .allow_headers([
            axum::http::HeaderName::from_static("content-type"),
            axum::http::HeaderName::from_static("authorization"),
        ]);

    let app = Router::new()
        .route("/", get(root))
        .nest("/api", routes::create_routes())
        .with_state(log_repo)
        .layer(cors);

    // 🔹 Bind server
    let port = env::var("PORT").unwrap_or_else(|_| "8080".to_string()).parse::<u16>().unwrap_or(8080);
    let addr = SocketAddr::from(([127, 0, 0, 1], port));
    tracing::info!("listening on {}", addr);

    let listener = TcpListener::bind(addr).await?;
    axum::serve(listener, app).await?;

    Ok(())
}

async fn root() -> &'static str {
    "Agnicore running"
}
