mod handlers;
mod app;
mod config;
mod routes;

use std::net::SocketAddr;
use tokio::net::TcpListener;
use axum::extract::connect_info::IntoMakeServiceWithConnectInfo;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};
mod errors;
mod db;
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

    // 🔹 Build router
    let app = app::create_app().await?;

    // 🔹 Bind server
    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
    tracing::info!("listening on {}", addr);

    let listener = TcpListener::bind(addr).await?;
    axum::serve(
        listener,
        app.into_make_service_with_connect_info::<SocketAddr>(),
    )
    .await?;

    Ok(())
}