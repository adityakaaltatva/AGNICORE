use std::env;
use sqlx::SqlitePool;

pub async fn connect_db() -> Result<SqlitePool, sqlx::Error> {
    let database_url = env::var("DATABASE_URL").unwrap_or_else(|_| "sqlite:agnicore.db".to_string());
    SqlitePool::connect(&database_url).await
}
