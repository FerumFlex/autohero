use anchor_lang::prelude::*;
use std::mem;
use std::fmt;


#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
#[repr(u8)]
pub enum Race {
    Human = 1,
    Elf = 2,
    Dwarf = 3,
    Orc = 4,
    Dragon = 5,
}


impl fmt::Display for Race {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        let race_str = match self {
            Race::Human => "Human",
            Race::Elf => "Elf",
            Race::Orc => "Orc",
            Race::Dwarf => "Dwarf",
            Race::Dragon => "Dragon",
        };
        write!(f, "{}", race_str)
    }
}

#[error_code]
pub enum ErrorCode {
    #[msg("Invalid race value")]
    InvalidRace,

    #[msg("Hero name is too long (max 32 characters)")]
    NameTooLong,
}


impl Race {
    pub fn from_u8(value: u8) -> Result<Self> {
        match value {
            1 => Ok(Race::Human),
            2 => Ok(Race::Elf),
            3 => Ok(Race::Orc),
            4 => Ok(Race::Dwarf),
            5 => Ok(Race::Dragon),
            _ => Err(error!(ErrorCode::InvalidRace)),
        }
    }
}

#[account]
pub struct Hero {
    pub owner: Pubkey,

    pub random: u64,
    pub race: Race,

    pub name: String,

    pub created: i64,
    pub additional_exp: u32,

    pub base_attack: i32,
    pub base_defense: i32,

    pub delta_hitpoints: i32,
    pub delta_hitpoints_update: i64,

    pub applied_events: [u128; 10],
    pub applied_events_index: u8,
}

pub const HERO_MAX_NAME_LENGTH: usize = 32;
pub const HERO_SIZE: usize = mem::size_of::<Hero>() + 4 + HERO_MAX_NAME_LENGTH;
pub const SECONDS_IN_DAY: f64 = 60.0 * 60.0 * 24.0;


impl Hero {
    pub fn exp(&self) -> i64 {
        return Clock::get().unwrap().unix_timestamp - self.created + self.additional_exp as i64;
    }

    pub fn level(&self) -> f64 {
        let days: f64 = (self.exp() as f64) / SECONDS_IN_DAY;
        return 100.0 * (days + 1.0).log10() + 1.0;
    }

    pub fn level_int(&self) -> i32 {
        return self.level() as i32;
    }

    pub fn attack(&self) -> i32 {
        return self.base_attack + self.level_int();
    }

    pub fn defense(&self) -> i32 {
        return self.base_defense + self.level_int();
    }

    pub fn max_hitpoints(&self) -> i32 {
        return self.level_int() * 10;
    }

    pub fn hitpoints(&self) -> i32 {
        let now: i64 = Clock::get().unwrap().unix_timestamp;
        let max_hits: i32 = self.max_hitpoints();
        let heal: i32 = ((now - self.delta_hitpoints_update) / 10) as i32;
        let current_hits: i32 = max_hits + self.delta_hitpoints + heal;
        let result: i32 = if current_hits > max_hits {
            max_hits
        } else if current_hits < 0 {
            0
        } else {
            current_hits
        };
        return result;
    }

    pub fn selector(&self) -> u8 {
        return self.random as u8;
    }

    pub fn add_event(&mut self, event: u128) -> bool {
        for applied_event in self.applied_events.iter() {
            if *applied_event == event {
                return false;
            }
        }

        self.applied_events[self.applied_events_index as usize] = event;
        if self.applied_events_index < 9 {
            self.applied_events_index += 1;
        } else {
            self.applied_events_index = 0;
        }
        true
    }
}