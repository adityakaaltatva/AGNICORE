use sqlx::SqlitePool;

pub async fn connect_db() -> SqlitePool {
    SqlitePool::connect("sqlite:agnicore.db")
        .await
        .expect("Failed to connect DB")
}