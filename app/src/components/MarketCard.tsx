import {
  Button,
  Card,
  CardBody,
  Heading,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { MarketSchema } from "../schema/MarketSchema";

type MarketCard = {
  name: string;
  coverImage: string;
  marketID: string;
};

const MarketCard = ({ name, coverImage, marketID }: MarketCard) => {
  return (
    <Card as={Link} w="240px" to={`/market/${marketID}`}>
      <CardBody w="100%" display="flex" flexDir="column" alignItems="center">
        <Image
          textAlign="center"
          src={coverImage ? coverImage : undefined}
          alt="cover-image"
          w="200px"
        />
        <Stack marginTop="24px" alignItems="center" w="100%">
          <Heading size="md">{name}</Heading>
          {/* <Text mt="16px">{description}</Text> */}
        </Stack>
      </CardBody>
    </Card>
  );
};

export default MarketCard;
