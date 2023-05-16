import * as anchor from "@coral-xyz/anchor";
import { Program } from "@project-serum/anchor"
import { Order } from "../target/types/order";
import { assert, expect } from "chai";

describe("order", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Order as Program<Order>;

  it("Is initialized!", async () => {
    const order = anchor.web3.Keypair.generate();

    // Add your test here.
    const tx = await program.methods
      .createProduct(100, 0, 10000, "WildCraft Bag", "Just a bag", "123457")
      .accounts({ product: product.publicKey })
      .signers([product])
      .rpc();

    console.log("Your transaction signature", tx);
  });
});
