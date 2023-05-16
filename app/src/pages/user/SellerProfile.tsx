import React, { useCallback, useState } from "react";
import {
  Text,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Select,
} from "@chakra-ui/react";
import Market from "../market/Market";
import OrderList, { OrderFilter, UserType } from "../order/OrderList";

const SellerProfile = () => {
  const [filterOption, setFilterOption] = useState(OrderFilter.Pending);

  const handleFilterChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.currentTarget.value;

      if (value === "0") setFilterOption(OrderFilter.Pending);
      else if (value == "1") setFilterOption(OrderFilter.Accepted);
      else if (value == "2") setFilterOption(OrderFilter.Confirmed);
      else setFilterOption(OrderFilter.Completed);
    },
    []
  );

  return (
    <Tabs colorScheme={"cyan"} isLazy>
      <TabList
        bg="gray.900"
        borderRadius="0 0 12px 12px"
        px="8"
        py="4"
        color="white"
        borderBottom="0"
      >
        <Tab>
          <Text>Your Orders</Text>
        </Tab>
        <Tab>Market</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <Select onChange={(e) => handleFilterChange(e)}
            bg="gray.800"
          >
            <option value={0} style={{ background: "#1e2021" }}>Pending</option>
            <option value={1} style={{ background: "#1e2021" }}>Accepted</option>
            <option value={2} style={{ background: "#1e2021" }}>Confirmed</option>
            <option value={3} style={{ background: "#1e2021" }}>Completed</option>
          </Select>
          <OrderList type={UserType.Seller} orderFilter={filterOption} />
        </TabPanel>
        <TabPanel>
          <Market />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default SellerProfile;
