import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedLayout = () => {
  const loggedInUser = useSelector((state) => state?.authentication?.userAuth);
  return <>{loggedInUser ? <Outlet /> : <Navigate to="/" />}</>;
};

export default ProtectedLayout;
