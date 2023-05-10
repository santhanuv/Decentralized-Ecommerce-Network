import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Product } from "../target/types/product";

describe("product", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Product as Program<Product>;

  it("Is initialized!", async () => {
    const product = anchor.web3.Keypair.generate();

    // Add your test here.
    const tx = await program.methods
      .createProduct(100, 0, 10000, "WildCraft Bag", "Just a bag", "123457")
      .accounts({ product: product.publicKey })
      .signers([product])
      .rpc();

    console.log("Your transaction signature", tx);
  });
});
