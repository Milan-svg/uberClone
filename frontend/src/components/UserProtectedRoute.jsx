import React from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router";
const UserProtectedRoute = ({ children }) => {
  const { user } = useUser();
  const navigate = useNavigate();
  if (!user.email) {
    navigate("/login");
  }
  return <>{children}</>;
};

export default UserProtectedRoute;
