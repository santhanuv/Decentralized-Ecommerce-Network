import { Box, Checkbox, Divider, VStack, Heading } from "@chakra-ui/react";

function Filter({}) {
  return (
    <Box
      border="1px solid"
      borderColor="darkMode.white"
      padding="30px"
      minWidth="300px"
    >
      <Heading fontSize="24px" margin="8px 0">
        Filters
      </Heading>

      <Divider
        margin="16px 0"
        bg="white"
        size="200px"
        orientation="horizontal"
        height="1px"
      />

      <Box>
        <Heading fontSize="18px" margin="16px 0">
          Category
        </Heading>

        <VStack spacing={"16px"} alignItems="start" defaultChecked>
          <Checkbox size="md" colorScheme="green">
            Male
          </Checkbox>
          <Checkbox size="md" colorScheme="green" defaultChecked>
            Female
          </Checkbox>
          <Checkbox size="md" colorScheme="green" defaultChecked>
            Kids
          </Checkbox>
        </VStack>
      </Box>

      <Divider
        margin="16px 0"
        bg="white"
        size="200px"
        orientation="horizontal"
        height="1px"
      />

      <Box>
        <Heading fontSize="18px" margin="16px 0">
          Condition
        </Heading>

        <VStack spacing={"16px"} alignItems="start">
          <Checkbox size="md" colorScheme="green" defaultChecked>
            New
          </Checkbox>
          <Checkbox size="md" colorScheme="green">
            Refurbished
          </Checkbox>
          <Checkbox size="md" colorScheme="green">
            Used
          </Checkbox>
        </VStack>
      </Box>

      <Divider
        margin="16px 0"
        bg="white"
        size="200px"
        orientation="horizontal"
        height="1px"
      />

      <Box>
        <Heading fontSize="18px" margin="16px 0">
          Type
        </Heading>

        <VStack spacing={"16px"} alignItems="start">
          <Checkbox size="md" colorScheme="green" defaultChecked>
            Fashion
          </Checkbox>
          <Checkbox size="md" colorScheme="green">
            Electronic Gadgets
          </Checkbox>
          <Checkbox size="md" colorScheme="green">
            Kitchen Utensils
          </Checkbox>
          <Checkbox size="md" colorScheme="green">
            Digital Goods
          </Checkbox>
        </VStack>
      </Box>
    </Box>
  );
}

export default Filter;
