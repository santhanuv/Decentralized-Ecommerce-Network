import { useLocation } from "react-router-dom";
import BaseProfile from "../../hoc/BaseProfile";
import BuyerProfile from "./BuyerProfile";
import SellerProfile from "./SellerProfile";

const UserProfile = () => {
  const location = useLocation();

  return (
    <BaseProfile>
      {location.pathname === "/profile/seller" ? (
        <SellerProfile />
      ) : location.pathname === "/profile/buyer" ? (
        <BuyerProfile />
      ) : (
        <div>Invalid user type</div>
      )}
    </BaseProfile>
  );
};

export default UserProfile;
