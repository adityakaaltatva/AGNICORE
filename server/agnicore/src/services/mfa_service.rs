use oath::totp_raw;
use rand::{Rng, distributions::Alphanumeric};

const TOTP_STEP: u64 = 30;
const DIGITS: u32 = 6;

pub fn generate_secret() -> String {
    rand::thread_rng()
        .sample_iter(&Alphanumeric)
        .take(32)
        .map(char::from)
        .collect()
}

pub fn verify_otp(secret: &str, code: &str) -> bool {
    let expected = totp_raw(
        secret.as_bytes(),
        6,
        0,
        TOTP_STEP,
    );

    format!("{:06}", expected) == code
}

pub fn generate_otpauth_url(user: &str, secret: &str) -> String {
    format!(
        "otpauth://totp/Agnicore:{}?secret={}&issuer=Agnicore",
        user, secret
    )
}