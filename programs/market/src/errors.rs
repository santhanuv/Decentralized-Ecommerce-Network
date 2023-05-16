use anchor_lang::prelude::error_code;

#[error_code]
pub enum MarketError {
    #[msg("The provided name is too long")]
    NameTooLong,
    #[msg("The provided description is too long")]
    DescriptionTooLong,
    #[msg("The provided cover-image-link is too long")]
    CoverImageTooLong,
    #[msg("Unable to retrieve bump")]
    MarketCreationFailed,
    #[msg("User account already exists")]
    ReinitializationError,
}
