use anchor_lang::prelude::*;

use crate::errors::UserDataError;
use crate::state::user::UserProfile;

pub fn create_user(
    firstname: String,
    lastname: String,
    profile_image: String,
    email: String,
    contact_number: String,
    joined_at: i64,
    bump: u8,
) -> Result<UserProfile> {
    if firstname.chars().count() > UserProfile::FIRSTNAME_LEN {
        return Err(UserDataError::FirstNameTooLong.into());
    }

    if lastname.chars().count() > UserProfile::LASTNAME_LEN {
        return Err(UserDataError::LastNameTooLong.into());
    }

    if profile_image.chars().count() > UserProfile::PROFILE_IMAGE_LEN {
        return Err(UserDataError::ProfileImageTooLong.into());
    }

    if email.chars().count() > UserProfile::EMAIL_LEN {
        return Err(UserDataError::EmailTooLong.into());
    }

    if contact_number.chars().count() > UserProfile::CONTACT_NUMBER_LEN {
        return Err(UserDataError::ContactNumberTooLong.into());
    }

    Ok(UserProfile::new(
        firstname,
        lastname,
        profile_image,
        email,
        contact_number,
        joined_at,
        bump,
    ))
}
