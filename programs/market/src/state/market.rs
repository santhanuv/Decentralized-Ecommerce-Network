use anchor_lang::prelude::*;

#[account]
pub struct Market {
    pub owner: Pubkey,
    pub name: String,
    pub description: String,
    pub created_at: i64,
    pub cover_image: String,
}

impl Market {
    pub const DISCRIMINATOR_LENGTH: usize = 8;
    pub const PUBLIC_KEY_LENGTH: usize = 32;
    pub const BUMP_LEN: usize = 1;
    pub const CREATED_AT_LEN: usize = 8;
    pub const NAME_LEN: usize = 60;
    pub const DESCRIPTION_LEN: usize = 280;
    pub const COVER_IMAGE_LEN: usize = 50;

    const STRING_SIZE: usize = 4;
    const STRING_PREFIX_LENGTH: usize = 4;

    pub const SPACE: usize = Market::DISCRIMINATOR_LENGTH
        + Market::PUBLIC_KEY_LENGTH
        + Market::BUMP_LEN
        + Market::CREATED_AT_LEN
        + (Market::NAME_LEN * Market::STRING_SIZE)
        + Market::STRING_PREFIX_LENGTH
        + (Market::DESCRIPTION_LEN * Market::STRING_SIZE)
        + Market::STRING_PREFIX_LENGTH
        + (Market::COVER_IMAGE_LEN * Market::STRING_SIZE)
        + Market::STRING_PREFIX_LENGTH;

    pub fn new(
        owner: Pubkey,
        name: String,
        description: String,
        created_at: i64,
        cover_image: String,
    ) -> Self {
        Self {
            owner,
            name,
            description,
            created_at,
            cover_image,
        }
    }
}
