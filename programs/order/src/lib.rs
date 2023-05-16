use anchor_lang::prelude::*;
use anchor_lang::system_program;

pub mod errors;
pub mod state;
pub mod instructions;
declare_id!("CTXByEYtqT8PUr9VUD4hpK7cNBsoMSBX7CjMpxpGvfhs");

use product::state::product::Product;
use user::state::address::UserAddress;
use state::order::Order;
use state::order::CancelOrder;
use errors::OrderError;

#[program]
pub mod order {

    use anchor_lang::solana_program::native_token::LAMPORTS_PER_SOL;

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
        let bump = ctx.bumps.get("order").unwrap();

        if ctx.accounts.product.inventory < quantity {
            return Err(OrderError::QuantityNotAvailable.into());
        }

        let total_product_charge = product_charge * quantity as u64;

        let order = Order::new(
            product_key,
            buyer,
            seller_key,
            address,
            false, // accepted
            false, // confirmed
            false, // completed
            quantity,
            total_product_charge,
            0, // delivery price is initially zero
            clock.unix_timestamp,
            0, // expected_at initially set to 0,
            *bump,
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
        
        let total_charge = order.product_charge + delivery_charge;

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

    pub fn confirm_order(
        ctx: Context<ConfirmOrder>
    ) -> Result<()> {
        require_keys_eq!(
            ctx.accounts.order.buyer.key(),
            ctx.accounts.buyer.key(),
            errors::OrderError::Unauthorized
        );

        if ctx.accounts.order.is_confirmed {
            return Err(errors::OrderError::ReConfirmError.into());
        }

        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: ctx.accounts.buyer.to_account_info(),
                to: ctx.accounts.order.to_account_info(),
            },
        );

        let delivery_charge = ctx.accounts.order.delivery_charge;
        system_program::transfer(cpi_context, delivery_charge).unwrap();

        ctx.accounts.order.is_confirmed = true;

