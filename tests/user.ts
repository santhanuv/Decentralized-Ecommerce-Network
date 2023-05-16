import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { User } from "../target/types/user";

describe("product", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Product as Program<User>;

  it("Is initialized!", async () => {
    const user = anchor.web3.Keypair.generate();

    // Add your test here.
    const tx = await program.methods
      .createUser("Santhan", "V", "123", "s@email.com", "123")
      .accounts({ userAccount: user.publicKey })
      .signers([user])
      .rpc();

    console.log("Your transaction signature", tx);
  });
});
