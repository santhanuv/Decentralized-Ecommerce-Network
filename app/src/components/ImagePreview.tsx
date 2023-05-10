import { Box, Flex, IconButton, Image, Text } from "@chakra-ui/react";
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
  images: string[] | null;
  maxImageW: string;
  maxImageH: string;
  selectedIndex: number;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
}) => {
  useEffect(() => {
    if (images?.length) {
      setSelectedIndex(images.length - 1);
    }
  }, [images]);

  const changeSelectedImage = useCallback(
    (action: PreviewIndexAction) => {
      if (images) {
        if (action === PreviewIndexAction.NEXT) {
          setSelectedIndex((prev) => (prev + 1 < images.length ? prev + 1 : 0));
        } else {
          setSelectedIndex((prev) =>
            prev - 1 > -1 ? prev - 1 : images.length - 1
          );
        }
      }
    },
    [images, selectedIndex]
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
        {images ? (
          <Flex justifyContent="center">
            <Image
              src={`${images[selectedIndex]}`}
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
