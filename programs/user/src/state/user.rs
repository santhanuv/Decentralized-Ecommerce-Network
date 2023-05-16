use anchor_lang::prelude::*;

#[account]
pub struct UserProfile {
    pub firstname: String,
    pub lastname: String,
    pub profile_image: String,
    pub email: String,
    pub contact_number: String,
    pub joined_at: i64,
    pub bump: u8,
}

impl UserProfile {
    pub const DISCRIMINATOR_LENGTH: usize = 8;
    pub const BUMP_LEN: usize = 1;
    pub const JOINED_AT_LEN: usize = 8;
    pub const FIRSTNAME_LEN: usize = 40;
    pub const LASTNAME_LEN: usize = 80;
    pub const PROFILE_IMAGE_LEN: usize = 50;
    pub const EMAIL_LEN: usize = 120;
    pub const CONTACT_NUMBER_LEN: usize = 10;

    const STRING_SIZE: usize = 4;
    const STRING_PREFIX_LENGTH: usize = 4;

    pub const SPACE: usize = UserProfile::DISCRIMINATOR_LENGTH
        + UserProfile::BUMP_LEN
        + UserProfile::JOINED_AT_LEN
        + UserProfile::STRING_PREFIX_LENGTH
        + (UserProfile::FIRSTNAME_LEN * UserProfile::STRING_SIZE)
        + UserProfile::STRING_PREFIX_LENGTH
        + (UserProfile::LASTNAME_LEN * UserProfile::STRING_SIZE)
        + UserProfile::STRING_PREFIX_LENGTH
        + (UserProfile::PROFILE_IMAGE_LEN * UserProfile::STRING_SIZE)
        + UserProfile::STRING_PREFIX_LENGTH
        + (UserProfile::EMAIL_LEN * UserProfile::STRING_SIZE)
        + UserProfile::STRING_PREFIX_LENGTH
        + (UserProfile::CONTACT_NUMBER_LEN * UserProfile::STRING_SIZE);

    pub fn new(
        firstname: String,
        lastname: String,
        profile_image: String,
        email: String,
        contact_number: String,
        joined_at: i64,
        bump: u8,
    ) -> Self {
        Self {
            firstname,
            lastname,
            profile_image,
            email,
            contact_number,
            joined_at,
            bump,
        }
    }
}
