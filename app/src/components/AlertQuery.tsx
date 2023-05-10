import React from "react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  useDisclosure,
} from "@chakra-ui/react";

function AlertQuery({
  isOpen,
  onClose,
  headerTxt,
  prompt,
  yesHandler,
  noHandler,
}: {
  isOpen: boolean;
  onClose: () => void;
  headerTxt: string;
  prompt: string;
  yesHandler: () => any;
  noHandler: () => any;
}) {
  const cancelRef = React.useRef() as React.RefObject<any>;

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {headerTxt}
          </AlertDialogHeader>

          <AlertDialogBody>{prompt}</AlertDialogBody>

          <AlertDialogFooter>
            <Button
              ref={cancelRef}
              onClick={() => {
                yesHandler();
                onClose();
              }}
            >
              Yes
            </Button>
            <Button
              colorScheme="red"
              onClick={() => {
                noHandler();
                onClose();
              }}
              ml={3}
            >
              No
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}

export default AlertQuery;
