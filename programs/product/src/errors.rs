use anchor_lang::error_code;

#[error_code]
pub enum ProductDataError {
    #[msg("The provided title can't be more than 80 characters")]
    TitleTooLong,
    #[msg("The provided description can't be more than 280 characters")]
    DescriptionTooLong,
    #[msg("The provided storage_id can't be more than 43 characters")]
    StorageIDTooLong,
    #[msg("Market is not owned by the seller")]
    MarketAuthErr,
}

#[error_code]
pub enum ReviewDataError {
    #[msg("Title should be less than 80 characters")]
    TitleTooLong,
    #[msg("Invalid content url")]
    InvalidContent,
    #[msg("Rating should be between 0-5")]
    InvalidRating,
}
