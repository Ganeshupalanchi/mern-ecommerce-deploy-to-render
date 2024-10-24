import { useContext, useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Route, Routes, useNavigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import AuthLayout from "./components/auth/Layout";
import Register from "./pages/auth/Register";
import AdminLayout from "./components/admin-view/Layout";
import AdminDashboard from "./pages/admin-view/dashboard";
import AdminProducts from "./pages/admin-view/products";
import AdminOrders from "./pages/admin-view/order";
import AdminFeatures from "./pages/admin-view/features";
import ShoppingViewlayout from "./components/shopping-view/layout";
import NotFound from "./pages/not-sound";
import ShoppinAccount from "./pages/shopping-view/account";
import ShoppinHome from "./pages/shopping-view/home";
import ShoppinListing from "./pages/shopping-view/listing";
import ShoppingCheckout from "./pages/shopping-view/checkout";
import CheckAuth from "./components/common/check-auth";
import UnauthPage from "./pages/unauth-page";
import axios from "axios";
import { Skeleton } from "./components/ui/skeleton";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "./store/auth-slice";
import ShoppingOrders from "./components/shopping-view/orders";
import PaypalReturnPage from "./pages/shopping-view/paypal-return";
import PaymentSuccessPage from "./pages/shopping-view/payment-success";
import SearchProducts from "./pages/shopping-view/search";
import { AuthContext } from "./context/AuthContext";
// import { checkAuth } from "./store/auth-slice";

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const { checkAuth, initialState } = useContext(AuthContext);

  const initialState = useSelector((state) => state.auth);

  // console.log(initialState);

  useEffect(() => {
    const token = JSON.parse(sessionStorage.getItem("token"));
    dispatch(checkAuth(token)).then((data) => {
      if (data?.payload?.success) {
        navigate(-2);
      }
    });
  }, [dispatch]);

  if (initialState.authLoading) {
    return (
      <div className="flex h-full w-full items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
    );
  }
  return (
    <>
      <div className="flex flex-col overflow-hidden bg-white">
        <Routes>
          <Route
            path="/"
            element={
              <CheckAuth
                isAuthenticated={initialState.isAuthenticated}
                user={initialState.user}
                isLoading={initialState.isLoading}
              >
                <AuthLayout />
              </CheckAuth>
            }
          ></Route>
          <Route
            path="/auth"
            element={
              <CheckAuth
                isAuthenticated={initialState.isAuthenticated}
                user={initialState.user}
                isLoading={initialState.isLoading}
              >
                <AuthLayout />
              </CheckAuth>
            }
          >
            <Route
              path="login"
              element={<Login isLoading={initialState.isLoading} />}
            />
            <Route path="register" element={<Register />} />
          </Route>

          <Route
            path="/admin"
            element={
              <CheckAuth
                isAuthenticated={initialState.isAuthenticated}
                user={initialState.user}
                isLoading={initialState.isLoading}
              >
                <AdminLayout />
              </CheckAuth>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="features" element={<AdminFeatures />} />
          </Route>

          <Route
            path="/shop"
            element={
              <CheckAuth
                isAuthenticated={initialState.isAuthenticated}
                user={initialState.user}
                isLoading={initialState.isLoading}
              >
                <ShoppingViewlayout />
              </CheckAuth>
            }
          >
            <Route path="" element={<ShoppinListing />} />
            <Route path="home" element={<ShoppinHome />} />
            <Route path="listing" element={<ShoppinListing />} />
            <Route path="checkout" element={<ShoppingCheckout />} />
            <Route path="account" element={<ShoppinAccount />} />
            <Route path="orders" element={<ShoppingOrders />} />
            <Route path="paypal-return" element={<PaypalReturnPage />} />
            <Route path="payment-success" element={<PaymentSuccessPage />} />
            <Route path="search" element={<SearchProducts />} />
          </Route>
          <Route path="/*" element={<NotFound />}></Route>
          <Route path="/unauth-page" element={<UnauthPage />}></Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
