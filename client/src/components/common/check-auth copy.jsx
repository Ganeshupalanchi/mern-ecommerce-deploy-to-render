import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Skeleton } from "../ui/skeleton";

export default function CheckAuth({
  isAuthenticated,
  user,
  children,
  isLoading,
}) {
  console.log(user);

  const location = useLocation();
  // console.log(isLoading);
  // if (isLoading) {
  //   console.log("Hiiiii");
  //   return (
  //     <div className="flex h-full w-full items-center space-x-4">
  //       <Skeleton className="h-12 w-12 rounded-full" />
  //     </div>
  //   );
  // }
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
