#![allow(unexpected_cfgs)]
#![allow(clippy::result_large_err)]

use hero::Hero;

use {
    anchor_lang::prelude::*,
    anchor_spl::{
        associated_token::AssociatedToken,
        metadata::{
            create_master_edition_v3, create_metadata_accounts_v3,
            mpl_token_metadata::types::DataV2, CreateMasterEditionV3, CreateMetadataAccountsV3,
            Metadata,
        },
        token::{mint_to, Mint, MintTo, Token, TokenAccount},
    },
};

mod hero;
mod event_storage;
mod errors;
mod utils;
mod constants;
use crate::hero::Race;
use crate::hero::ErrorCode;
use std::str::FromStr;


// This is your program's public key and it will update
// automatically when you build the project.
declare_id!("BFaEX2hJaeRmBrS5rBUBgjEKdDmsnfEVxJSKpLSHzdRN");

#[program]
mod autohero {
    use super::*;

    pub fn info(ctx: Context<InfoContext>) -> Result<()> {
        msg!("Exp: {}", ctx.accounts.hero.exp());
        msg!("Selector: {}", ctx.accounts.hero.selector());
        msg!("Name: {}", ctx.accounts.hero.name);
        msg!("Race: {}", ctx.accounts.hero.race);
        msg!("Level: {}", ctx.accounts.hero.level());
        msg!("Attack: {}", ctx.accounts.hero.attack());
        msg!("Defense: {}", ctx.accounts.hero.defense());
        msg!("Hitpoints: {}", ctx.accounts.hero.hitpoints());
        msg!("Max hitpoints: {}", ctx.accounts.hero.max_hitpoints());
        Ok(())
    }

    pub fn initialize(ctx: Context<InitializeContext>) -> Result<()> {
        let expected_wallet = Pubkey::from_str(constants::ROYALTY_WALLET).map_err(|_| ProgramError::InvalidArgument)?;

        // 🔒 Enforce royalty wallet address
        require!(
            ctx.accounts.royalty_wallet.key() == expected_wallet,
            errors::AutoHeroError::InvalidRoyaltyWallet
        );

        // 🔒 Enforce payer has enough lamports
        require!(
            **ctx.accounts.user.lamports.borrow() >= constants::ROYALTY_LAMPORTS,
            errors::AutoHeroError::InsufficientRoyaltyPayment
        );

        // ✅ Transfer SOL from payer to royalty wallet
        let ix = anchor_lang::solana_program::system_instruction::transfer(
            ctx.accounts.user.key,
            ctx.accounts.royalty_wallet.key,
            constants::ROYALTY_LAMPORTS,
        );
        anchor_lang::solana_program::program::invoke(
            &ix,
            &[
                ctx.accounts.user.to_account_info(),
                ctx.accounts.royalty_wallet.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
        )?;

        let seeds = &["mint".as_bytes(), &[ctx.bumps.mint]];
        let signer = [&seeds[..]];

        let token_data: DataV2 = DataV2 {
            name: constants::TOKEN_NAME.to_string(),
            symbol: constants::TOKEN_SYMBOL.to_string(),
            uri: constants::TOKEN_URI.to_string() + &ctx.accounts.mint.key().to_string() + ".json",
            seller_fee_basis_points: 0,
            creators: None,
            collection: None,
            uses: None,
        };

        let metadata_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_metadata_program.to_account_info(),
            CreateMetadataAccountsV3 {
                payer: ctx.accounts.user.to_account_info(),
                update_authority: ctx.accounts.mint.to_account_info(),
                mint: ctx.accounts.mint.to_account_info(),
                metadata: ctx.accounts.metadata.to_account_info(),
                mint_authority: ctx.accounts.mint.to_account_info(),
                system_program: ctx.accounts.system_program.to_account_info(),
                rent: ctx.accounts.rent.to_account_info(),
            },
            &signer
        );

        create_metadata_accounts_v3(
            metadata_ctx,
            token_data,
            false,
            true,
            None,
        )?;

        msg!("Token mint created successfully.");

        Ok(())
    }

    pub fn add_event(ctx: Context<AddEventContext>, message: u128) -> Result<()> {
        let now: i64 = Clock::get().unwrap().unix_timestamp;
        let mut index: u8 = ctx.accounts.events_storage.number;
        if index >= constants::MAX_EVENTS {
            index = 0;
        }
        ctx.accounts.events_storage.events[index as usize] = event_storage::Event {
            timestamp: now,
            message: message,
        };
        ctx.accounts.events_storage.number = index + 1;
        ctx.accounts.events_storage.total += 1;
        Ok(())
    }

