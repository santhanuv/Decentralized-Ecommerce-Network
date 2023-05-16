import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import useProduct from "../hooks/useProduct";
import { Program, Idl } from "@project-serum/anchor";
import { ProductSchema } from "./ProductSchema";

export type CartProductData = {
    id: PublicKey | null;
    coverImage: string;
    title: string;
    price: number;
}

type FetchProductFunction = (program: Program<Idl>, productID: PublicKey, getTransactionData: (txId: string) => Promise<any>) => Promise<{
    data: ProductSchema;
    images: string[] | null;
    details: string;
}>

export interface CartFetch {
    account: {
        product: PublicKey;
        user: PublicKey 
        quantity: number;
        bump: string;
    }
    publicKey: PublicKey;
}

export class Cart {
    id: PublicKey;
    product: CartProductData;
    user: PublicKey | null;
    quantity: number;

    constructor(
        id: PublicKey,
        product: PublicKey | null, 
        user: PublicKey | null, 
        quantity: number = 1,
    ) {
        this.id = id;
        this.product = {
            id: product,
            coverImage: "",title: "",
            price: Number.parseInt("0")
        }
        this.user = user;
        this.quantity = quantity;
    }

    async getProductData(
        fetchProduct: FetchProductFunction,
        program: Program<Idl>,
        productID: PublicKey,
        getTransactionData: (txId: string) => Promise<any>,
    ) {
        const { data, images } = 
            await fetchProduct(program, productID, getTransactionData);
        
        const coverImage = images ? images[0] : null;
        return { title: data.title, price: data.price, coverImage }
    }

    async updateProductData(
        fetchProduct: FetchProductFunction,
        program: Program<Idl>,
        productID: PublicKey,
        getTransactionData: (txId: string) => Promise<any>,
    ) {
        const { title, price, coverImage } = 
            await this.getProductData(
                fetchProduct,
                program,
                productID,
                getTransactionData,
        );
        
        if(coverImage) this.product.coverImage = coverImage;

        this.product.price = price;
        this.product.title = title;
    }

    getTotalPriceInSOL() {
        return (this.product.price * this.quantity) / LAMPORTS_PER_SOL;
    }
}