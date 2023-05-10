import {
  Box,
  Button,
  Container,
  Flex,
  IconButton,
  Image,
  Text,
} from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

const ImagePreview = ({
  images,
  maxImageW,
  maxImageH,
  selectedIndex,
  setSelectedIndex,
  ...props
}: {
  [index: string]: any;
  images: FileList | null;
  maxImageW: string;
  maxImageH: string;
  selectedIndex: number;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const [previews, setPreviews] = useState<string[] | null>(null);

  useEffect(() => {
    if (images) {
      const urlList = [...images].map((image) => URL.createObjectURL(image));
      setPreviews(urlList);

      // To avoid memory leak
      return () => urlList.map((url) => URL.revokeObjectURL(url));
    }

    return () => {};
  }, [images]);

  useEffect(() => {
    if (previews?.length) {
      setSelectedIndex(previews.length - 1);
    }
  }, [previews]);

  const changeSelectedImage = useCallback(
    (action: PreviewIndexAction) => {
      if (previews) {
        if (action === PreviewIndexAction.NEXT) {
          setSelectedIndex((prev) =>
            prev + 1 < previews.length ? prev + 1 : 0
          );
        } else {
          setSelectedIndex((prev) =>
            prev - 1 > -1 ? prev - 1 : previews.length - 1
          );
        }
      }
    },
    [previews, selectedIndex]
  );

  return (
    <Flex alignItems="center" {...props}>
      <IconButton
        fontSize="4xl"
        variant="unstyled"
        aria-label="prev"
        onClick={() => changeSelectedImage(PreviewIndexAction.PREV)}
        icon={<MdKeyboardArrowLeft />}
      />
      <Box w="100%" h="100%">
        {previews ? (
          <Flex justifyContent="center">
            <Image
              src={previews[selectedIndex]}
              maxW={maxImageW}
              maxH={maxImageH}
            />
          </Flex>
        ) : (
          <Flex height="100%" justifyContent="center" alignItems="center">
            <Text textAlign="center">No Images to preview</Text>
          </Flex>
        )}
      </Box>
      <IconButton
        fontSize="4xl"
        variant="unstyled"
        aria-label="next"
        onClick={() => changeSelectedImage(PreviewIndexAction.NEXT)}
        icon={<MdKeyboardArrowRight />}
      />
    </Flex>
  );
};

enum PreviewIndexAction {
  NEXT,
  PREV,
}

export default ImagePreview;
