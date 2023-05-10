use anchor_lang::prelude::*;

use crate::errors::ProductDataError;
use crate::state::product::Product;

pub fn create_product(
    market_key: Pubkey,
    market_owner: Pubkey,
    seller: Pubkey,
    timestamp: i64,
    price: u64,
    rating: f64,
    inventory: u32,
    title: String,
    description: String,
    storage_id: String,
) -> Result<Product> {
    if title.chars().count() > Product::TITLE_LENGTH {
        return Err(ProductDataError::TitleTooLong.into());
    }

    if description.chars().count() > Product::DESCRIPTION_LENGTH {
        return Err(ProductDataError::DescriptionTooLong.into());
    }

    if storage_id.chars().count() > Product::STORAGE_ID_LENGTH {
        return Err(ProductDataError::StorageIDTooLong.into());
    }

    require_keys_eq!(
        seller.key(),
        market_owner.key(),
        ProductDataError::MarketAuthErr
    );

    Ok(Product::new(
        market_key,
        seller,
        timestamp,
        price,
        rating,
        inventory,
        title,
        description,
        storage_id,
    ))
}
