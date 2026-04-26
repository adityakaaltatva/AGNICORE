use async_trait::async_trait;
use sqlx::SqlitePool;
use crate::domain::models::LogEntry;
use chrono::Utc;
use uuid::Uuid;

#[async_trait]
pub trait LogRepository: Send + Sync {
    async fn log_access(&self, user: &str, resource: &str, risk: i32, decision: &str) -> Result<(), crate::errors::AppError>;
    async fn get_recent_logs(&self, limit: i64) -> Result<Vec<LogEntry>, crate::errors::AppError>;
    async fn count_recent_requests(&self, user: &str, minutes: i64) -> Result<i64, crate::errors::AppError>;
}

pub struct SqliteLogRepository {
    pool: SqlitePool,
}

impl SqliteLogRepository {
    pub fn new(pool: SqlitePool) -> Self {
        Self { pool }
    }
}

#[async_trait]
impl LogRepository for SqliteLogRepository {
    async fn log_access(&self, user: &str, resource: &str, risk: i32, decision: &str) -> Result<(), crate::errors::AppError> {
        sqlx::query(
            "INSERT INTO logs (id, user, resource, risk_score, decision, created_at)
             VALUES (?, ?, ?, ?, ?, ?)"
        )
        .bind(Uuid::new_v4().to_string())
        .bind(user)
        .bind(resource)
        .bind(risk)
        .bind(decision)
        .bind(Utc::now().to_rfc3339())
        .execute(&self.pool)
        .await
        .map_err(|e| {
            tracing::error!("Database error logging access: {e}");
            crate::errors::AppError::InternalServerError
        })?;
        Ok(())
    }

    async fn get_recent_logs(&self, limit: i64) -> Result<Vec<LogEntry>, crate::errors::AppError> {
        let logs = sqlx::query_as::<_, LogEntry>(
            "SELECT id, user, resource, risk_score, decision, created_at FROM logs ORDER BY created_at DESC LIMIT ?"
        )
        .bind(limit)
        .fetch_all(&self.pool)
        .await
        .map_err(|e| {
            tracing::error!("Database error fetching logs: {e}");
            crate::errors::AppError::InternalServerError
        })?;
        Ok(logs)
    }

    async fn count_recent_requests(
        &self,
        user: &str,
        minutes: i64,
    ) -> Result<i64, crate::errors::AppError> {
        let count: i64 = sqlx::query_scalar(
            "SELECT COUNT(*) FROM logs WHERE user = ? AND created_at > datetime('now', ?)"
        )
        .bind(user)
        .bind(format!("-{minutes} minutes"))
        .fetch_one(&self.pool)
        .await
        .map_err(|e| {
            tracing::error!("Database error counting recent requests: {e}");
            crate::errors::AppError::InternalServerError
        })?;
        Ok(count)
    }
}