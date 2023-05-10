use anchor_lang::prelude::*;

declare_id!("H4Nyrs6t3GqEdM8Kfo25jHK3nYa345f5nmw5Mf5Ant6p");

pub mod errors;
pub mod instructions;
pub mod state;

use state::user::UserProfile;
use state::address::UserAddress;

#[program]
pub mod user {
    use super::*;

    pub fn create_user(
        ctx: Context<CreateUser>,
        firstname: String,
        lastname: String,
        profile_image: String,
        email: String,
        contact_number: String,
    ) -> Result<()> {
        let bump = match ctx.bumps.get("user_account") {
            Some(bump) => bump,
            None => return Err(errors::UserDataError::BumpError.into())
        };

        let clock = Clock::get().unwrap();

        let user = match instructions::create_user::create_user(
            firstname,
            lastname,
            profile_image,
            email,
            contact_number,
            clock.unix_timestamp,
            *bump,
        ) {
            Ok(user) => user,
            Err(_) => return Err(errors::UserDataError::UserCreationFailed.into()),
        };

        ctx.accounts.user_account.set_inner(user);

        Ok(())
    }

    pub fn update_user(
        ctx: Context<UpdateUser>,
        firstname: String, 
        lastname: String, 
        profile_image: String, 
        email: String,
        contact_number: String
    ) -> Result<()> {
        let user_profile = &mut ctx.accounts.user_account;

        instructions::update_user::update_user(
            user_profile,
            firstname, 
            lastname, 
            profile_image, 
            email,
            contact_number 
        )
    }

    pub fn create_address(
        ctx: Context<CreateAddress>,
        country: String, 
        state: String, 
        code: String, 
        locale: String,
    ) -> Result<()> {
        let user = ctx.accounts.auth_account.key();

        instructions::create_address::create_address_checkup(
            &country, &state, &code, &locale
        ).unwrap();

        let address = UserAddress::new(
            user,
            country,
            state,
            code,
            locale,
        );

        ctx.accounts.address_account.set_inner(address);

        Ok(())
    }

}


#[derive(Accounts)]
#[instruction(
    firstname: String,
    lastname: String,
    profile_image: String,
    email: String,
    contact_number: String,
)]
pub struct CreateUser<'info> {
    #[account(
        init,
        seeds = [b"user-profile", auth_account.key().as_ref()], 
        bump,
        payer = auth_account, 
        space = UserProfile::SPACE
    )]
    pub user_account: Account<'info, UserProfile>,
    #[account(mut) ]
    pub auth_account: Signer<'info>,
    pub system_program: Program<'info, System>,
}


#[derive(Accounts)]
#[instruction(
    firstname: String,
    lastname: String,
    profile_image: String,
    email: String,
    contact_number: String,
)]
pub struct UpdateUser<'info> {
    #[account(
        mut,
        seeds = [b"user-profile", auth_account.key().as_ref()], 
        bump,
        realloc = UserProfile::SPACE,
        realloc::payer = auth_account,
        realloc::zero = true, 
    )]
    pub user_account: Account<'info, UserProfile>, 
    #[account(mut) ]
    pub auth_account: Signer<'info>,
    pub system_program: Program<'info, System>,
}


#[derive(Accounts)]
#[instruction(
   country: String,
   state: String,
   code: String,
   locale: String,
)]
pub struct CreateAddress<'info> {
    #[account(
        init,
        payer = auth_account, 
        space = UserAddress::SPACE
    )]
    pub address_account: Account<'info, UserAddress>,
    #[account(mut)]
    pub auth_account: Signer<'info>,
    pub system_program: Program<'info, System>,
}