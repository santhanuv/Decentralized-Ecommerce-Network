use anchor_lang::prelude::*;

#[account]
pub struct UserAddress {
    pub user: Pubkey,
    pub country: String,
    pub state: String,
    pub code: String,
    pub locale: String,
}

impl UserAddress {
    pub const DISCRIMINATOR_LENGTH: usize = 8;
    pub const COUNTRY_LENGTH: usize = 60;
    pub const STATE_LENGTH: usize = 60;
    pub const CODE_LENGTH: usize = 50;
    pub const LOCALE_LENGTH: usize = 120;
    pub const BUMP_LEN: usize = 1;

    const STRING_SIZE: usize = 4;
    const STRING_PREFIX_LENGTH: usize = 4;

    pub const SPACE: usize = UserAddress::DISCRIMINATOR_LENGTH
        + UserAddress::STRING_PREFIX_LENGTH 
            + (UserAddress::COUNTRY_LENGTH * UserAddress::STRING_SIZE) // country.
        + UserAddress::STRING_PREFIX_LENGTH 
            + (UserAddress::STATE_LENGTH * UserAddress::STRING_SIZE) // state.
        + UserAddress::STRING_PREFIX_LENGTH 
            + (UserAddress::CODE_LENGTH * UserAddress::STRING_SIZE) // code.
        + UserAddress::STRING_PREFIX_LENGTH 
            + (UserAddress::LOCALE_LENGTH * UserAddress::STRING_SIZE) // locale.
        + UserAddress::BUMP_LEN;

    pub fn new(
        user: Pubkey,
        country: String,
        state: String,
        code: String,
        locale: String,
    ) -> Self {
        Self {
            user,
            country,
            state,
            code,
            locale,
        }
    }
}