use sqlx::SqlitePool;
use uuid::Uuid;
use chrono::Utc;

pub async fn count_recent_requests(pool: &SqlitePool, user: &str) -> i64 {
    sqlx::query_scalar(
        "SELECT COUNT(*) FROM logs 
         WHERE user = ? 
         AND datetime(created_at) > datetime('now', '-5 minutes')"
    )
    .bind(user)
    .fetch_one(pool)
    .await
    .unwrap_or(0)
}

pub async fn insert_log(
    pool: &SqlitePool,
    user: &str,
    resource: &str,
    ip: &str,
    risk: i32,
    decision: &str,
) {
    let _ = sqlx::query(
        "INSERT INTO logs (id, user, resource, ip, risk_score, decision, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)"
    )
    .bind(Uuid::new_v4().to_string())
    .bind(user)
    .bind(resource)
    .bind(ip)
    .bind(risk)
    .bind(decision)
    .bind(Utc::now().to_string())
    .execute(pool)
    .await;
}