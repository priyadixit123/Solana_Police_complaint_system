use anchor_lang::prelude::*;

// This is your program's public key and it will update
// automatically when you build the project.
declare_id!("HaGdCz9jNq7NMj99Je5ffNWZ6vkMbFkYP3qwnUeYzFe9");

#[program]
pub mod solana_police_complaints {
    use super::*;
    pub fn file_complaint(ctx: Context<FileComplaint>, description: String,) -> Result<()> {
       let complaint = &mut ctx.accounts.complaint;
       complaint.user = ctx.accounts.user.key();
       complaint.police = ctx.accounts.user.key();
       complaint.description = description;
       complaint.status = "Pending".to_string();
       complaint.timestamp = Clock::get()?.unix_timestamp;
        Ok(())
    }

    pub fn udpate_status(ctx: Context<UpdateStatus>, new_status: String,) -> Result<()> {
       let complaint = &mut ctx.accounts.complaint;
                
       complaint.status =  new_status;
        
        Ok(())
    }
}


#[derive(Accounts)]
pub struct FileComplaint<'info> {
     
    #[account(init, payer = user, space = 8 + 32 + 4 + 200 + 4 + 20 + 8)]
    pub complaint: Account<'info, Complaint>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateStatus<'info> {
     
    #[account( mut, has_one = police )]
    pub complaint: Account<'info, Complaint>,
     
    pub police: Signer<'info>,
     
}

#[account]
pub struct Complaint {
     pub user : Pubkey,
     pub police : Pubkey,
     pub description: String,
     pub status : String,
     pub timestamp:i64,
      
}