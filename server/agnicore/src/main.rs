mod handlers;

use std::net::SocketAddr;
use tokio::net::TcpListener;
use axum::{routing::post, Router};
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

    // 🔹 Build router (TEMP — until full app.rs is ready)
    let app = Router::new()
        .route("/", axum::routing::get(root))
        .route("/access", post(handlers::access_handler::handle_access));

    // 🔹 Bind server
    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
    tracing::info!("listening on {}", addr);

    let listener = TcpListener::bind(addr).await?;
    axum::serve(listener, app).await?;

    Ok(())
}

async fn root() -> &'static str {
    "Agnicore running"
}