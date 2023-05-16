use anchor_lang::prelude::*;

use crate::errors::UserDataError;
use crate::state::user::UserProfile;

pub fn update_user(
    user_profile: &mut Account<UserProfile>,
    firstname: String,
    lastname: String,
    profile_image: String,
    email: String,
    contact_number: String,
) -> Result<()> {
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

    user_profile.firstname = firstname;
    user_profile.lastname = lastname;
    user_profile.profile_image = profile_image;
    user_profile.email = email;
    user_profile.contact_number = contact_number;

    Ok(())
}
