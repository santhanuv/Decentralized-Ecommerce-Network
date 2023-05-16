use anchor_lang::prelude::*;

#[account]
pub struct Cart {
    pub product: Pubkey,
    pub user: Pubkey,
    pub quantity: u32,
    pub bump: u8,
}

impl Cart {
    pub const DISCRIMINATOR_LENGTH: usize = 8;
    pub const PUBLIC_KEY_LENGTH: usize = 32;
    pub const QUANTITY_LENGTH: usize = 4;
    pub const BUMP_LENGTH: usize = 1;

    pub const SPACE: usize = Cart::DISCRIMINATOR_LENGTH
        + ( 2 * Cart::PUBLIC_KEY_LENGTH ) // product + user
        + Cart::QUANTITY_LENGTH
        + Cart::BUMP_LENGTH;

    pub fn new(
        product: Pubkey,
        user: Pubkey,
        quantity: u32,
        bump: u8,
    ) -> Self {
        Self {
            product,
            user,
            quantity,
            bump,
        }
    }
}