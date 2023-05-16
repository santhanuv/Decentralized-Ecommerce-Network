use anchor_lang::prelude::*;

use crate::errors::ProductDataError;
use crate::state::product::Product;

pub fn update_product_checkup(
    title: &String,
    description: &String,
    storage_id: &String,
) -> Result<()> {
    if title.chars().count() > Product::TITLE_LENGTH {
        return Err(ProductDataError::TitleTooLong.into());
    }

    if description.chars().count() > Product::DESCRIPTION_LENGTH {
        return Err(ProductDataError::DescriptionTooLong.into());
    }

    if storage_id.chars().count() > Product::STORAGE_ID_LENGTH {
        return Err(ProductDataError::StorageIDTooLong.into());
    }

    Ok(())
}
