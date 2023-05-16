import { useCallback, useEffect, useMemo, useState } from "react";
import ProductCard from "../../components/ProductCard";
import useAnchor from "../../hooks/useAnchor";
import { Flex, Heading } from "@chakra-ui/react";
import useArweave from "../../hooks/useArweave";
import { ProductFetchSchema } from "../../schema/ProductSchema";
import * as bs58 from "bs58";
import useSearch from "../../hooks/useSearch";

const Buy = () => {
  const { programs } = useAnchor();
  const [products, setProducts] = useState<ProductFetchSchema | []>([]);
  const { getTransactionData } = useArweave();
  const { searchWord } = useSearch();

  const productFilterOffset = useMemo(() => 8 + 32 + 32 + 8 + 8 + 8 + 4 + 4, []);

  const getProduct = useCallback(async () => {
    try {
      if (programs?.productProgram) {
        const products =
          (await programs.productProgram.account.product.all( /*searchWord ?*/ [
            {
              memcmp: {
                offset: productFilterOffset,
                bytes: bs58.encode(Buffer.from(searchWord))
              }
            }
          ] /*: []*/)) as unknown as ProductFetchSchema;

        // Convert the unixtimestamp to string for easy conversion of timestamp to date
        /* -- code here -- */
        const data = (await Promise.all(
          products.map(async (product) => {
            const ardata = await getTransactionData(product.account.storageId);
            return {
              ...product,
              account: {
                ...product.account,
                timestamp: product.account.timestamp.toString(),
              },
              images: ardata.images,
              details: ardata.details,
            };
          })
        )) as ProductFetchSchema;

        setProducts(data);
      }
    } catch (err) {
      console.error(`Error: Unable to get products\n${err}`);
    }
  }, [programs, getTransactionData, setProducts, searchWord]);

  useEffect(() => {
    getProduct();
  }, [searchWord]);

  return (
    // <SideBarLayout SideBar={Filter}>
    <>
      <Flex gap="32px" wrap="wrap" marginTop="24px">
        {products.map((product) => {
          return (
            <ProductCard
              key={product.publicKey.toString()}
              id={product.publicKey}
              inventory={product.account.inventory}
              image={product?.images && product?.images[0]}
              title={product.account.title}
              description={product.account.description}
              price={product.account.price}
              rating={product.account.rating}
              pubKey={product.publicKey}
            />
          );
        })}
      </Flex>
      <Flex
        height="85vh"
        marginTop="32px"
        justifyContent="center"
        alignItems="center"
      >
        {products.length === 0 && (
          <Heading size="md">No Available Products!</Heading>
        )}
      </Flex>
    </>
    // </SideBarLayout>
  );
};

export default Buy;
