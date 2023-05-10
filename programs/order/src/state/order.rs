use anchor_lang::prelude::*;

#[account]
pub struct Order {
    pub product: Pubkey,
    pub buyer: Pubkey,
    pub seller: Pubkey,
    pub address: Pubkey,
    pub is_accepted: bool,
    pub is_completed: bool,
    pub quantity: u32,
    pub product_charge: u64,
    pub delivery_charge: u64,
    pub ordered_at: i64,
    pub expected_at: i64,
}

impl Order {
    pub const DISCRIMINATOR_LENGTH: usize = 8;
    pub const PUBLIC_KEY_LENGTH: usize = 32;
    pub const TIMESTAMP_LENGTH: usize = 8;
    pub const ACCEPTED_LENGTH: usize = 1;
    pub const COMPLETED_LENGTH: usize = 1;
    pub const QUANTITY_LENGTH: usize = 4;
    pub const PRICE_LENGTH: usize = 8;

    // const STRING_SIZE: usize = 4;
    // const STRING_PREFIX_LENGTH: usize = 4;

    pub const SPACE: usize = Order::DISCRIMINATOR_LENGTH
        + Order::PUBLIC_KEY_LENGTH // product
        + Order::PUBLIC_KEY_LENGTH // buyer
        + Order::PUBLIC_KEY_LENGTH // seller
        + Order::PUBLIC_KEY_LENGTH // address
        + Order::ACCEPTED_LENGTH // accepted
        + Order::COMPLETED_LENGTH // completed
        + Order::QUANTITY_LENGTH // quantity
        + Order::PRICE_LENGTH // order price
        + Order::PRICE_LENGTH // delivery price
        + Order::TIMESTAMP_LENGTH // ordered_at
        + Order::TIMESTAMP_LENGTH; // expected_at

    pub fn new(
        product: Pubkey,
        buyer: Pubkey,
        seller: Pubkey,
        address: Pubkey,
        is_accepted: bool,
        is_completed: bool,
        quantity: u32,
        product_charge: u64,
        delivery_charge: u64,
        ordered_at: i64,
        expected_at: i64,
    ) -> Self {
        Self {
            product,
            buyer,
            seller,
            address,
            is_accepted,
            is_completed,
            quantity,
            product_charge,
            delivery_charge,
            ordered_at,
            expected_at,
        }
    }
}
