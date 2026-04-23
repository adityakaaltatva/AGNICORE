mod app;
mod config;
mod db;
mod domain;
mod errors;
mod handlers;
mod routes;
mod services;

use std::net::SocketAddr;
use tokio::net::TcpListener;
use axum::extract::connect_info::IntoMakeServiceWithConnectInfo;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // 🔹 Initialize logging
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "agnicore=debug,tower_http=debug".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    // 🔹 Build application (router + state)
    let app = app::create_app().await?;

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