        Ok(())
    }

    pub fn cancel_request(
        ctx: Context<CancelRequest>,
        cancel_reason: String,
    ) -> Result<()> {
        let order = &mut ctx.accounts.order;
        let signer = & ctx.accounts.signer;
        let buyer = &ctx.accounts.buyer;

        if order.is_completed {
            return Err(errors::OrderError::CompletedOrderCancelError.into());
        }

        require_keys_eq!(
            order.buyer.key(), 
            buyer.key(),
            errors::OrderError::Unauthorized
        );        

        if order.canceled != CancelOrder::NotCanceled {
            return Err(errors::OrderError::ReCancelRequestError.into());
        }

        if order.buyer.key() == signer.key() {
            order.canceled = CancelOrder::Buyer;
        } else if order.seller.key() == signer.key() {
            order.canceled = CancelOrder::Seller;
        } else {
            return Err(errors::OrderError::SignerNotAuth.into());
        }

        order.cancel_reason = cancel_reason;


        Ok(())
    }

    pub fn accept_cancel(
        ctx: Context<AcceptCancel>,
    ) -> Result<()> {
        let order = &ctx.accounts.order;
        let signer = &ctx.accounts.signer;
        let buyer =  &ctx.accounts.buyer;
        let seller = &ctx.accounts.seller;

        if order.is_completed {
            return Err(errors::OrderError::CompletedOrderCancelError.into());
        }

        require_keys_eq!(
            order.buyer.key(), 
            buyer.key(),
            errors::OrderError::Unauthorized
        );
        require_keys_eq!(
            order.seller.key(),
            seller.key(),
            errors::OrderError::Unauthorized
        );

        if signer.key() != buyer.key() && signer.key() != seller.key() {
            return Err(errors::OrderError::Unauthorized.into());
        }

        msg!("Canceling order {}", order.key());
        let mut buyer_refund = order.product_charge;
        let seller_refund = 
            (0.5 * (order.product_charge + order.delivery_charge) as f64) as u64;

        if order.canceled == CancelOrder::Buyer {
            require_keys_eq!(
                signer.key(), 
                seller.key(), 
                errors::OrderError:: InvalidSellerSigner
            );
        } else if order.canceled == CancelOrder::Seller {
            require_keys_eq!(
                signer.key(),
                buyer.key(),
                errors::OrderError::InvalidBuyerSigner
            );
            if order.is_confirmed {
                buyer_refund = buyer_refund + order.delivery_charge;
            }
        } else {
            return Err(errors::OrderError::OrderNotCanceled.into());
        }

        msg!("Refunding sols");

        **order.to_account_info().try_borrow_mut_lamports()? -= buyer_refund;
        **buyer.to_account_info().try_borrow_mut_lamports()? += buyer_refund;

        if order.is_accepted {
            **order.to_account_info().try_borrow_mut_lamports()? -= seller_refund;
            **seller.to_account_info().try_borrow_mut_lamports()? += seller_refund;
        }

        Ok(())
    }

    pub fn complete_order(
        ctx: Context<CompleteOrder>,
    ) -> Result<()> {
        let order = &mut ctx.accounts.order;
        let signer = &ctx.accounts.signer;
        let seller = &mut ctx.accounts.seller;

        require_keys_eq!(
            order.buyer.key(), 
            signer.key(),
            errors::OrderError::Unauthorized
        );
        
        require_keys_eq!(
            order.seller.key(),
            seller.key(),
            errors::OrderError::Unauthorized
        );     

        if !order.is_confirmed {
            return Err(errors::OrderError::OrderNotConfirmedError.into());
        }

        msg!("Completing order {}", order.key());
        order.is_completed = true;

        let buyer_amount = order.product_charge + order.delivery_charge;
        let seller_amount = 
            (0.5 * (buyer_amount) as f64) as u64;
        let total_amount = buyer_amount + seller_amount;

        let balance = order.to_account_info().lamports();
        msg!("total amount = {} --- balance = {}", total_amount / LAMPORTS_PER_SOL, balance / LAMPORTS_PER_SOL);

        **order.to_account_info().try_borrow_mut_lamports()? -= total_amount;
        **seller.to_account_info().try_borrow_mut_lamports()? += total_amount;

        Ok(())
    }

    pub fn close_order(
        ctx: Context<CloseOrder>
    ) -> Result<()> {
        // This function cancels order that is not accepted by seller.
        let order = &mut ctx.accounts.order;
        let signer = &ctx.accounts.signer;

        require_keys_eq!(
            order.buyer.key(),
            signer.key(),
            errors::OrderError::Unauthorized,
        );

        if order.is_completed {
            let balance = order.to_account_info().lamports() / LAMPORTS_PER_SOL;

            if balance != 0 {
                return Err(errors::OrderError::CompletedOrderCancelError.into());
            }
        } else if !order.is_accepted {
            **order.to_account_info().try_borrow_mut_lamports()? 
                -= order.product_charge;
            **signer.to_account_info().try_borrow_mut_lamports()?
                += order.product_charge;
        } else {
            return Err(
                errors::OrderError::CloseAcceptedOrderError.into()
            );
        }

        Ok(())
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

#[derive(Accounts)]
pub struct ConfirmOrder<'info> {
    #[account(
        mut,
        realloc = Order::SPACE,
        realloc::payer = buyer,
        realloc::zero = true,
    )]
    pub order: Account<'info, Order>,
    #[account(mut)]
    pub buyer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(
    cancel_reason: String,
)]
pub struct CancelRequest<'info> {
    #[account(
        mut,
        realloc = Order::SPACE,
        realloc::payer = signer,
        realloc::zero = true,
    )]
    pub order: Account<'info, Order>,
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(mut)]
    /// CHECK: Just to transfer lamports
    pub buyer: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AcceptCancel<'info> {
    #[account(
        mut,
        close = signer
    )]
    pub order: Account<'info, Order>,
    pub signer: Signer<'info>,
    #[account(mut)]
    /// CHECK: Just to transfer lamports
    pub buyer: UncheckedAccount<'info>,
    #[account(mut)]
    /// CHECK: Just to transfer lamports
    pub seller: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CompleteOrder<'info> {
    #[account(
        mut,
        realloc = Order::SPACE,
        realloc::payer = signer,
        realloc::zero = true,
    )]
    pub order: Account<'info, Order>,
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(mut)]
    /// CHECK: Just to transfer lamports
    pub seller: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CloseOrder<'info> {
    #[account(mut, close = signer)]
    pub order: Account<'info, Order>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}