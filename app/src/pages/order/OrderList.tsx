import { SimpleGrid, Text } from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useCallback, useEffect, useState } from "react";
import OrderCard from "../../components/OrderCard";
import useAnchor from "../../hooks/useAnchor";
import useArweave from "../../hooks/useArweave";
import useOrder from "../../hooks/useOrder";
import useProduct from "../../hooks/useProduct";
import { OrderFetchSchema } from "../../schema/OrderSchema";

export enum UserType {
  Seller,
  Buyer,
}

export enum OrderFilter {
  Pending,
  Accepted,
  Confirmed,
  Completed,
}

const OrderList = ({
  type,
  orderFilter,
  okBtnText,
  cancelBtnText,
}: {
  type: UserType;
  orderFilter: OrderFilter;
  okBtnText?: string;
  cancelBtnText?: string;
}) => {
  const [orders, setOrders] = useState<OrderFetchSchema[] | []>([]);
  const { programs } = useAnchor();
  const { publicKey } = useWallet();
  const {
    fetchPendingSellerOrders,
    fetchAcceptedSellerOrders,
    fetchConfirmedSellerOrders,
    fetchCompletedSellerOrders,
  } = useOrder();
  const { getTransactionData } = useArweave();

  const fetch = useCallback(async () => {
    try {
      if (!programs.productProgram)
        throw new Error("No product program found!");
      if (!programs.orderProgram) throw new Error("No order program found");
      if (!programs.userProgram) throw new Error("No user program found!");

      if (!publicKey) throw new Error("No Public Key found!");

      let data: OrderFetchSchema[] = [];
      if (orderFilter === OrderFilter.Pending) {
        data = await fetchPendingSellerOrders(
          programs.orderProgram,
          programs.productProgram,
          programs.userProgram,
          publicKey,
          type,
          getTransactionData
        );
      } else if (orderFilter === OrderFilter.Accepted) {
        data = await fetchAcceptedSellerOrders(
          programs.orderProgram,
          programs.productProgram,
          programs.userProgram,
          publicKey,
          type,
          getTransactionData
        );
      } else if (orderFilter === OrderFilter.Confirmed) {
        data = await fetchConfirmedSellerOrders(
          programs.orderProgram,
          programs.productProgram,
          programs.userProgram,
          publicKey,
          type,
          getTransactionData
        )
      } else {
        data = await fetchCompletedSellerOrders(
          programs.orderProgram,
          programs.productProgram,
          programs.userProgram,
          publicKey,
          type,
          getTransactionData
        );
      }

      setOrders(data);
    } catch (err) {
      console.log(`ERROR: Unable to fetch data\n${err}`);
    }
  }, [programs, getTransactionData, setOrders, orderFilter, type, publicKey]);

  useEffect(() => {
    fetch();
  }, [orderFilter]);

  return (
    <SimpleGrid
      marginTop="24px"
      spacingX="5"
      spacingY="10"
      gridTemplateColumns="repeat(auto-fit,minmax(740px, 0fr))"
    >
      {orders.length ? (
        orders.map((order) => {
          return (
            order.account.productData && (
              <OrderCard
                key={order.publicKey.toString()}
                orderFilter={orderFilter}
                type={type}
                orderKey={order.publicKey}
                reload={fetch}
                okBtnTxt={okBtnText}
                cancelBtnTxt={
                  cancelBtnText
                    ? cancelBtnText
                    : orderFilter === OrderFilter.Accepted ||
                      type === UserType.Buyer
                    ? "Cancel"
                    : "Reject"
                }
                order={order.account}
              />
            )
          );
        })
      ) : (
        <Text>You have no orders!</Text>
      )}
    </SimpleGrid>
  );
};

export default OrderList;
