use sqlx::SqlitePool;
use uuid::Uuid;
use chrono::{Duration, Utc};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    dotenvy::dotenv().ok();
    let database_url = std::env::var("DATABASE_URL").unwrap_or_else(|_| "sqlite:agnicore.db".to_string());
    let pool = SqlitePool::connect(&database_url).await?;

    let users = ["admin", "john.doe", "attacker", "jane.smith", "bob.wilson"];
    let resources = ["finance/reports", "engineering/ci", "admin/root", "sales/portal", "ops/observability"];
    let decisions = ["ALLOW", "VERIFY", "DENY", "ALLOW", "ALLOW"];
    let risks = [12, 45, 89, 28, 15];

    println!("Seeding database...");

    for i in 0..users.len() {
        let created_at = (Utc::now() - Duration::hours(i as i64)).to_rfc3339();
        
        sqlx::query(
            "INSERT INTO logs (id, user, resource, risk_score, decision, created_at)
             VALUES (?, ?, ?, ?, ?, ?)"
        )
        .bind(Uuid::new_v4().to_string())
        .bind(users[i])
        .bind(resources[i])
        .bind(risks[i])
        .bind(decisions[i])
        .bind(created_at)
        .execute(&pool).await?;
    }

    println!("Database seeded successfully!");
    Ok(())
}
