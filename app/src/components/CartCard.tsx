import { 
    Box, 
    Button, 
    Flex, 
    Heading, 
    Spacer, 
    Text, 
    VStack,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    useDisclosure,
    useToast,
} from '@chakra-ui/react'
import { useCallback, useState } from 'react'
import { Cart } from '../schema/CartSchema'
import { AddressFetchSchema } from '../schema/UserSchema';
import { AddressCard } from './AddressCard';
import useAnchor from '../hooks/useAnchor';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import useOrder from '../hooks/useOrder';

const CartCard = ({ cart }: { cart: Cart}) => {
    const { programs } = useAnchor();
    const { publicKey } = useWallet();
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [selectedAddress, setSelectedAddress] =
        useState<AddressFetchSchema | null>(null);
    const productID = cart.product.id;
    const { placeOrder } = useOrder();
    const toast = useToast();


    const removeFromCart = useCallback(
        async (showToast: boolean = true
    ) => {
        try {
            if(!programs.userProgram) throw new Error("Invalid program");
            if(!publicKey) throw new Error("Wallet not connected!");

            await programs.userProgram.methods
                .removeFromCart()
                .accounts({
                    cart: cart.id,
                    user: publicKey,
                })
                .signers([])
                .rpc();

            if(showToast) {
                toast({
                    title: "Product removed from cart",
                    status: "success",
                    isClosable: true,
                    duration: 3000,
                });
            }
        } catch (err) {
            console.error(err);
            if (showToast) {
                toast({
                    title: "Failed to place order!",
                    status: "error",
                    isClosable: true,
                    duration: 3000,
                });
            }
        }
    }, [])

    const buyHandler = useCallback(async () => {
    try {
      if (programs?.orderProgram && productID) {
        if (!publicKey) throw new Error("Your wallet is not connected!");
        if (!selectedAddress) throw new Error("Address not selected");

        const productKey = new PublicKey(productID);

        onClose();

        await placeOrder(
          programs.orderProgram,
          productKey,
          publicKey,
          selectedAddress.publicKey,
          `${cart.quantity}`
        );

        toast({
          title: "Order Placed",
          status: "success",
          isClosable: true,
          duration: 3000,
        });
        
        await removeFromCart(false);
      }
    } catch (err) {
      console.error(`ERROR:Unable to place the order\n${err}`);
      toast({
        title: "Failed to place order!",
        status: "error",
        isClosable: true,
        duration: 3000,
      });
    }
  }, [programs, productID, cart.quantity, selectedAddress]);


  return (
    <>
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent
            backgroundColor="gray.800"
            color="whiteAlpha.900"
            maxW="800px"
            >
            <ModalHeader textAlign="center">
                Delivery Address
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6} w="800px">
                <AddressCard
                    headText={null}
                    addDelBtn={false}
                    addEditBtn={false}
                    onClick={(_, address) => {
                    setSelectedAddress(address);
                    }}
                />
            </ModalBody>
                <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={buyHandler}>
                    Buy
                </Button>
                <Button onClick={onClose}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
        <Box>
            <Flex gap="16px" w="520px" border="1px solid white">
                <Box>
                    <img 
                        src={cart.product.coverImage} 
                        style={{
                            width: "200px",
                            height: "100%",
                        }}
                    />
                </Box>
                <VStack alignItems="flex-start" padding="16px">
                    <Heading size="mg">{cart.product.title}</Heading>
                    <Text>Quantity: {cart.quantity}</Text>
                    <Text>Price: {cart.getTotalPriceInSOL()} SOL</Text>
                    <Spacer />
                    <Flex gap="16px">
                        <Button colorScheme="green" size="sm" onClick={onOpen}>
                            Buy Now
                        </Button>
                        <Button 
                            colorScheme="red" 
                            size="sm" 
                            onClick={() => removeFromCart()}>
                                Cancel
                        </Button>
                    </Flex>
                </VStack>
            </Flex>
        </Box>
    </>
  )
}

export default CartCard