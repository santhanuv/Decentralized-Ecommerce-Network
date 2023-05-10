use anchor_lang::prelude::*;

#[account]
pub struct Product {
    pub market: Pubkey,
    pub seller: Pubkey,
    pub timestamp: i64,
    pub price: u64,
    pub rating: f64,
    pub inventory: u32,
    pub title: String,
    pub description: String,
    pub storage_id: String, // for storing images and other details about the product
}

impl Product {
    pub const DISCRIMINATOR_LENGTH: usize = 8;
    pub const PUBLIC_KEY_LENGTH: usize = 32;
    pub const TIMESTAMP_LENGTH: usize = 8;
    pub const PRICE_LENGTH: usize = 8;
    pub const RATING_LENGTH: usize = 8;
    pub const INVENTORY_LENGTH: usize = 4;
    pub const TITLE_LENGTH: usize = 80;
    pub const DESCRIPTION_LENGTH: usize = 280; // 280 chars max.
    pub const STORAGE_ID_LENGTH: usize = 50;
    
    // 80 chars max and 4 bytes in the maximum size of unicode character
    const STRING_SIZE: usize = 4;
    const STRING_PREFIX_LENGTH: usize = 4; // For storing metadata about string (eg: string length)

    pub const SPACE: usize = Product::DISCRIMINATOR_LENGTH
        + Product::PUBLIC_KEY_LENGTH // Market.
        + Product::PUBLIC_KEY_LENGTH // Seller
        + Product::TIMESTAMP_LENGTH // Timestamp.
        + Product::PRICE_LENGTH //price
        + Product::RATING_LENGTH // rating
        + Product::INVENTORY_LENGTH // inventory
        + Product::STRING_PREFIX_LENGTH 
            + (Product::TITLE_LENGTH * Product::STRING_SIZE) // Title.
        + Product::STRING_PREFIX_LENGTH 
            + (Product::DESCRIPTION_LENGTH * Product::STRING_SIZE) // Description.
        + Product::STRING_PREFIX_LENGTH
            + (Product::STORAGE_ID_LENGTH * Product::STRING_SIZE); // storage_id

    pub fn new(
        market: Pubkey,
        seller: Pubkey,
        timestamp: i64,
        price: u64,
        rating: f64,
        inventory: u32,
        title: String,
        description: String,
        storage_id: String,
    ) -> Self {
        Self {
            market,
            seller,
            timestamp,
            price,
            rating,
            inventory,
            title,
            description,
            storage_id,
        }
    }
}
