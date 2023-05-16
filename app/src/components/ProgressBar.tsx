import {
  CircularProgress,
  CircularProgressLabel,
  Modal,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect } from "react";

const ProgressBar = ({
  showProgress,
  progressPercent,
  setProgressPercent,
}: {
  showProgress: boolean;
  progressPercent: number;
  setProgressPercent: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  //   const [showProgress, setShowProgress] = useState<boolean>(false);
  //   const [progressPercent, setProgressPercent] = useState<number>(0);

  useEffect(() => {
    if (showProgress) {
      !isOpen && onOpen();
    } else {
      isOpen && onClose();
      setProgressPercent(0);
    }
  }, [showProgress]);

  return (
    <div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay
          display="flex"
          justifyContent="center"
          alignItems="center"
          gap="25px"
          backgroundColor="black"
          opacity="0.9 !important"
        >
          <CircularProgress
            value={progressPercent}
            color="green.600"
            size="70px"
          >
            <CircularProgressLabel>{progressPercent}%</CircularProgressLabel>
          </CircularProgress>
          <Text color="white">Uploading Image</Text>
          <button
            onClick={(e) => {
              e.preventDefault();
              onClose();
            }}
          >
            close
          </button>
        </ModalOverlay>
      </Modal>
    </div>
  );
};

export default ProgressBar;
