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
import { useUserContext } from "../../context/UserContextProvider";
import OrderList, { OrderFilter, UserType } from "../order/OrderList";

const BuyerProfile = () => {
  const { userData, profileImage, reload, balance } = useUserContext();
  const [filterOption, setFilterOption] = useState(OrderFilter.Pending);

  const handleFilterChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.currentTarget.value;

      if (value === "0") setFilterOption(OrderFilter.Pending);
      else if (value == "1") setFilterOption(OrderFilter.Accepted);
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
      </TabList>
      <TabPanels>
        <TabPanel>
          <Select onChange={(e) => handleFilterChange(e)}>
            <option value={0}>Pending</option>
            <option value={1}>Accepted</option>
            <option value={2}>Completed</option>
          </Select>
          <OrderList
            type={UserType.Buyer}
            orderFilter={filterOption}
            // cancelBtnText="Cancel"
          />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default BuyerProfile;