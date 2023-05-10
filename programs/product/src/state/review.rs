use anchor_lang::prelude::*;

#[account]
pub struct Review {
    pub product: Pubkey,
    pub user: Pubkey,
    pub rating: f64,
    pub title: String,
    pub content: String,
    pub created_at: i64,
    pub last_updated: i64,
}

impl Review {
    pub const DISCRIMINATOR_LENGTH: usize = 8;
    pub const PUBLIC_KEY_LENGTH: usize = 32;
    pub const TIMESTAMP_LENGTH: usize = 8;
    pub const RATING_LENGTH: usize = 8;
    pub const TITLE_LENGTH: usize = 80;
    pub const CONTENT_LENGTH: usize = 50;

    const STRING_SIZE: usize = 4;
    const STRING_PREFIX_LENGTH: usize = 4;

    pub const SPACE: usize = Review::DISCRIMINATOR_LENGTH
        + Review::PUBLIC_KEY_LENGTH // Product
        + Review::PUBLIC_KEY_LENGTH // User
        + Review::RATING_LENGTH
        + Review::STRING_PREFIX_LENGTH 
            + (Review::TITLE_LENGTH * Review::STRING_SIZE)
        + Review::STRING_PREFIX_LENGTH
            + (Review::CONTENT_LENGTH * Review::STRING_SIZE)
        + Review::TIMESTAMP_LENGTH // Created At
        + Review::TIMESTAMP_LENGTH; // Updated At

    pub fn new(
        product: Pubkey,
        user: Pubkey,
        rating: f64,
        title: String,
        content: String,
        created_at: i64,
        last_updated: i64,
    ) -> Self {
        Self {
            product,
            user,
            rating,
            title,
            content,
            created_at,
            last_updated,
        }
    }
}
