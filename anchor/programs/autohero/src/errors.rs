use anchor_lang::prelude::*;


#[error_code]
pub enum AutoHeroError {
    #[msg("Can not apply event")]
    EventCannotbeApplied,

    #[msg("Event is applied")]
    EventIsApplied,
}
