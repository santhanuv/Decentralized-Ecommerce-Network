use anchor_lang::prelude::*;
use std::convert::TryFrom;

#[account]
pub struct Order {
    pub product: Pubkey,
    pub buyer: Pubkey,
    pub seller: Pubkey,
    pub address: Pubkey,
    pub is_accepted: bool,
    pub is_confirmed: bool,
    pub is_completed: bool,
    pub canceled: CancelOrder,
    pub quantity: u32,
    pub product_charge: u64,
    pub delivery_charge: u64,
    pub cancel_reason: String,
    pub ordered_at: i64,
    pub expected_at: i64,
    pub bump: u8,
}

impl Order {
    pub const DISCRIMINATOR_LENGTH: usize = 8;
    pub const PUBLIC_KEY_LENGTH: usize = 32;
    pub const TIMESTAMP_LENGTH: usize = 8;
    pub const ACCEPTED_LENGTH: usize = 1;
    pub const CONFIRMED_LENGTH: usize = 1;
    pub const COMPLETED_LENGTH: usize = 1;
    pub const CANCELED_LENGTH: usize = 2;
    pub const QUANTITY_LENGTH: usize = 4;
    pub const PRICE_LENGTH: usize = 8;
    pub const CANCEL_REASON: usize = 120;
    pub const BUMP_LENGTH: usize = 1;

    const STRING_SIZE: usize = 4;
    const STRING_PREFIX_LENGTH: usize = 4;

    pub const SPACE: usize = Order::DISCRIMINATOR_LENGTH
        + Order::PUBLIC_KEY_LENGTH // product
        + Order::PUBLIC_KEY_LENGTH // buyer
        + Order::PUBLIC_KEY_LENGTH // seller
        + Order::PUBLIC_KEY_LENGTH // address
        + Order::ACCEPTED_LENGTH // accepted
        + Order::CONFIRMED_LENGTH // confirmed
        + Order::COMPLETED_LENGTH // completed
        + Order::CANCELED_LENGTH // canceled
        + Order::QUANTITY_LENGTH // quantity
        + Order::PRICE_LENGTH // order price
        + Order::PRICE_LENGTH // delivery price
        + Order::STRING_PREFIX_LENGTH
            + (Order::STRING_SIZE * Order::CANCEL_REASON)
        + Order::TIMESTAMP_LENGTH // ordered_at
        + Order::TIMESTAMP_LENGTH // expected_at
        + Order::BUMP_LENGTH;

    pub fn new(
        product: Pubkey,
        buyer: Pubkey,
        seller: Pubkey,
        address: Pubkey,
        is_accepted: bool,
        is_confirmed: bool,
        is_completed: bool,
        quantity: u32,
        product_charge: u64,
        delivery_charge: u64,
        ordered_at: i64,
        expected_at: i64,
        bump: u8,
    ) -> Self {
        Self {
            product,
            buyer,
            seller,
            address,
            is_accepted,
            is_confirmed,
            is_completed,
            canceled: CancelOrder::NotCanceled,
            quantity,
            product_charge,
            delivery_charge,
            cancel_reason: String::new(),
            ordered_at,
            expected_at,
            bump,
        }
    }
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
#[repr(u8)]
pub enum CancelOrder {
    NotCanceled,
    Buyer,
    Seller,
}

impl TryFrom<u8> for CancelOrder {
    type Error = &'static str;

    fn try_from(value: u8) -> std::result::Result<Self, Self::Error> {
        if  value > 2 {
            Err("Invalid value for CancelOrder. It should be 0, 1 or 2.")
        } else if value == 0 {
            Ok(CancelOrder::NotCanceled)
        } else if value == 1 {
            Ok(CancelOrder::Buyer)
        } else {
            Ok(CancelOrder::Seller)
        }
    }
}