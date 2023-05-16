import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/home/Home";
import UserProfile from "../pages/user/UserProfile";
import ErrorPage from "../pages/errors/ErrorPage";
import PrivateRoutes from "../pages/PrivateRoutes";
import TopBarLayout from "../components/layout/TopBarLayout";
import CreateProduct from "../pages/products/CreateProduct";
import Buy from "../pages/products/Buy";
import Product from "../pages/products/Product";

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
            path: "profile",
            element: <UserProfile />,
          },
          {
            path: "create-product",
            element: <CreateProduct />,
          },
        ],
      },
    ],
  },
]);

export default routes;