    pub fn apply_event(ctx: Context<ApplyEventContext>, message: u128) -> Result<()> {
        let event = ctx.accounts.events_storage.get_message(message).unwrap();

        // Check if the event can be applied
        let hash = event.selector() ^ ctx.accounts.nft_data.selector();
        let count = utils::count_ones(hash);
        if count != event.num() {
            msg!(
                "Debug: event selector {}, hero selector {}, hash {}, event num {}, count {}",
                event.selector(),
                ctx.accounts.nft_data.selector(),
                hash,
                event.num(),
                count
            );

            return err!(errors::AutoHeroError::EventCannotbeApplied);
        }

        // Check if the event is already applied
        if ctx.accounts.nft_data.add_event(event.message) == false {
            return err!(errors::AutoHeroError::EventIsApplied);
        }

        msg!("hero: {}", ctx.accounts.nft_data.key());

        // Apply the event
        match event.category() {
            0 => {
                msg!("increase attack: {}", event.attack());
                ctx.accounts.nft_data.base_attack += event.attack() as i32;
            }
            1 => {
                msg!("increase defense: {}", event.defense());
                ctx.accounts.nft_data.base_defense += event.defense() as i32;
            }
            2 => {
                msg!("increase exp: {}", event.exp());
                ctx.accounts.nft_data.additional_exp += event.exp() as u32;
            },
            3 => {
                msg!("get damage: {}", event.damage());
                ctx.accounts.nft_data.delta_hitpoints = event.damage() as i32;
                ctx.accounts.nft_data.delta_hitpoints_update = Clock::get().unwrap().unix_timestamp;
            }
            _ => {
                msg!("get money: {}", event.money());
                let seeds: &[&[u8]; 2] = &["mint".as_bytes(), &[ctx.bumps.mint]];
                let signer = [&seeds[..]];

                mint_to(
                    CpiContext::new_with_signer(
                        ctx.accounts.token_program.to_account_info(),
                        MintTo {
                            authority: ctx.accounts.mint.to_account_info(),
                            to: ctx.accounts.destination.to_account_info(),
                            mint: ctx.accounts.mint.to_account_info(),
                        },
                        &signer,
                    ),
                    event.money(),
                )?;
            }
            // _ => {
            //     msg!("increase exp: {}", event.exp());
            //     ctx.accounts.nft_data.additional_exp += event.exp() as u32;
            // }
        }

        Ok(())
    }

    pub fn mint_nft(
        ctx: Context<CreateToken>,
        nft_name: String,
        random: u64,
        race_u8: u8,
    ) -> Result<()> {
        if nft_name.len() > 32 {
            return Err(error!(ErrorCode::NameTooLong));
        }

        msg!("Minting Token");
        // Cross Program Invocation (CPI)
        // Invoking the mint_to instruction on the token program
        mint_to(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                MintTo {
                    mint: ctx.accounts.mint_account.to_account_info(),
                    to: ctx.accounts.associated_token_account.to_account_info(),
                    authority: ctx.accounts.payer.to_account_info(),
                },
            ),
            1,
        )?;

        msg!("Creating metadata account");
        // Cross Program Invocation (CPI)
        // Invoking the create_metadata_account_v3 instruction on the token metadata program
        create_metadata_accounts_v3(
            CpiContext::new(
                ctx.accounts.token_metadata_program.to_account_info(),
                CreateMetadataAccountsV3 {
                    metadata: ctx.accounts.metadata_account.to_account_info(),
                    mint: ctx.accounts.mint_account.to_account_info(),
                    mint_authority: ctx.accounts.payer.to_account_info(),
                    update_authority: ctx.accounts.payer.to_account_info(),
                    payer: ctx.accounts.payer.to_account_info(),
                    system_program: ctx.accounts.system_program.to_account_info(),
                    rent: ctx.accounts.rent.to_account_info(),
                },
            ),
            DataV2 {
                name: nft_name.clone(),
                symbol: "AUTOHERO".into(),
                uri: format!("https://metadata.autoherorpg.com/{}", ctx.accounts.mint_account.key()),
                seller_fee_basis_points: 0,
                creators: None,
                collection: None,
                uses: None,
            },
            false, // Is mutable
            true,  // Update authority is signer
            None,  // Collection details
        )?;

        msg!("Creating master edition account");
        // Cross Program Invocation (CPI)
        // Invoking the create_master_edition_v3 instruction on the token metadata program
        create_master_edition_v3(
            CpiContext::new(
                ctx.accounts.token_metadata_program.to_account_info(),
                CreateMasterEditionV3 {
                    edition: ctx.accounts.edition_account.to_account_info(),
                    mint: ctx.accounts.mint_account.to_account_info(),
                    update_authority: ctx.accounts.payer.to_account_info(),
                    mint_authority: ctx.accounts.payer.to_account_info(),
                    payer: ctx.accounts.payer.to_account_info(),
                    metadata: ctx.accounts.metadata_account.to_account_info(),
                    token_program: ctx.accounts.token_program.to_account_info(),
                    system_program: ctx.accounts.system_program.to_account_info(),
                    rent: ctx.accounts.rent.to_account_info(),
                },
            ),
            None, // Max Supply
        )?;

