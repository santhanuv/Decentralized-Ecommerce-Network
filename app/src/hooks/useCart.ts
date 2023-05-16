import { useState, useCallback } from "react";
import { Cart, CartFetch } from "../schema/CartSchema";
import { Idl, Program } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { utils } from "@coral-xyz/anchor";
import useProduct from "./useProduct";

const useCart = () => {
    const [userCarts, setUserCarts] = useState<Cart[]>([]);
    const { fetchProduct } = useProduct();

    const fetchUserCart = useCallback(async (
        userProgram: Program<Idl>,
        productProgram: Program<Idl>,
        userID: PublicKey,
        getTransactionData: (txId: string) => Promise<any>,
    ) => { 
        const cartsRaw: CartFetch[] = await userProgram.account.cart.all([
            {
                memcmp: {
                    offset: 8 + 32, // descriminator + product key
                    bytes: userID.toBase58(),
                }
            }
        ]) as unknown as CartFetch[];

        const carts = await Promise.all(
            cartsRaw.map(async (cart) => {
                const cartObj = new Cart(
                    cart.publicKey,
                    cart.account.product, 
                    cart.account.user, 
                    cart.account.quantity
                );

                await cartObj.updateProductData(
                    fetchProduct,
                    productProgram,
                    cart.account.product,
                    getTransactionData
                );

                return cartObj;
            })
        );

        return carts;
    }, []);

    const addToCart = useCallback(async (
        userProgram: Program<Idl>,
        productID: PublicKey,
        userID: PublicKey,
        quantity: number,
    ) => {
        try {
            const [cartPDA] = PublicKey.findProgramAddressSync(
                [
                utils.bytes.utf8.encode("cart"),
                userID.toBuffer(),
                productID.toBuffer(),
                ],
                userProgram.programId
            );

            return await userProgram.methods
                .addToCart(quantity)
                .accounts({
                    cart: cartPDA,
                    product: productID,
                    user: userID,
                })
                .signers([])
                .rpc() 
        } catch (err) {
            throw err;
        }
    }, [])

    return { fetchUserCart, addToCart };
}

export default useCart;