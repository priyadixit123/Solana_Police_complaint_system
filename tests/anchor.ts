import assert from "assert";
import * as web3 from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SolanaPoliceComplaints } from "../target/types/solana_police_complaints";";
import { assert } from "chai";
import type { SolanaPoliceComplaints } from "../target/types/solana_police_complaints";

 
 describe("solana_police_complaints", () => {
  // Configure the client to use the local cluster
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.SolanaPoliceComplaints as anchor.Program<SolanaPoliceComplaints>;
  

const provider =anchor.AnchorProvider.env();
anchor.setProvider(provider);
const program = anchor.workspace.SolanaPoliceComplaints as Program<SolanaPoliceComplaints>;
const user = provider.wallet;

const complaintAccount = anchor.web3.Keypair.generate();

  it("Files a new complaint", async () => {
    // Generate keypair for the new account
    const tx =  await program.methods
    .fileComplaint("I was robbed at the park.")
    .accounts({
      complaint:complaintAccount.publicKey,
      user:user.publicKey,
      systemProgram:anchor.web3.SystemProgram.programId,
    })
    .signers([complaintAccount])
    .rpc();

    console.log("Filed complaint with tx:", tx);

    //fetch the complaint account
    const complaint = await program.account.complaint.fetch(
      complaintAccount.publicKey
    );

    assert.equal(complaint.user.toBase58(), user.publicKey.toBase58());
    assert.equal(complaint.description,"I was robbeb at the park.");
    assert.equal(complaint.status,"Pending");

    console.log("complaint", complaint);
  });

  it("Updates Complaint status to in progress",async ()=> {
    const tx = await program.methods
    .udpateStatus("In Progress")
    .accounts({
      complaint : complaintAccount.publicKey,
      police: user.publicKey,
    })
    .rpc();

    console.log("Updated complaint status tx:", tx);

    const updatedComplaint = await program.account.complaint.fetch(
      complaintAccount.publicKey
    );

    assert.equal(updatedComplaint.status, "In progress");
    console.log("update complaint:", updatedComplaint);
  });

  it("Updates complaint status to Resolved", async () =>{
    const tx = await program.methods
    .udpateStatus("Resolved")
    .accounts({
      complaint: complaintAccount.publicKey,
      police: user.publicKey,


    })
    .rpc();

    const finalComplaint = await program.account.complaint.fetch(
      complaintAccount.publicKey
    );
    assert.equal(finalComplaint.status,"Resolved");
    console.log("final complaint:", finalComplaint);
  });


});
