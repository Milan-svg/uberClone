import React, { useEffect } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate, Outlet, Navigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useCaptain } from "../context/CaptainContext";
const ProtectedRoute = () => {
  const { user, isLoading: isUserLoading } = useUser();
  const { captain, isLoading: isCaptainLoading } = useCaptain();
  const navigate = useNavigate();
  const location = useLocation();
  //console.log("CONTEXT USER AND CAPTAIN: ", user, captain);
  if (isUserLoading || isCaptainLoading) {
    return (
      <div className=" h-screen w-full flex justify-center items-center">
        Loading...
      </div>
    );
  }
  const userRoutes = ["/home", "/riding"];
  const captainRoutes = ["/captain-home", "/captain-riding"];
  const needsUser = userRoutes.some((route) =>
    location.pathname.startsWith(route)
  );
  //console.log("NEEDS USER: ", needsUser);
  const needsCaptain = captainRoutes.some((route) =>
    location.pathname.startsWith(route)
  );
  //console.log(location);

  if (needsUser) {
    if (!user) {
      return <Navigate to="/login" replace />;
    }
  }
  if (needsCaptain) {
    if (!captain) {
      return <Navigate to="/captain-login" replace />;
    }
  }
  return <Outlet />;
};

export default ProtectedRoute;
