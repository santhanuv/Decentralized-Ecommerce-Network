use anchor_lang::prelude::*;

declare_id!("2e93rMuTq8ukVhEEPEuDwnXiUZiYe9TiVYRqEKdTJCYG");

pub mod state;
pub mod instructions;
pub mod errors;


use state::market::Market;

#[program]
pub mod market {
    use super::*;

    pub fn create_market(
        ctx: Context<CreateMarket>,
        name: String,
        description: String,
        cover_image: String,
    ) -> Result<()> {
        let owner = ctx.accounts.auth_account.key();

        let clock = Clock::get().unwrap();

        let market = match instructions::create_market::create_market(
            owner,
            name, 
            description, 
            clock.unix_timestamp, 
            cover_image,
        ) {
            Ok(market) => market,
            Err(_) => return Err(errors::MarketError::MarketCreationFailed.into())
        };

        ctx.accounts.market_account.set_inner(market);

        Ok(())
    }

    pub fn update_market(
        ctx: Context<UpdateMarket>,
        name: String,
        description: String,
        cover_image: String,
    ) -> Result<()> {

        let market = &mut ctx.accounts.market_account;

        instructions::update_market_checkup::update_market_checkup(
            &name, 
            &description, 
            &cover_image
        ).unwrap();

        market.name = name;
        market.description = description;
        market.cover_image = cover_image;

        Ok(())
    }

    pub fn delete_market(
        ctx: Context<DeleteMarket>,
    ) -> Result<()> {
        // First delete all products in the market
        msg!("Deleting market: {}", ctx.accounts.market_account.key());

        Ok(())
    }

}

#[derive(Accounts)]
#[instruction(
    name: String,
    description: String,
    cover_image: String,
)]
pub struct CreateMarket<'info> {
    #[account(
        init,
        payer = auth_account, 
        space = Market::SPACE
    )]
    pub market_account: Account<'info, Market>,
    #[account(mut)]
    pub auth_account: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(
    name: String,
    description: String,
    cover_image: String,
)]
pub struct UpdateMarket<'info> {
    #[account(
        mut,
        realloc = Market::SPACE, 
        realloc::payer = auth_account,
        realloc::zero = true
    )]
    pub market_account: Account<'info, Market>,
    #[account(mut)]
    pub auth_account: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct DeleteMarket<'info> {
    #[account(
        mut,
        close = auth_account
    )]
    pub market_account: Account<'info, Market>,
    #[account(mut)]
    pub auth_account: Signer<'info>,
    pub system_program: Program<'info, System>,
}

