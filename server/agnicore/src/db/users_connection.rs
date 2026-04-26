use sqlx::{sqlite::SqlitePoolOptions, SqlitePool};
use std::env;

pub async fn connect_users_db() -> Result<SqlitePool, sqlx::Error> {
    let database_url = env::var("USER_DATABASE_URL").unwrap_or_else(|_| "sqlite:./users.db?mode=rwc".to_string());
    let pool = SqlitePoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await?;
    
    // Initialize users table
    sqlx::query(
        "CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            role TEXT NOT NULL DEFAULT 'user',
            status TEXT NOT NULL DEFAULT 'pending',
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        )"
    )
    .execute(&pool)
    .await?;
    
    Ok(pool)
}