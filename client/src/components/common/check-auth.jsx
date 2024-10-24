import React, { useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Skeleton } from "../ui/skeleton";
import { checkAuth } from "@/store/auth-slice";
import { useDispatch } from "react-redux";

export default function CheckAuth({
  isAuthenticated,
  user,
  children,
  isLoading,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  if (
    location.pathname === "/" ||
    location.pathname === "/shop" ||
    location.pathname === "/admin"
  ) {
    console.log("hiiii");
    if (!isAuthenticated) {
      return <Navigate to={"/auth/login"} />;
    } else {
      if (user.role === "admin") {
        return <Navigate to={"/admin/dashboard"} />;
      } else if (user.role === "user") {
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
