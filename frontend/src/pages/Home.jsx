import React, { act, useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import axios from "axios";
import toast from "react-hot-toast";
import "remixicon/fonts/remixicon.css";
import { panelAnimate } from "../utils/utils.js";
import { useNavigate } from "react-router-dom";
import LocationSearchPanel from "../components/LocationSearchPanel";
import VehiclePanel from "../components/VehiclePanel";
import RideConfirm from "../components/RideConfirm";
import LookingForCaptain from "../components/LookingForCaptain";
import WaitingForCaptain from "../components/WaitingForCaptain";
import api from "../utils/axiosInstance.js";
import { useUser } from "../context/UserContext.jsx";
const Home = () => {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [vehiclePanelOpen, setVehiclePanelOpen] = useState(false);
  const [rideConfirmPanelOpen, setRideConfirmPanelOpen] = useState(false);
  const [isLookingForCaptain, setIsLookingForCaptain] = useState(false);
  const [isWaitingForCaptain, setIsWaitingForCaptain] = useState(false);
  const [pickupSuggestions, setPickupSuggestions] = useState(null);
  const [destinationSuggestions, setDestinationSuggestions] = useState(null);
  const [activeField, setActiveField] = useState(null);
  const [fare, setFare] = useState(null);
  const [vehicleType, setVehicleType] = useState(null);
  const pickupInputRef = useRef(null);
  const destinationInputRef = useRef(null);
  const debounceTimer = useRef(null);
  const rideConfirmPanelRef = useRef(null);
  const panelRef = useRef(null);
  const panelCloseRef = useRef(null);
  const vehiclePanelRef = useRef(null);
  const LookingForCaptainRef = useRef(null);
  const waitingForCaptainRef = useRef(null);

  const navigate = useNavigate();
  const { user } = useUser();
  // if (user) {
  //   console.log("current user: ", user);
  // } else {
  //   console.log("no user logged in");
  // }
  const submitHandler = (e) => {
    e.preventDefault();
  };

  const handlePickupChang = async (e) => {
    setPickup(e.target.value);
    if (e.target.value.length < 3) {
      setPickupSuggestions(null);
      return;
    }
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(async () => {
      const url = `${
        import.meta.env.VITE_BASE_URL
      }/map/get-autocomplete-suggestions`;
      //console.log("CALLING URL: ", url);
      try {
        const res = await axios.get(url, {
          params: { input: e.target.value },
        });

        setPickupSuggestions(res.data.data);
        //console.log(res);
      } catch (error) {
        console.log(error);
      }
    }, 500);
  };

  const handleDestinationChange = async (e) => {
    setDestination(e.target.value);
    if (e.target.value.length < 3) {
      setDestinationSuggestions(null);
      return;
    }
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(async () => {
      const url = `${
        import.meta.env.VITE_BASE_URL
      }/map/get-autocomplete-suggestions`;
      //console.log("CALLING URL: ", url);
      try {
        const res = await axios.get(url, {
          params: { input: e.target.value },
        });

        setDestinationSuggestions(res.data.data);
        //console.log(res);
      } catch (error) {
        console.log(error);
      }
    }, 500);
  };
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);
  const handleFindTrip = async () => {
    if (!pickup || !destination) {
      toast.error("pickup and destination are required");
      return;
    }
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/rides/get-fare`,
        {
          params: { pickup: pickup, destination: destination },
        }
      );
      if (res.data.statusCode === 200) {
        //console.log("FARE RESPONSE: ", res);
        setFare(res.data.data);
        setPickupSuggestions(null);
        setDestinationSuggestions(null);
        setPanelOpen(false);
        setVehiclePanelOpen(true);
      }
    } catch (error) {
      console.log("FIND TRIP ERROR: ", error);
    }
  };

  const handleCreateRide = async () => {
    if (!pickup || !destination || !vehicleType) {
      console.error("pickup, destination and vehicleType are required");
      return;
    }
    try {
      const res = await api.post(`/rides/create-ride`, {
        pickup,
        destination,
        vehicleType,
      });
      console.log("CREATE RIDE RESPONSE: ", res);
    } catch (error) {
      console.error("CREATE RIDE ERROR: ", error);
    }
  };
  //Animations
  useGSAP(
    function () {
      if (panelOpen) {
        gsap.to(panelRef.current, {
          height: "70%",
          padding: 24,
          ease: "power2.out",
          // opacity:1
        });
        gsap.to(panelCloseRef.current, {
          opacity: 1,
        });
      } else {
        gsap.to(panelRef.current, {
          height: "0%",
          padding: 0,
          ease: "power2.in",
          // opacity:0
        });
        gsap.to(panelCloseRef.current, {
          opacity: 0,
        });
      }
    },
    [panelOpen]
  );
  panelAnimate(vehiclePanelRef, vehiclePanelOpen);

  panelAnimate(rideConfirmPanelRef, rideConfirmPanelOpen);

  panelAnimate(LookingForCaptainRef, isLookingForCaptain);

  panelAnimate(waitingForCaptainRef, isWaitingForCaptain);

  return (
    <div className="h-screen relative overflow-hidden">
      <img
        className="w-16 absolute left-5 top-5"
        src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
        alt=""
      />

      <div className="h-full w-full">
        <img
          className="h-full w-full object-cover"
          src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
          alt="Map"
        />
      </div>

      {/* Location search panels */}
      <div className=" flex flex-col justify-end h-screen absolute top-0 w-full">
        <div className="h-[30%] p-6 bg-white relative">
          <h5
            ref={panelCloseRef}
            onClick={() => {
              setPanelOpen(false);
            }}
            className="absolute opacity-0 right-6 top-6 text-2xl"
          >
            <i className="ri-arrow-down-wide-line"></i>
          </h5>
          <h4 className="text-2xl font-semibold">Find a trip</h4>
          <form
            className="relative py-3"
            onSubmit={(e) => {
              submitHandler(e);
            }}
          >
            <div className="line absolute h-16 w-1 top-[50%] -translate-y-1/2 left-5 bg-gray-700 rounded-full"></div>
            <input
              onClick={() => {
                setPanelOpen(true);
                setActiveField("pickup");
              }}
              onFocus={() => setActiveField("pickup")}
              value={pickup}
              ref={pickupInputRef}
              onChange={handlePickupChang}
              className="bg-[#eee] px-12 py-2 text-lg rounded-lg w-full"
              type="text"
              placeholder="Add a pick-up location"
            />
            <input
              onClick={() => {
                setPanelOpen(true);
                setActiveField("destination");
              }}
              onFocus={() => setActiveField("destination")}
              ref={destinationInputRef}
              value={destination}
              onChange={handleDestinationChange}
              className="bg-[#eee] px-12 py-2 text-lg rounded-lg w-full  mt-3"
              type="text"
              placeholder="Enter your destination"
            />
          </form>
          <button
            className="bg-black text-white px-4 py-2 rounded-lg mt-3 w-full"
            onClick={handleFindTrip}
          >
            Find Trip
          </button>
        </div>
        <div ref={panelRef} className="bg-white h-0">
          <LocationSearchPanel
            suggestions={
              activeField === "pickup"
                ? pickupSuggestions
                : destinationSuggestions
            }
            activeField={activeField}
            setPickup={setPickup}
            setDestination={setDestination}
            setPickupSuggestions={setPickupSuggestions}
            setDestinationSuggestions={setDestinationSuggestions}
          />
        </div>
      </div>
      {/* Vehicle Panel */}
      <div
        ref={vehiclePanelRef}
        className="absolute z-10 bottom-0 bg-white w-full p-6"
      >
        <VehiclePanel
          setRideConfirmPanelOpen={setRideConfirmPanelOpen}
          setVehiclePanelOpen={setVehiclePanelOpen}
          fare={fare}
          setVehicleType={setVehicleType}
        />
      </div>
      {/* Ride Search Panel */}
      <div
        ref={rideConfirmPanelRef}
        className="absolute z-10 bottom-0 bg-white w-full p-6"
      >
        <RideConfirm
          setIsLookingForCaptain={setIsLookingForCaptain}
          setRideConfirmPanelOpen={setRideConfirmPanelOpen}
          vehicleType={vehicleType}
          pickup={pickup}
          destination={destination}
          fare={fare}
          handleCreateRide={handleCreateRide}
        />
      </div>
      {/* Searching for a ride */}
      <div
        ref={LookingForCaptainRef}
        className="absolute z-10 bottom-0 bg-white w-full p-6"
      >
        <LookingForCaptain setIsLookingForCaptain={setIsLookingForCaptain} />
      </div>
      {/* Waiting for captain */}
      <div
        ref={waitingForCaptainRef}
        className="absolute z-10 bottom-0 bg-white w-full p-6"
      >
        <WaitingForCaptain setIsWaitingForCaptain={setIsWaitingForCaptain} />
      </div>
    </div>
  );
};

export default Home;
