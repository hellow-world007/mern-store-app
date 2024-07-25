import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Users from "./user/pages/Users";
import NewPlace from "./places/pages/NewPlace";
import UserPlaces from "./places/pages/UserPlaces";
import UpdatePlace from "./places/pages/UpdatePlace";
import Auth from "./user/pages/Auth";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import { AuthContext } from "./shared/context/auth-context";
import AuthRequired from "./user/pages/AuthRequired";
import ProductDetails from "./places/pages/ProductDetails";
import ManageProducts from "./places/pages/ManageProducts";
import ProductBrand from "./places/pages/ProductBrand";
import { useAuth } from "./shared/hooks/auth-hook";

import HomePage from "./shared/components/UIElements/HomePage";
import Shop from "./places/pages/Shop";
import UserDashboardLayout from "./user/pages/UserDashboardLayout";
import AdminDashBoardLayout from "./user/pages/AdminDashBoardLayout";
import AccountDetails from "./user/components/dashboard/AccountDetails";
import Address from "./user/components/dashboard/Address";
import Order from "./user/components/dashboard/Order";
import Wishlist from "./user/components/dashboard/Wishlist";
import Support from "./user/components/dashboard/Support";
import OrderDetails from "./user/components/dashboard/OrderDetails";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainNavigation />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/shop",
        element: <Shop />,
        children: [
          {
            path: "/shop/brands/:brand_name",
            element: <Shop />,
          },
          {
            path: "/shop/category/:cat_name",
            element: <Shop />,
          },
        ],
      },
      {
        path: "/brands",
        element: <ProductBrand />,
      },
      {
        path: "/products/:pid",
        element: <ProductDetails />,
      },
      {
        element: <AuthRequired />,
        children: [
          {
            path: "/admin-dashboard",
            element: <AdminDashBoardLayout />,
            children: [
              {
                path: "/admin-dashboard",
                element: <Users />,
              },
              {
                path: "/admin-dashboard/:userId/products",
                element: <UserPlaces />,
              },
              {
                path: "/admin-dashboard/upload-product",
                element: <NewPlace />,
              },
              {
                path: "/admin-dashboard/places/:placeId",
                element: <UpdatePlace />,
              },
              {
                path: "/admin-dashboard/manage-product",
                element: <ManageProducts />,
              },
            ],
          },
          {
            path: "/user-dashboard/:userId",
            element: <UserDashboardLayout />,
            children: [
              {
                path: "/user-dashboard/:userId",
                element: <AccountDetails />,
              },
              {
                path: "/user-dashboard/:userId/address",
                element: <Address />,
              },
              {
                path: "/user-dashboard/:userId/orders",
                element: <Order />,
              },
              {
                path: "/user-dashboard/:userId/wishlist",
                element: <Wishlist />,
              },
              {
                path: "/user-dashboard/:userId/support",
                element: <Support />,
              },
            ],
          },
          {
            path: "/orders/:orderId",
            element: <OrderDetails />,
          },
        ],
      },
      {
        path: "/auth",
        element: <Auth />,
      },
    ],
  },
]);

function App() {
  const { token, login, logout, userId, userType } = useAuth();

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout,
        userType: userType,
      }}
    >
      <RouterProvider router={router} />
    </AuthContext.Provider>
  );
}

export default App;
