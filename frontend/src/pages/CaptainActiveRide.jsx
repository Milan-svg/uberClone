import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import RideComplete from "../components/RideComplete";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useSocket } from "../context/SocketContext";
import { useRide } from "../context/RideContext";
import { useCaptain } from "../context/CaptainContext";

const CaptainActiveRide = () => {
  const [completeRidePanel, setCompleteRidePanel] = useState(false);
  const completeRidePanelRef = useRef(null);
  const { captain } = useCaptain();
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
    const IntervalId = setInterval(updateLocation, 20000);

    return () => {
      clearInterval(IntervalId);
    };
  }, [captain, socket]);
  useGSAP(
    function () {
      gsap.to(completeRidePanelRef.current, {
        transform: completeRidePanel ? "translateY(0%)" : "translateY(100%)",
        ease: "power2.out",
        duration: 0.5,
      });
    },
    [completeRidePanel]
  );

  return (
    <div className="h-screen relative">
      <div className="absolute w-full p-6 top-0 flex items-center justify-between z-10 ">
        <img
          className="w-16"
          src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
          alt=""
        />
        <Link
          to="/captain-home"
          className=" h-10 w-10 bg-white flex items-center justify-center rounded-full"
        >
          <i className="text-lg font-medium ri-logout-box-r-line"></i>
        </Link>
      </div>
      <div className="h-full w-full">
        <img
          className="h-full w-full object-cover"
          src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
          alt="Map"
        />
      </div>

      <div
        className="absolute bottom-0 w-full h-1/5 bg-yellow-300 "
        onClick={() => {
          setCompleteRidePanel(true);
        }}
      >
        <h5
          className="p-1 text-center w-full absolute top-0 "
          onClick={() => {}}
        >
          <i className="text-3xl   text-gray-800 ri-arrow-up-wide-line"></i>
        </h5>
        <div className="flex items-center justify-between w-full h-full p-4">
          <h4 className="text-2xl font-semibold">4 KM away</h4>
          <button className=" bg-green-600 text-white text-2xl font-semibold p-3 px-10 rounded-lg">
            Complete Ride
          </button>
        </div>
      </div>
      <div
        ref={completeRidePanelRef}
        className="absolute w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12"
      >
        <RideComplete
          ride={ride}
          setCompleteRidePanel={setCompleteRidePanel}
          syncRideState={syncRideState}
        />
      </div>
    </div>
  );
};

export default CaptainActiveRide;
