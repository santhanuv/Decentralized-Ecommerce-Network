use anchor_lang::prelude::*;
declare_id!("AaaszxfE1zx7XrWzYkMy8eQoZZbujmyExX6Eup3vj2Gb");

pub mod errors;
pub mod instructions;
pub mod state;

use market::state::market::Market;
use state::product::Product;
use state::review::Review;

#[program]
pub mod product {
    use super::*;

    pub fn create_product(
        ctx: Context<CreateProduct>,
        price: u64,
        rating: f64,
        inventory: u32,
        title: String,
        description: String,
        storage_id: String,
    ) -> Result<()> {
        let seller = ctx.accounts.seller.key;
        let clock = Clock::get().unwrap();

        let market_owner = ctx.accounts.market.owner;
        let market_key = ctx.accounts.market.key();

        let product = match instructions::create_product::create_product(
            market_key,
            market_owner,
            *seller,
            clock.unix_timestamp,
            price,
            rating,
            inventory,
            title,
            description,
            storage_id,
        ) {
            Ok(product) => product,
            Err(e) => return Err(e),
        };

        ctx.accounts.product.set_inner(product);

        Ok(())
    }

    pub fn update_product(
        ctx: Context<UpdateProduct>,
        price: u64,
        inventory: u32,
        title: String,
        description: String,
        storage_id: String,
    ) -> Result<()> {
        let product = &mut ctx.accounts.product;

        instructions::update_product_checkup::update_product_checkup(
            &title,
            &description,
            &storage_id,
        )
        .unwrap();

        product.price = price;
        product.inventory = inventory;
        product.title = title;
        product.description = description;
        product.storage_id = storage_id;

        Ok(())
    }

    pub fn delete_product(ctx: Context<DeleteProduct>) -> Result<()> {
        msg!("Removing product: {}", ctx.accounts.product.key());
        Ok(())
    }

    pub fn create_review(
        ctx: Context<CreateReview>,
        rating: f64,
        title: String,
        content: String,
    ) -> Result<()> {
        let product_key = ctx.accounts.product.key();
        let user = ctx.accounts.signer.key();

        let clock = Clock::get().unwrap();
        let now = clock.unix_timestamp;

        let review = match instructions::create_review::create_review(
            product_key,
            user,
            rating,
            title,
            content,
            now,
            now,
        ) {
            Ok(review) => review,
            Err(err) => return Err(err),
        };

        ctx.accounts.review.set_inner(review);
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(
    price: u64,
    rating: f64,
    inventory: u32,
    title: String,
    description: String,
    storage_id: String,
)]
pub struct CreateProduct<'info> {
    #[account(init, payer = seller, space = Product::SPACE)]
    pub product: Account<'info, Product>,
    #[account(mut)]
    pub seller: Signer<'info>,
    pub market: Account<'info, Market>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(
    price: u64,
    inventory: u32,
    title: String,
    description: String,
    storage_id: String,
)]
pub struct UpdateProduct<'info> {
    #[account(mut, realloc = Product::SPACE, realloc::payer = seller, realloc::zero = true)]
    pub product: Account<'info, Product>,
    #[account(mut)]
    pub seller: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct DeleteProduct<'info> {
    #[account(mut, close = seller)]
    pub product: Account<'info, Product>,
    #[account(mut)]
    pub seller: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(
    rating: f64,
    title: String,
    content: String,
)]
pub struct CreateReview<'info> {
    #[account(
        init,
        seeds = [signer.key().as_ref(), product.seller.key().as_ref()],
        bump,
        payer = signer,
        space = Review::SPACE
    )]
    pub review: Account<'info, Review>,
    pub product: Account<'info, Product>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}
