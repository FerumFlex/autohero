use anchor_lang::prelude::*;
use std::mem;

use crate::constants;


#[derive(Clone, Debug, PartialEq, AnchorSerialize, AnchorDeserialize)]
pub struct Event {
    pub timestamp: i64,
    pub message: u128,
}

#[account]
pub struct EventStorage {
    pub events: [Event; 10],
    pub number: u8,
    pub total: u128,
}


pub const EVENT_STORAGE_SIZE: usize = mem::size_of::<EventStorage>();


impl Event {
    pub fn selector(&self) -> u8 {
        return self.message.to_le_bytes()[0];
    }

    pub fn num(&self) -> u8 {
        return self.message.to_le_bytes()[1] % 8;
    }

    pub fn category(&self) -> u8 {
        return self.message.to_le_bytes()[2] % 8;
    }

    pub fn attack(&self) -> u8 {
        return self.message.to_le_bytes()[3] % 4 + 1;
    }

    pub fn defense(&self) -> u8 {
        return self.message.to_le_bytes()[3] % 4 + 1;
    }

    pub fn exp(&self) -> u8 {
        return self.message.to_le_bytes()[3] * (self.message.to_le_bytes()[3] % 6 + 1);
    }

    pub fn damage(&self) -> u8 {
        return self.message.to_le_bytes()[3] % 4 + 1;
    }

    pub fn money(&self) -> u64 {
        return (self.message.to_le_bytes()[3] % 4 + 1) as u64 * 10u64.pow(constants::TOKEN_DECIMALS as u32);
    }
}


impl EventStorage {
    pub fn get_message(&self, message: u128) -> Option<Event> {
        for event in self.events.iter() {
            if event.message == message {
                return Some(event.clone());
            }
        }
        None
    }
}