import {
  Card,
  CardBody,
  Image,
  Stack,
  Heading,
  Text,
  CardFooter,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useToast,
  useDisclosure,
  Input,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import timestampToDate from "../utils/timestampToDate";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useCallback, useState } from "react";
import useAnchor from "../hooks/useAnchor";
import { useWallet } from "@solana/wallet-adapter-react";
import { OrderAcceptInputSchema, OrderSchema } from "../schema/OrderSchema";
import { BN } from "@project-serum/anchor";
import { OrderFilter, UserType } from "../pages/order/OrderList";

const initData: OrderAcceptInputSchema = {
  expectedDelivery: "",
  deliveryCharge: "",
};

const OrderCard = ({
  orderKey,
  order,
  reload,
  okBtnTxt,
  cancelBtnTxt,
  orderFilter,
  type,
}: {
  orderKey: PublicKey;
  order: OrderSchema;
  orderFilter: OrderFilter;
  type: UserType;
  reload: () => Promise<void>;
  okBtnTxt?: string;
  cancelBtnTxt?: string;
}) => {
  const [data, setData] = useState(initData);
  const { programs, provider } = useAnchor();
  const { publicKey, wallet } = useWallet();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const deliverycharge = new BN(order.deliveryCharge).toNumber();
  const total_charge =
    (deliverycharge + new BN(order.productCharge).toNumber()) /
    LAMPORTS_PER_SOL;

  const expectedDate = timestampToDate(
    new BN(order.expectedAt).toString(),
    true
  );

  const onDataChange = useCallback(
    (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const name = e.currentTarget.name;
      const value = e.currentTarget.value;

      setData((prev) => ({ ...prev, [name]: value }));
    },
    [setData]
  );

  const acceptHandler = useCallback(
    async (data: OrderAcceptInputSchema) => {
      try {
        if (programs.orderProgram && publicKey) {
          const expectedDeliveryTS = new BN(
            new Date(data.expectedDelivery).getTime()
          );
          const deliveryChargeLamps = new BN(
            Number.parseFloat(data.deliveryCharge) * LAMPORTS_PER_SOL
          );

          await programs.orderProgram.methods
            .acceptOrder(deliveryChargeLamps, expectedDeliveryTS)
            .accounts({
              order: orderKey,
              product: order.product,
              seller: publicKey,
            })
            .signers([])
            .rpc();

          toast({
            title: "Order Accepted",
            status: "success",
            isClosable: true,
            duration: 3000,
          });

          reload();
        }
      } catch (err) {
        console.error(`ERROR: Unable to accept order\n${err}`);
        toast({
          title: "Failed to accept order!",
          status: "error",
          isClosable: true,
          duration: 3000,
        });
      }
    },
    [programs, order.product, order.buyer, orderKey, publicKey, reload]
  );

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          backgroundColor="gray.800"
          color="whiteAlpha.900"
          maxW="800px"
        >
          <ModalHeader>Accept Order</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6} w="800px">
            <form>
              <FormControl>
                <FormLabel>Expected Delivery Date:</FormLabel>
                <Input
                  onChange={onDataChange}
                  placeholder="Select expected delivery date"
                  size="md"
                  type="date"
                  name="expectedDelivery"
                  id="expectedDelivery"
                  value={data.expectedDelivery}
                />
              </FormControl>
              <FormControl marginTop="16px">
                <FormLabel>Delivery Charge:</FormLabel>
                <Input
                  onChange={onDataChange}
                  placeholder="delivery charge in SOL"
                  value={data.deliveryCharge}
                  name="deliveryCharge"
                  id="deliveryCharge"
                />
              </FormControl>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => acceptHandler(data)}
            >
              Accept
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Card
        direction={{ base: "column", sm: "row" }}
        overflow="hidden"
        variant="outline"
        w="740px"
        h="320px"
      >
        <Image
          objectFit="cover"
          maxW={{ base: "100%", sm: "240px" }}
          src={
            order.productData?.images ? order.productData.images[0] : undefined
          }
          alt="product-image"
        />

        <Stack>
          <CardBody>
            <Heading size="md">
              {order.productData?.title
                ? order.productData.title
                : "Unknown Title"}
            </Heading>
            <Text pt="16px">Quantity: {order.quantity}</Text>
            {orderFilter === OrderFilter.Accepted && (
              <Text>
                Delivery Charge: {deliverycharge / LAMPORTS_PER_SOL} SOL
              </Text>
            )}
            {orderFilter === OrderFilter.Accepted && (
              <Text>Total Charge: {total_charge} SOL</Text>
            )}
            {orderFilter === OrderFilter.Accepted && (
              <Text>
                Expected Delivery: {expectedDate?.getDate()} /{" "}
                {expectedDate?.getMonth()} / {expectedDate?.getFullYear()}
              </Text>
            )}
            <Text py="16px">
              {order.addressData.locale}, {order.addressData.state},{" "}
              {order.addressData.country}, {order.addressData.code}
            </Text>
          </CardBody>

          <CardFooter gap="24px">
            {!order.isAccepted && type === UserType.Seller ? (
              <Button variant="solid" colorScheme="green" onClick={onOpen}>
                {okBtnTxt ? okBtnTxt : "Accept"}
              </Button>
            ) : null}
            <Button variant="solid" colorScheme="red">
              {cancelBtnTxt ? cancelBtnTxt : "Reject"}
            </Button>
          </CardFooter>
        </Stack>
      </Card>
    </>
  );
};

export default OrderCard;
