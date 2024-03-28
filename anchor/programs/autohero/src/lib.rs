use anchor_lang::prelude::*;
mod hero;
mod event_storage;
mod errors;


// This is your program's public key and it will update
// automatically when you build the project.
declare_id!("DCXeBRXR5mYGomEe8tSrnsWLu2SW8G6VxAU5bu3eNx9D");

#[program]
mod autohero {
    use super::*;
    pub fn initialize(ctx: Context<InitializeContext>, random: u64) -> Result<()> {
        let now: i64 = Clock::get().unwrap().unix_timestamp;
        ctx.accounts.new_account.owner = ctx.accounts.signer.key();
        ctx.accounts.new_account.random = random;
        ctx.accounts.new_account.created = now;
        ctx.accounts.new_account.additional_exp = 0;
        ctx.accounts.new_account.base_attack = 1;
        ctx.accounts.new_account.base_defense = 1;
        ctx.accounts.new_account.delta_hitpoints = 0;
        ctx.accounts.new_account.delta_hitpoints_update = now;
        msg!("Owner: {}", ctx.accounts.new_account.owner);
        msg!("Hero: {}", ctx.accounts.new_account.key());
        msg!("Created: {}", random);
        Ok(())
    }

    pub fn info(ctx: Context<InfoContext>) -> Result<()> {
        msg!("Exp: {}", ctx.accounts.hero.exp());
        msg!("Selector: {}", ctx.accounts.hero.selector());
        msg!("Level: {}", ctx.accounts.hero.level());
        msg!("Attack: {}", ctx.accounts.hero.attack());
        msg!("Defense: {}", ctx.accounts.hero.defense());
        msg!("Hitpoints: {}", ctx.accounts.hero.hitpoints());
        msg!("Max hitpoints: {}", ctx.accounts.hero.max_hitpoints());
        Ok(())
    }

    pub fn initialize_storage(ctx: Context<InitializeStorageContext>) -> Result<()> {
        ctx.accounts.events_storage.owner = ctx.accounts.signer.key();
        ctx.accounts.events_storage.number = 0;
        Ok(())
    }

    pub fn add_event(ctx: Context<AddEventContext>, message: u128) -> Result<()> {
        let now: i64 = Clock::get().unwrap().unix_timestamp;
        let mut index: u8 = ctx.accounts.events_storage.number;
        if index >= 10 {
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
        let hash = event.selector() ^ ctx.accounts.hero.selector();
        let count = count_ones(hash);
        if count != event.num() {
            msg!(
                "Debug: event selector {}, hero selector {}, hash {}, event num {}, count {}",
                event.selector(),
                ctx.accounts.hero.selector(),
                hash,
                event.num(),
                count
            );

            return err!(errors::AutoHeroError::EventCannotbeApplied);
        }

        // Check if the event is already applied
        if ctx.accounts.hero.add_event(event.message) == false {
            return err!(errors::AutoHeroError::EventIsApplied);
        }

        msg!("hero: {}", ctx.accounts.hero.key());

        // Apply the event
        match event.category() {
            0 => {
                msg!("attack: {}", event.attack());
                ctx.accounts.hero.base_attack += event.attack() as i32;
            }
            1 => {
                msg!("defense: {}", event.defense());
                ctx.accounts.hero.base_defense += event.defense() as i32;
            }
            _ => {}
        }

        Ok(())
    }
}


fn count_ones(number: u8) -> u8 {
    // Convert the number to its text representation
    let text = format!("{:b}", number);
    // Iterate through each character in the string and count how many '1's there are
    text.chars().filter(|&c| c == '1').count() as u8
}

#[derive(Accounts)]
pub struct InfoContext<'info> {
    pub hero: Account<'info, hero::Hero>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct InitializeContext<'info> {
    #[account(init, payer = signer, space = 8 + hero::HERO_SIZE)]
    pub new_account: Account<'info, hero::Hero>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct InitializeStorageContext<'info> {
    #[account(init, payer = signer, space = 8 + event_storage::EVENT_STORAGE_SIZE)]
    pub events_storage: Account<'info, event_storage::EventStorage>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}


#[derive(Accounts)]
pub struct AddEventContext<'info> {
    #[account(mut)]
    pub events_storage: Account<'info, event_storage::EventStorage>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}


#[derive(Accounts)]
pub struct ApplyEventContext<'info> {
    #[account(mut)]
    pub hero: Account<'info, hero::Hero>,
    pub events_storage: Account<'info, event_storage::EventStorage>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}
