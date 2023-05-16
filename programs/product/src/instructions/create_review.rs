use anchor_lang::prelude::*;

use crate::errors::ReviewDataError;
use crate::state::review::Review;

pub fn create_review(
    product: Pubkey,
    user: Pubkey,
    rating: f64,
    title: String,
    content: String,
    created_at: i64,
    last_updated: i64,
) -> Result<Review> {
    if title.chars().count() > Review::TITLE_LENGTH {
        return Err(ReviewDataError::TitleTooLong.into());
    }

    if content.chars().count() > Review::CONTENT_LENGTH {
        return Err(ReviewDataError::InvalidContent.into());
    }

    if rating < 0.0 || rating > 5.0 {
        return Err(ReviewDataError::InvalidRating.into());
    }

    Ok(Review::new(
        product,
        user,
        rating,
        title,
        content,
        created_at,
        last_updated,
    ))
}
