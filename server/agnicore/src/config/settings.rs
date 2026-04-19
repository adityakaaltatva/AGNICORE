use serde::Deserialize;

#[derive(Debug, Clone, Deserialize)]
pub struct Settings {
    pub database_url: String,
    pub jwt_secret: String,
    pub jwt_expiry_hours: i64,
    pub server_port: u16,
}

impl Default for Settings {
    fn default() -> Self {
        Self {
            database_url: "sqlite::memory:".to_string(),
            jwt_secret: "your-secret-key".to_string(),
            jwt_expiry_hours: 24,
            server_port: 3000,
        }
    }
}