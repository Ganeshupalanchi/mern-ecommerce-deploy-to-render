import React from "react";
import { Link } from "react-router-dom";

export default function UnauthPage() {
  return (
    <>
      <h1>You don't have access to view this page.</h1>
      <Link to={"/shop/home"}>Go to home </Link>
    </>
  );
}
