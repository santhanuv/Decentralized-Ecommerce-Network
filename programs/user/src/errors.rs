use anchor_lang::prelude::error_code;

#[error_code]
pub enum UserDataError {
    #[msg("The provided firstname is too long")]
    FirstNameTooLong,
    #[msg("The provided lastname is too long")]
    LastNameTooLong,
    #[msg("The provided email is too long")]
    EmailTooLong,
    #[msg("The provided profile-image-link is too long")]
    ProfileImageTooLong,
    #[msg("The provided contact number is invalid")]
    ContactNumberTooLong,
    #[msg("Unable to retrieve bump")]
    BumpError,
    #[msg("Unable to create a user account")]
    UserCreationFailed,
    #[msg("User account already exists")]
    ReinitializationError,
}

#[error_code]
pub enum UserAddressError {
    #[msg("Country Length should be less than 60 characters")]
    CountryLengthTooLong,
    #[msg("State Length should be less than 60 characters")]
    StateLengthTooLong,
    #[msg("Code Length should be less than 50 characters")]
    CodeLengthTooLong,
    #[msg("Locale Length should be less than 120 characters")]
    LocaleLengthTooLong,
}
