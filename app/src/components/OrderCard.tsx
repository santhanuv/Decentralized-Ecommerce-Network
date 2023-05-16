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
  Textarea,
  Box,
} from "@chakra-ui/react";
import timestampToDate from "../utils/timestampToDate";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useCallback, useState } from "react";
import useAnchor from "../hooks/useAnchor";
import { useWallet } from "@solana/wallet-adapter-react";
import { CancelOrder, CancelOrderEnum, OrderAcceptInputSchema, OrderSchema } from "../schema/OrderSchema";
import { BN } from "@project-serum/anchor";
import { OrderFilter, UserType } from "../pages/order/OrderList";
import { utils } from "@coral-xyz/anchor";

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
  const [cancelReason, setCancelReason] = useState("");
  const [showCancelReason, setShowCancelReason] = useState(false);
  const { programs, provider } = useAnchor();
  const { publicKey, wallet } = useWallet();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const deliverycharge = new BN(order.deliveryCharge).toNumber();
  const productCharge = new BN(order.productCharge).toNumber();
  const total_charge =
    (deliverycharge + productCharge) / LAMPORTS_PER_SOL;

  const expectedDate = timestampToDate(
    new BN(order.expectedAt).toString(),
    true
  );

  const cancelOrder = new CancelOrder(order.canceled);

  const onDataChange = useCallback(
    (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const name = e.currentTarget.name;
      const value = e.currentTarget.value;

      setData((prev) => ({ ...prev, [name]: value }));
    },
    [setData]
  );

  const acceptCancelRequest = useCallback(async () => {
    if(programs.orderProgram && publicKey) {
       try {
        const buyerPubKey = new PublicKey(order.buyer);
        const sellerPubKey = new PublicKey(order.seller);

        await programs.orderProgram.methods
          .acceptCancel()
          .accounts({
            order: orderKey,
            signer: publicKey,
            buyer: buyerPubKey,
            seller: sellerPubKey,
          })
          .signers([])
          .rpc();

          toast({
            title: "Order Canceled",
            status: "success",
            isClosable: true,
            duration: 3000,
          });
       } catch (err) {
        console.error(`ERROR: Unable to request cancellation\n${err}`);
         toast({
          title: "Failed to cancel order!",
          status: "error",
          isClosable: true,
          duration: 3000,
        });
       } 
    } else console.error("Invalid program or public key.")

    reload();
  }, [reload]);

  const requestCancel = useCallback(async (cancelReason: string) => {
    setShowCancelReason(false);

    if(programs.orderProgram && publicKey) {
       try {
        if(type === UserType.Buyer && !order.isAccepted) {
          await programs.orderProgram.methods
            .closeOrder()
            .accounts({
              order: orderKey,
              signer: publicKey,
            })
            .signers([])
            .rpc();
        } else {
          await programs.orderProgram.methods
            .cancelRequest(cancelReason)
            .accounts({
              order: orderKey,
              signer: publicKey,
              buyer: new PublicKey(order.buyer),
            })
            .signers([])
            .rpc();
          }

          toast({
            title: !order.isAccepted && type === UserType.Buyer ?
                "Order Cancelled" : "Requested Cancellation",
            status: "success",
            isClosable: true,
            duration: 3000,
          });
       } catch (err) {
        console.error(`ERROR: Unable to request cancellation\n${err}`);
         toast({
          title: !order.isAccepted && type === UserType.Buyer ?
            "Failed to cancel Order!" : "Failed to request cancellation!",
          status: "error",
          isClosable: true,
          duration: 3000,
        });
       } 
    } else console.error("Invalid program or public key.")

    reload();
  }, [reload, type]);

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

  const confirmOrder = useCallback(
    async () => {
      try {
        if (programs.orderProgram && publicKey) {

          await programs.orderProgram.methods
            .confirmOrder()
            .accounts({
              order: orderKey,
              buyer: publicKey,
            })
            .signers([])
            .rpc();

          toast({
            title: "Order Confirmed",
            status: "success",
            isClosable: true,
            duration: 3000,
          });

          reload();
        }
      } catch (err) {
        console.error(`ERROR: Unable to accept order\n${err}`);
        toast({
          title: "Failed to Confirm order!",
          status: "error",
          isClosable: true,
          duration: 3000,
        });
      }
    },
    [programs, order.product, order.buyer, orderKey, publicKey, reload]
  );

  const completeOrder = useCallback(
    async () => {
      try {
        if (programs.orderProgram && publicKey) {
          await programs.orderProgram.methods
            .completeOrder()
            .accounts({
              order: orderKey,
              signer: publicKey,
              seller: order.seller,
            })
            .signers([])
            .rpc();

          toast({
            title: "Order Completed",
            status: "success",
            isClosable: true,
            duration: 3000,
          });
          
          reload();
        }
      } catch (err) {
        console.error(`ERROR: Unable to accept order\n${err}`);
        toast({
          title: "Failed to complete order!",
          status: "error",
          isClosable: true,
          duration: 3000,
        });
      }
    },
    [programs, order.product, order.buyer, orderKey, publicKey, reload]
  );

  const closeOrder = useCallback(
    async () => {
      try {
        if (programs.orderProgram && publicKey) {

          if (type !== UserType.Buyer) throw new Error("Only buyer can close the order.");

          await programs.orderProgram.methods
            .closeOrder()
            .accounts({
              order: orderKey,
              signer: publicKey,
            })
            .signers([])
            .rpc();

          toast({
            title: "Order Closed",
            status: "success",
            isClosable: true,
            duration: 3000,
          });

          reload();
        }
      } catch (err) {
        console.error(`ERROR: Unable to accept order\n${err}`);
        toast({
          title: "Failed to Close the order!",
          status: "error",
          isClosable: true,
          duration: 3000,
        });
      }
    },
    [programs, order.product, order.buyer, orderKey, publicKey, reload]
  );


  const getButtons = useCallback(() => {
    const buttons = [];
    const requestedForCancelBox = (
      <Box 
        background="red.800"
        padding="8px 16px"
        >
        Requested for cancellation
      </Box>
    )
    const requestCancelBtn = (
      <Button
        variant="solid"
        colorScheme="red"
        onClick={() => requestCancel("")}
      >
        Cancel
      </Button>
    );
    const requestCancelWithReasonBtn = (
      <Button
        variant="solid"
        colorScheme="red"
        onClick={() => {
          setShowCancelReason(true)
          onOpen()
        }}
      >
        Request Cancel
      </Button>
    )
    const acceptCancelBtn = (
      <Button 
        variant="solid" 
        colorScheme="orange"
        onClick={acceptCancelRequest}
      >
        Accept Cancel
      </Button>
    );
    const acceptOrderBtn = (
      <Button variant="solid" colorScheme="green" onClick={onOpen}>
        {okBtnTxt ? okBtnTxt : "Accept"}
      </Button>
    );
    const rejectOrderBtn = (
      <Button 
        variant="solid" 
        colorScheme="red" 
        onClick={() => {
          setShowCancelReason(true);
          onOpen();
        }}
      >
        {cancelBtnTxt ? cancelBtnTxt : "Reject"}
      </Button>
    )
    const confirmOrderBtn = (
      <Button
        variant="solid"
        colorScheme="green"
        onClick={() => {
          confirmOrder();
      }}
      >
        Confirm Order
      </Button>
    )
    const completeOrderBtn = (
      <Button
        variant="solid"
        colorScheme="green"
        onClick={() => {
          completeOrder();
      }}
      >
        Complete Order
      </Button>
    );
    const closeOrderBtn = (
      <Button
        variant="solid"
        colorScheme="green"
        onClick={() => {
          closeOrder();
        }}
      >
        Close Order
      </Button>
    )

    if (type === UserType.Buyer) {
      switch (orderFilter) {
        case OrderFilter.Pending: {
          if(cancelOrder.cancelled === CancelOrderEnum.NotCanceled) {
            buttons.push(requestCancelBtn);
          } else if(cancelOrder.cancelled === CancelOrderEnum.Seller) {
            buttons.push(acceptCancelBtn);
          }
          break;
        }
        case OrderFilter.Accepted: {
          if(cancelOrder.cancelled === CancelOrderEnum.NotCanceled) {
            buttons.push(confirmOrderBtn);
            buttons.push(requestCancelWithReasonBtn);
          } else if (cancelOrder.cancelled === CancelOrderEnum.Seller) {
            buttons.push(acceptCancelBtn);
          }
          break;
        }
        case OrderFilter.Confirmed: {
          if(cancelOrder.cancelled === CancelOrderEnum.NotCanceled) {
            buttons.push(completeOrderBtn);
            buttons.push(requestCancelWithReasonBtn);
          } else if (cancelOrder.cancelled === CancelOrderEnum.Seller) {
            buttons.push(acceptCancelBtn);
          }
          break;
        }
        case OrderFilter.Completed: {
          if(order.isCompleted) {
            buttons.push(closeOrderBtn);
          }
        }
      }
    } else {
      switch(orderFilter) {
        case OrderFilter.Pending: {
          if (cancelOrder.cancelled === CancelOrderEnum.NotCanceled) {
            buttons.push(acceptOrderBtn);
            buttons.push(rejectOrderBtn);
          } else if (cancelOrder.cancelled === CancelOrderEnum.Buyer) {
            buttons.push(acceptCancelBtn);
          }

          break;
        }
        case OrderFilter.Accepted: {
          if (cancelOrder.cancelled === CancelOrderEnum.NotCanceled) {
            buttons.push(requestCancelWithReasonBtn);
          } else if(cancelOrder.cancelled === CancelOrderEnum.Buyer) {
            buttons.push(acceptCancelBtn);
          }
          break;
        }
        case OrderFilter.Confirmed: {
          if (cancelOrder.cancelled === CancelOrderEnum.NotCanceled) {
            buttons.push(requestCancelWithReasonBtn);
          } else if (cancelOrder.cancelled === CancelOrderEnum.Buyer) {
            buttons.push(acceptCancelBtn);
          }
        }
      }
    }

    if(cancelOrder.cancelled !== CancelOrderEnum.NotCanceled) {
      buttons.push(requestedForCancelBox);
    }

    return buttons;
  }, [
    type, orderFilter, cancelOrder, setShowCancelReason
  ])

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
              {showCancelReason ? (
                <FormControl>
                  <FormLabel>Cancel Reason:</FormLabel>
                  <Textarea
                    onChange={(e) => {
                      const value = e.currentTarget.value;
                      setCancelReason(value)
                    }}
                    placeholder="Reason for canceling"
                    name="cancelReason"
                    id="cancelReason"
                    value={cancelReason}
                  />
                </FormControl>
              )
              :
              <>
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
              </>}
            </form>
          </ModalBody>
          <ModalFooter>
            {showCancelReason ? 
              <Button
                colorScheme="blue"
                mr={3}
                onClick={() =>{
                  onClose();
                  requestCancel(cancelReason);
                }}
              >
                Request Cancel
              </Button> :
              <Button
                colorScheme="blue"
                mr={3}
                onClick={() =>{
                  onClose(); 
                  acceptHandler(data)
                }}
              >
                Accept
              </Button>
          }

            <Button onClick={() => { 
              onClose();
              setShowCancelReason(false);
            }}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Card
        direction={{ base: "column", sm: "row" }}
        overflow="hidden"
        variant="outline"
        w="740px"
        h="380px"
        border={
          cancelOrder.cancelled !== CancelOrderEnum.NotCanceled ? 
          "4px solid red" : "0px"
        }
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
            {!order.isAccepted ? null :  (
              <Text>
                Delivery Charge: {deliverycharge / LAMPORTS_PER_SOL} SOL
              </Text>
            )}
            {order.isAccepted ? (
              <>
                <Text>Product Charge: {productCharge / LAMPORTS_PER_SOL} SOL</Text>
                <Text>Total Charge: {total_charge} SOL</Text>
              </>
            ) : ( <Text>Product Charge: {productCharge / LAMPORTS_PER_SOL} SOL</Text>)}
            {!order.isAccepted  || order.isCompleted ? null : (
              <Text>
                Expected Delivery: {expectedDate?.getDate()} /{" "}
                {expectedDate?.getMonth() ? expectedDate.getMonth() + 1 : -1} / {expectedDate?.getFullYear()}
              </Text>
            )}
            <Text py="16px">
              {order.addressData.locale}, {order.addressData.state},{" "}
              {order.addressData.country}, {order.addressData.code}
            </Text>
            {
              cancelOrder.cancelled !== CancelOrderEnum.NotCanceled && (
                <Text>
                  Cancel Reason: {order.cancelReason}
                </Text>
              )
            }
          </CardBody>

          <CardFooter gap="24px">
            {/* {!order.isAccepted && type === UserType.Seller ? (
              <Button variant="solid" colorScheme="green" onClick={onOpen}>
                {okBtnTxt ? okBtnTxt : "Accept"}
              </Button>
            ) : null} */}
            {/* {getAcceptButtons(type, orderFilter)}
            {getRejectButtons(type, orderFilter)} */}
            {...getButtons()}
            {/* <Button variant="solid" colorScheme="red">
              {cancelBtnTxt ? cancelBtnTxt : "Reject"}
            </Button> */}
          </CardFooter>
        </Stack>
      </Card>
    </>
  );
};

export default OrderCard;
