use anchor_lang::prelude::*;

use crate::errors::MarketError;
use crate::state::market::Market;

pub fn update_market_checkup(
    name: &String,
    description: &String,
    cover_image: &String,
) -> Result<()> {
    if name.chars().count() > Market::NAME_LEN {
        return Err(MarketError::NameTooLong.into());
    }

    if description.chars().count() > Market::DESCRIPTION_LEN {
        return Err(MarketError::DescriptionTooLong.into());
    }

    if cover_image.chars().count() > Market::COVER_IMAGE_LEN {
        return Err(MarketError::CoverImageTooLong.into());
    }

    Ok(())
}
