import React, { useCallback, useEffect, useState } from 'react'
import useCart from '../../hooks/useCart'
import useAnchor from '../../hooks/useAnchor';
import { useWallet } from "@solana/wallet-adapter-react";
import useArweave from '../../hooks/useArweave';
import { Cart } from '../../schema/CartSchema';
import CartCard from '../../components/CartCard';
import { 
  SimpleGrid, 
} from '@chakra-ui/react';

const CartPage = () => {
    const { fetchUserCart } = useCart();
    const { programs } = useAnchor();
    const { publicKey } = useWallet();
    const { getTransactionData } = useArweave();
    const [carts, setCarts] = useState<Cart[]>([]);

    const fetch = useCallback(async () => {
        try {
            if(!programs.userProgram || !programs.productProgram) 
                throw new Error("Invalid programs");
            
            if(!publicKey) throw new Error("Wallet not connected!");

            const data = await fetchUserCart(
                programs.userProgram,
                programs.productProgram,
                publicKey,
                getTransactionData,
            )

            setCarts(data);
        } catch (err) {
            console.error(err);
        }
    }, [])

    useEffect(() => {
        fetch();
    }, [])

  return (
    <>
        <SimpleGrid
        marginTop="24px"
        spacingX="5"
        spacingY="10"
        gridTemplateColumns="repeat(auto-fit,minmax(740px, 0fr))"
        >
            {carts.map(cart => {
                return <CartCard key={cart.id.toString()} cart={cart} />
            })}
        </SimpleGrid>
    </>
  )
}

export default CartPage