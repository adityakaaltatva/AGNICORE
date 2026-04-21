use sqlx::SqlitePool;

pub async fn connect_db(database_url: &str) -> Result<SqlitePool, sqlx::Error> {
    SqlitePool::connect(database_url).await
}