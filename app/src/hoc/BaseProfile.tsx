import { ReactElement } from "react";
import { UserContextProvider } from "../context/UserContextProvider";
import UserTab from "../components/layout/UserTab";

const BaseProfile = ({ children }: { children: ReactElement }) => {
  return (
    <UserContextProvider>
      <UserTab />
      {children}
    </UserContextProvider>
  );
};

export default BaseProfile;