        msg!("NFT minted successfully.");

        let now: i64 = Clock::get().unwrap().unix_timestamp;
        ctx.accounts.nft_data.owner = ctx.accounts.payer.key();
        ctx.accounts.nft_data.random = random;
        ctx.accounts.nft_data.race = Race::from_u8(race_u8)?;
        ctx.accounts.nft_data.name = nft_name;
        ctx.accounts.nft_data.created = now;
        ctx.accounts.nft_data.additional_exp = 0;
        ctx.accounts.nft_data.base_attack = 1;
        ctx.accounts.nft_data.base_defense = 1;
        ctx.accounts.nft_data.delta_hitpoints = 0;
        ctx.accounts.nft_data.delta_hitpoints_update = now;

        Ok(())
    }
}


#[derive(Accounts)]
pub struct InfoContext<'info> {
    pub hero: Account<'info, hero::Hero>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct InitializeContext<'info> {
    #[account(
        init_if_needed,
        payer = user,
        space = 8 + event_storage::EVENT_STORAGE_SIZE,
        seeds = [b"events_storage"],
        bump
    )]
    pub events_storage: Account<'info, event_storage::EventStorage>,

    /// CHECK: New Metaplex Account being created
    #[account(mut)]
    pub metadata: UncheckedAccount<'info>,

    #[account(
        init_if_needed,
        seeds = [b"mint"],
        bump,
        payer = user,
        mint::decimals = constants::TOKEN_DECIMALS,
        mint::authority = mint,
    )]
    pub mint: Account<'info, Mint>,

    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
    pub token_metadata_program: Program<'info, Metadata>,

    /// CHECK: Verified against hardcoded key
    #[account(mut)]
    pub royalty_wallet: AccountInfo<'info>,
}


#[derive(Accounts)]
pub struct AddEventContext<'info> {
    #[account(
        mut,
        seeds = [b"events_storage"],
        bump
    )]
    pub events_storage: Account<'info, event_storage::EventStorage>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}


#[derive(Accounts)]
pub struct ApplyEventContext<'info> {
    #[account(
        seeds = [b"events_storage"],
        bump
    )]
    pub events_storage: Account<'info, event_storage::EventStorage>,

    #[account()]
    pub mint_account: Account<'info, Mint>,

    #[account(
        mut,
        seeds = [b"nft_data", mint_account.key().as_ref()],
        bump
    )]
    pub nft_data: Account<'info, Hero>,

    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,

    #[account(
        mut,
        seeds = [b"mint"],
        bump,
        mint::authority = mint,
    )]
    pub mint: Account<'info, Mint>,

    #[account(
        init_if_needed,
        payer = payer,
        associated_token::mint = mint,
        associated_token::authority = payer,
    )]
    pub destination: Account<'info, TokenAccount>,

    pub rent: Sysvar<'info, Rent>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}


#[derive(Accounts)]
pub struct CreateToken<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    /// CHECK: Validate address by deriving pda
    #[account(
        mut,
        seeds = [b"metadata", token_metadata_program.key().as_ref(), mint_account.key().as_ref()],
        bump,
        seeds::program = token_metadata_program.key(),
    )]
    pub metadata_account: UncheckedAccount<'info>,

    /// CHECK: Validate address by deriving pda
    #[account(
        mut,
        seeds = [b"metadata", token_metadata_program.key().as_ref(), mint_account.key().as_ref(), b"edition"],
        bump,
        seeds::program = token_metadata_program.key(),
    )]
    pub edition_account: UncheckedAccount<'info>,

    // Create new mint account, NFTs have 0 decimals
    #[account(
        init,
        payer = payer,
        mint::decimals = 0,
        mint::authority = payer.key(),
        mint::freeze_authority = payer.key(),
    )]
    pub mint_account: Account<'info, Mint>,

    /// Your custom NFT data PDA
    #[account(
        init,
        payer = payer,
        space = 8 + hero::HERO_SIZE,
        seeds = [b"nft_data", mint_account.key().as_ref()],
        bump
    )]
    pub nft_data: Account<'info, Hero>,

    // Create associated token account, if needed
    // This is the account that will hold the NFT
    #[account(
        init_if_needed,
        payer = payer,
        associated_token::mint = mint_account,
        associated_token::authority = payer,
    )]
    pub associated_token_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
    pub token_metadata_program: Program<'info, Metadata>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}
