import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Skeleton } from "../ui/skeleton";
import { AuthContext } from "@/context/AuthContext";

export default function CheckAuth({ children }) {
  const { userState } = useContext(AuthContext);
  const { isAuthenticated, isLoading, user } = userState;
  // console.log(user, isAuthenticated);

  const location = useLocation();

  if (
    location.pathname === "/" ||
    location.pathname === "/shop" ||
    location.pathname === "/admin"
  ) {
    if (!isAuthenticated) {
      return <Navigate to={"/auth/login"} />;
    } else {
      if (user.role === "admin") {
        return <Navigate to={"/admin/dashboard"} />;
      } else {
        return <Navigate to={"/shop/home"} />;
      }
    }
  }
  if (
    !isAuthenticated &&
    !(
      location.pathname.includes("/login") ||
      location.pathname.includes("/register")
    )
  ) {
    return <Navigate to={"/auth/login"} />;
  }

  if (
    isAuthenticated &&
    (location.pathname.includes("login") ||
      location.pathname.includes("register"))
  ) {
    if (user.role === "admin") {
      return <Navigate to={"/admin/dashboard"} />;
    } else {
      return <Navigate to={"/shop/home"} />;
    }
  }

  if (
    isAuthenticated &&
    user?.role !== "admin" &&
    location.pathname.includes("admin")
  ) {
    return <Navigate to={"/unauth-page"} />;
  }

  if (
    isAuthenticated &&
    user?.role === "admin" &&
    location.pathname.includes("shop")
  ) {
    return <Navigate to={"/admin/dashboard"} />;
  }

  return children;
}
