import React, { useCallback, useEffect, useState } from "react";
import { ProductSchema } from "../../schema/ProductSchema";
import ProductCard from "../../components/ProductCard";
import useAnchor from "../../hooks/useAnchor";
import { PublicKey } from "@solana/web3.js";
import timestampToDate from "../../utils/timestampToDate";
import { Flex } from "@chakra-ui/react";
import SideBarLayout from "../../components/layout/SideBarLayout";
import Filter from "../../components/Filter";

type ProductFetchSchema = [
  {
    publicKey: PublicKey;
    account: ProductSchema;
  }
];

const Buy = () => {
  const { program } = useAnchor();
  const [products, setProducts] = useState<ProductFetchSchema | []>([]);

  const getProduct = useCallback(async () => {
    if (program) {
      const products =
        (await program.account.product.all()) as unknown as ProductFetchSchema;

      // Convert the unixtimestamp to string for easy conversion of timestamp to date
      const data = products.map((product) => ({
        ...product,
        account: {
          ...product.account,
          timestamp: product.account.timestamp.toString(),
        },
      })) as ProductFetchSchema;

      setProducts(data);
    }
  }, [program]);

  useEffect(() => {
    getProduct();
  }, [program]);

  return (
    <SideBarLayout SideBar={Filter}>
      <Flex gap="32px" wrap="wrap">
        {products.map((product) => {
          return (
            <ProductCard
              key={product.publicKey.toString()}
              image="#"
              title={product.account.title}
              description={product.account.description}
              price={product.account.price}
              rating={product.account.rating}
              pubKey={product.publicKey}
            />
          );
        })}
      </Flex>
    </SideBarLayout>
  );
};

export default Buy;
