use anchor_lang::prelude::*;

use crate::errors::UserAddressError;
use crate::state::address::UserAddress;

pub fn create_address_checkup(
    country: &String,
    state: &String,
    code: &String,
    locale: &String,
) -> Result<()> {
    if country.chars().count() > UserAddress::COUNTRY_LENGTH {
        return Err(UserAddressError::CountryLengthTooLong.into());
    }

    if state.chars().count() > UserAddress::STATE_LENGTH {
        return Err(UserAddressError::StateLengthTooLong.into());
    }

    if code.chars().count() > UserAddress::CODE_LENGTH {
        return Err(UserAddressError::CodeLengthTooLong.into());
    }

    if locale.chars().count() > UserAddress::LOCALE_LENGTH {
        return Err(UserAddressError::LocaleLengthTooLong.into());
    }

    Ok(())
}
