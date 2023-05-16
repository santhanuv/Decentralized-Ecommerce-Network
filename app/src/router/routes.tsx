import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/home/Home";
import UserProfile from "../pages/user/UserProfile";
import ErrorPage from "../pages/errors/ErrorPage";
import PrivateRoutes from "../pages/PrivateRoutes";
import TopBarLayout from "../components/layout/TopBarLayout";
import CreateProduct from "../pages/products/CreateProduct";
import Buy from "../pages/products/Buy";
import Product from "../pages/products/Product";
import CreateUser from "../pages/user/CreateUser";
import CreateMarket from "../pages/market/CreateMarket";
import MarketDetails from "../pages/market/MarketDetails";
import EditProduct from "../pages/products/EditProduct";
import UpdateMarket from "../pages/market/UpdateMarket";
import MyAccount from "../pages/user/MyAccount";
import CartPage from "../pages/user/CartPage";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <TopBarLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "buy",
        element: <Buy />,
      },
      {
        path: "buy/:productID",
        element: <Product />,
      },
      {
        element: <PrivateRoutes />,
        children: [
          {
            path: "/myaccount",
            element: <MyAccount />,
          },
          {
            path: "/carts",
            element: <CartPage />,
          },
          {
            path: "profile/seller",
            element: <UserProfile />,
          },
          {
            path: "profile/buyer",
            element: <UserProfile />,
          },
          {
            path: "create-user",
            element: <CreateUser />,
          },
          {
            path: "/market/:marketID/create-product",
            element: <CreateProduct />,
          },
          {
            path: "/market/update/:marketID",
            element: <UpdateMarket />,
          },
          {
            path: "/market/:marketID/product/:productID",
            element: <EditProduct />,
          },
          {
            path: "create-market",
            element: <CreateMarket />,
          },
          {
            path: "market/:marketID",
            element: <MarketDetails />,
          },
        ],
      },
    ],
  },
]);

export default routes;
