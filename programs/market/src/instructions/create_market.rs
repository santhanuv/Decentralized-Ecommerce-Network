use anchor_lang::prelude::*;

use crate::errors::MarketError;
use crate::state::market::Market;

pub fn create_market(
    owner: Pubkey,
    name: String,
    description: String,
    created_at: i64,
    cover_image: String,
) -> Result<Market> {
    if name.chars().count() > Market::NAME_LEN {
        return Err(MarketError::NameTooLong.into());
    }

    if description.chars().count() > Market::DESCRIPTION_LEN {
        return Err(MarketError::DescriptionTooLong.into());
    }

    if cover_image.chars().count() > Market::COVER_IMAGE_LEN {
        return Err(MarketError::CoverImageTooLong.into());
    }

    Ok(Market::new(
        owner,
        name,
        description,
        created_at,
        cover_image,
    ))
}
