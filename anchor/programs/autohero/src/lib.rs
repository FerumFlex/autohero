use anchor_lang::prelude::*;
use std::mem;

// This is your program's public key and it will update
// automatically when you build the project.
declare_id!("9V5ggVeRYDwckX9xdhvH9mx7E5sZRcZ5dYiof7mDqkTf");

#[program]
mod hello_anchor {
    use super::*;
    pub fn initialize(ctx: Context<Initialize>, data: u64) -> Result<()> {
        let now: i64 = Clock::get().unwrap().unix_timestamp;
        ctx.accounts.new_account.owner = ctx.accounts.signer.key();
        ctx.accounts.new_account.created = now;
        ctx.accounts.new_account.additional_exp = 0;
        ctx.accounts.new_account.base_attack = 1;
        ctx.accounts.new_account.base_defence = 1;
        ctx.accounts.new_account.delta_hitpoints = 0;
        ctx.accounts.new_account.delta_hitpoints_update = now;

        msg!("Changed data to: {}!", data); // Message will show up in the tx logs
        Ok(())
    }

    pub fn info(ctx: Context<Exp>) -> Result<()> {
        msg!("Exp: {}", ctx.accounts.hero.exp());
        msg!("Level: {}", ctx.accounts.hero.level());
        msg!("Attack: {}", ctx.accounts.hero.attack());
        msg!("Defense: {}", ctx.accounts.hero.defense());
        msg!("Hitpoints: {}", ctx.accounts.hero.hitpoints());
        msg!("Max hitpoints: {}", ctx.accounts.hero.max_hitpoints());
        Ok(())
    }
}

#[account]
pub struct Hero {
    pub owner: Pubkey,

    pub created: i64,
    pub additional_exp: u32,

    pub base_attack: i32,
    pub base_defence: i32,

    pub delta_hitpoints: i32,
    pub delta_hitpoints_update: i64,
}

pub const HERO_SIZE: usize = mem::size_of::<Hero>();
pub const SECONDS_IN_DAY: f64 = 60.0 * 60.0 * 24.0;

impl Hero {
    pub fn exp(&self) -> i64 {
        return Clock::get().unwrap().unix_timestamp - self.created + self.additional_exp as i64;
    }

    pub fn level(&self) -> f64 {
        let days: f64 = (self.exp() as f64) / SECONDS_IN_DAY;
        return 10.0 * (days + 1.0).log10() + 1.0;
    }

    pub fn level_int(&self) -> i32 {
        return self.level() as i32;
    }

    pub fn attack(&self) -> i32 {
        return self.base_attack + self.level_int();
    }

    pub fn defense(&self) -> i32 {
        return self.base_defence + self.level_int();
    }

    pub fn max_hitpoints(&self) -> i32 {
        return self.level_int() * 10;
    }

    pub fn hitpoints(&self) -> i32 {
        let now: i64 = Clock::get().unwrap().unix_timestamp;
        let max_hits: i32 = self.max_hitpoints();
        let heal: i32 = ((now - self.delta_hitpoints_update) / 10) as i32;
        let current_hits: i32 = max_hits - self.delta_hitpoints + heal;
        let result: i32 = if current_hits > max_hits {
            max_hits
        } else {
            current_hits
        };
        return result;
    }
}

#[derive(Accounts)]
pub struct Exp<'info> {
    pub hero: Account<'info, Hero>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = signer, space = 8 + HERO_SIZE)]
    pub new_account: Account<'info, Hero>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}
