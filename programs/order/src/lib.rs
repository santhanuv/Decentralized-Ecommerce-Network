use anchor_lang::prelude::*;
use anchor_lang::system_program;

pub mod errors;
pub mod state;
pub mod instructions;
declare_id!("3openw81tb57qZhKSFEWy5K19FrzpeRMhXky4YMjawZ5");

use product::state::product::Product;
use user::state::address::UserAddress;
use state::order::Order;
use errors::OrderError;

#[program]
pub mod order {

    use super::*;

    pub fn place_order(
        ctx: Context<PlaceOrder>, 
        quantity: u32,
    ) -> Result<()> {
        let product_key = ctx.accounts.product.key();
        let product_charge = ctx.accounts.product.price;
        let seller_key = ctx.accounts.product.seller;
        let buyer = ctx.accounts.buyer.key();
        let address = ctx.accounts.address.key();
        let clock = Clock::get().unwrap();

        if ctx.accounts.product.inventory < quantity {
            return Err(OrderError::QuantityNotAvailable.into());
        }

        let total_product_charge = product_charge * quantity as u64;

        // instructions::place_order_checkup::place_order_checkup(
        //     ctx.accounts.product.inventory, 
        //     quantity,
        //     &country,
        //     &state, 
        //     &code,
        //     &locale
        // ).unwrap();

        let order = Order::new(
            product_key,
            buyer,
            seller_key,
            address,
            false, // accepted
            false, // completed
            quantity,
            total_product_charge,
            0, // delivery price is initially zero
            clock.unix_timestamp,
            0 // expected_at initially set to 0
        );
        ctx.accounts.order.set_inner(order);

        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: ctx.accounts.buyer.to_account_info(),
                to: ctx.accounts.order.to_account_info(),
            },
        );


        system_program::transfer(cpi_context, total_product_charge).unwrap();

        Ok(())
    }

    pub fn accept_order(
        ctx: Context<AcceptOrder>, 
        delivery_charge: u64,
        expected_at: i64,
    ) -> Result<u64> {
        let order = &mut ctx.accounts.order;
        let product = &mut ctx.accounts.product;
        
        let total_charge = order.product_charge + order.delivery_charge;

        if order.is_accepted {
            return Err(errors::OrderError::OrderReAcceptError.into());
        }

        order.is_accepted = true;
        order.delivery_charge = delivery_charge;
        order.expected_at = expected_at;
        product.inventory = product.inventory - order.quantity;

        msg!("product charge: {}", order.product_charge);
        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: ctx.accounts.seller.to_account_info(),
                to: ctx.accounts.order.to_account_info(),
            },
        );

        let amount = (0.50 * total_charge as f64) as u64;

        system_program::transfer(cpi_context, amount).unwrap();

        Ok(amount)
    }
}

#[derive(Accounts)]
#[instruction(
    quantity: u32, 
)]
pub struct PlaceOrder<'info> {
    #[account(
        init,
        seeds = [b"order", product.key().as_ref(), buyer.key().as_ref()],
        bump,
        payer = buyer,
        space = Order::SPACE
    )]
    pub order: Account<'info, Order>,
    pub product: Account<'info, Product>,
    pub address: Account<'info, UserAddress>,
    #[account(mut)]
    pub buyer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(
    delivery_charge: u64
)]
pub struct AcceptOrder<'info> {
    #[account(
        mut,
        realloc = Order::SPACE,
        realloc::payer = seller,
        realloc::zero = true,
    )]
    pub order: Account<'info, Order>,
    #[account(mut)]
    pub seller: Signer<'info>,
    pub product: Account<'info, Product>,
    pub system_program: Program<'info, System>,
}
