use anchor_lang::prelude::*;

declare_id!("FoYSrfkztZJXMBa3Xv96JA7Khr5Tyccx6Q9Z4V8k7DQc");

#[program]
pub mod mine_solana_nft_anchor {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
