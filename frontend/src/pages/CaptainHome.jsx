import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Link, useNavigate } from "react-router";
import RidePopup from "../components/RidePopup";
import CaptainDetails from "../components/CaptainDetails";
import CaptainRideConfirmPanel from "../components/CaptainRideConfirmPanel";
import { useCaptain } from "../context/CaptainContext";
import api from "../utils/axiosInstance";
import { useSocket } from "../context/SocketContext";
import { useRide } from "../context/RideContext";

const CaptainHome = () => {
  const [ridePopupPanel, setRidePopupPanel] = useState(false);
  const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false);
  const ridePopupPanelRef = useRef(null);
  const confirmRidePopupPanelRef = useRef(null);
  const { captain } = useCaptain();
  const [pendingRideFromSocket, setPendingRideFromSocket] = useState(null);
  const navigate = useNavigate();
  //console.log("CPATAIN CONTEXT: ", captain);
  const { socket } = useSocket();
  const {
    currentRide: ride,
    rideStatus,
    isSyncing,
    userType,
    syncRideState,
  } = useRide();
  useEffect(() => {
    if (!socket || !captain) return;
    //emit join event on mount
    socket.emit("join", { userId: captain._id, userType: "captain" });
    //location updte function
    const updateLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          socket.emit("update-captain-location", {
            userId: captain._id,
            location: {
              ltd: position.coords.latitude,
              lng: position.coords.longitude,
            },
          });
          console.log("LOCATION DATA TO SEND", {
            userId: captain._id,
            location: {
              ltd: position.coords.latitude,
              lng: position.coords.longitude,
            },
          });
        });
      }
    };

    updateLocation();
    const IntervalId = setInterval(updateLocation, 2000000);

    const handleNewRide = async (data) => {
      console.log("NEW RIDE:", data);
      setPendingRideFromSocket(data);
      setRidePopupPanel(true);
    };
    socket.on("new-ride", handleNewRide);
    return () => {
      socket.off("new-ride", handleNewRide);
      clearInterval(IntervalId);
    };
  }, [captain]);

  useEffect(() => {
    if (ride && ["accepted", "ongoing"].includes(ride.status)) {
      // ride is confirmed, captain is assigned
      setRidePopupPanel(false);
      setConfirmRidePopupPanel(true);
      setPendingRideFromSocket(null);
    } else if (!ride) {
      // no active rides
      setRidePopupPanel(false);
      setConfirmRidePopupPanel(false);
      setPendingRideFromSocket(null);
    }
  }, [ride]);

  useGSAP(
    function () {
      gsap.to(ridePopupPanelRef.current, {
        transform: ridePopupPanel ? "translateY(0%)" : "translateY(100%)",
        ease: "power2.out",
        duration: 0.5,
      });
    },
    [ridePopupPanel]
  );
  useGSAP(
    function () {
      gsap.to(confirmRidePopupPanelRef.current, {
        transform: confirmRidePopupPanel
          ? "translateY(0%)"
          : "translateY(100%)",
        ease: "power2.out",
        duration: 0.5,
      });
    },
    [confirmRidePopupPanel]
  );
  const handleLogout = async () => {
    try {
      const res = await api.get("/captains/logout");
      if (res.status === 200) {
        navigate("/");
      }
    } catch (err) {
      console.error("CAPTAIN LOGOUT ERROR: ", err);
    }
  };
  const handleConfirmRide = async () => {
    try {
      const res = await api.post("/rides/confirm", {
        rideId: pendingRideFromSocket._id,
      });
      if (res.status === 200) {
        console.log("RIDE CONFIRMED");
        await syncRideState();
        setConfirmRidePopupPanel(true);
        setRidePopupPanel(false);
        setPendingRideFromSocket(null);
      }
    } catch (error) {
      console.error("ERROR AT handleConfirmRide", error);
    }
  };
  return (
    <div className="h-screen relative overflow-hidden">
      <div className="absolute p-6 top-0 flex items-center justify-between w-full">
        <img
          className="w-16"
          src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
          alt=""
        />
        <button
          className=" h-10 w-10 bg-white flex items-center justify-center rounded-full"
          onClick={handleLogout}
        >
          <i className="text-lg font-medium ri-logout-box-r-line"></i>
        </button>
      </div>
      <div className="h-3/5">
        <img
          className="h-full w-full object-cover"
          src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
          alt=""
        />
      </div>
      <div className="h-2/5 p-6">
        <CaptainDetails captain={captain} />
      </div>
      <div
        ref={ridePopupPanelRef}
        className="absolute w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12"
      >
        <RidePopup
          setConfirmRidePopupPanel={setConfirmRidePopupPanel}
          setRidePopupPanel={setRidePopupPanel}
          ride={pendingRideFromSocket}
          handleConfirmRide={handleConfirmRide}
        />
      </div>
      <div
        ref={confirmRidePopupPanelRef}
        className="absolute w-full h-screen z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12"
      >
        <CaptainRideConfirmPanel
          setConfirmRidePopupPanel={setConfirmRidePopupPanel}
          setRidePopupPanel={setRidePopupPanel}
          ride={ride}
        />
      </div>
    </div>
  );
};

export default CaptainHome;
