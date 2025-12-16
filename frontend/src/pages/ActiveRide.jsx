import React, { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
} from "react-leaflet";
import {
  pickupIcon,
  destinationIcon,
  captainIcon,
  userIcon,
} from "../utils/utils";
import L, { map } from "leaflet";
import "leaflet/dist/leaflet.css";
import { Link, useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketContext";
import { useRide } from "../context/RideContext";

const ActiveRide = () => {
  const navigate = useNavigate();
  const {
    currentRide: ride,
    rideStatus,
    isSyncing,
    userType,
    syncRideState,
  } = useRide();
  const { socket } = useSocket();
  const [captainLocation, setCaptainLocation] = useState(null);
  const [roadRoute, setRoadRoute] = useState([]);
  const [captainToPickupRoute, setCaptainToPickupRoute] = useState([]);

  const mapRef = useRef();
  useEffect(() => {
    if (hasPickup && hasDestination) {
      getRoute(ride.pickupCoordinates, ride.destinationCoordinates).then(
        (route) => setRoadRoute(route)
      );
    }
  }, [ride]);

  useEffect(() => {
    const checkRide = async () => {
      const ride = await syncRideState();
      console.log("CHECKED RIDE: ", ride);
      if (!ride) {
        navigate("/home");
      }
    };
    checkRide();
    const socketRideEnd = async () => {
      console.log("RIDE ENDED SOCKET RECIEVED");
      await syncRideState();
      navigate("/home");
    };
    socket.on("ride-ended", socketRideEnd);

    return () => {
      socket.off("ride-ended", socketRideEnd);
    };
  }, [socket]);

  useEffect(() => {
    if (!socket || !ride?.captain?._id) return;

    const handleLocationUpdate = async (location) => {
      console.log("CAPTIAN LOCATION UPDATE: ", location);

      const newLoc = { ltd: Number(location.ltd), lng: Number(location.lng) };
      setCaptainLocation(newLoc);
      if (hasPickup) {
        const route = await getRoute(newLoc, ride.pickupCoordinates);
        setCaptainToPickupRoute(route);
      }
      // center map on captain
      const map = mapRef.current;
      if (map) {
        map.setView([newLoc.ltd, newLoc.lng], 16, { animate: true });
      }
    };

    socket.on("captain-location-update", handleLocationUpdate);

    return () => {
      socket.off("captain-location-update", handleLocationUpdate);
    };
  }, [socket, ride?.captain?._id]);

  const fallbackCenter = [
    ride?.pickupCoordinates?.ltd ?? 28.6,
    ride?.pickupCoordinates?.lng ?? 77.2,
  ];
  const hasPickup =
    ride?.pickupCoordinates &&
    Number.isFinite(ride.pickupCoordinates.ltd) &&
    Number.isFinite(ride.pickupCoordinates.lng);

  const hasDestination =
    ride?.destinationCoordinates &&
    Number.isFinite(ride.destinationCoordinates.ltd) &&
    Number.isFinite(ride.destinationCoordinates.lng);
  const getRoute = async (start, end) => {
    const url = `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.ltd};${end.lng},${end.ltd}?overview=full&geometries=geojson`;

    const response = await fetch(url);
    const data = await response.json();

    return data.routes[0].geometry.coordinates.map((coord) => [
      coord[1],
      coord[0],
    ]);
  };

  const emojiIcon = (emoji) =>
    L.divIcon({
      html: `<div style="font-size:24px">${emoji}</div>`,
      className: "",
    });

  return (
    <div className="page">
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
      <Link
        to="/home"
        className="absolute z-[1000] right-2 top-2 h-10 w-10 bg-white flex items-center justify-center rounded-full"
      >
        <i className="text-lg font-medium ri-home-5-line"></i>
      </Link>
      <div className="absolute inset-0 z-0">
        <MapContainer
          center={fallbackCenter}
          zoom={15}
          ref={mapRef}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />

          {/* 1. Pickup point (start) */}
          {hasPickup && (
            <Marker
              position={[
                ride.pickupCoordinates.ltd,
                ride.pickupCoordinates.lng,
              ]}
              icon={pickupIcon}
            >
              <Popup>Pickup</Popup>
            </Marker>
          )}

          {/*Captain live location */}
          {captainLocation && (
            <Marker
              position={[captainLocation.ltd, captainLocation.lng]}
              icon={captainIcon}
            >
              <Popup>Captain</Popup>
            </Marker>
          )}

          {/* Destination */}
          {hasDestination && (
            <Marker
              position={[
                ride.destinationCoordinates.ltd,
                ride.destinationCoordinates.lng,
              ]}
              icon={destinationIcon}
            >
              <Popup>Destination</Popup>
            </Marker>
          )}

          {/* captain live location to pickup location polyline*/}
          {/* {captainToPickupRoute.length > 0 && (
            <Polyline
              positions={captainToPickupRoute}
              color="#000000"
              weight={3}
              dashArray="5, 5"
              opacity={0.7}
            />
          )} */}

          {/* pickup to destination route */}
          {ride?.pickupCoordinates && ride?.destinationCoordinates && (
            <Polyline
              positions={roadRoute}
              lineCap="round"
              lineJoin="round"
              color="#008000"
              weight={6}
            />
          )}
        </MapContainer>
      </div>
      <div className="absolute bottom-0 w-full bg-white h-[33%] z-10 p-4 my-4 shadow-2xl rounded-xl">
        <div className="flex items-center justify-between">
          <img
            className="h-24"
            src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg"
            alt=""
          />
          <div className="text-right space-y-2">
            <h2 className="text-xl font-bold capitalize">
              {ride?.captain.fullname.firstname}
            </h2>
            <h4 className="text-xl font-semibold -mt-1 -mb-1">
              {ride?.captain.vehicle.plate}
            </h4>
            <p className="text-md text-gray-600">Maruti Suzuki Alto</p>
          </div>
        </div>

        <div className="flex gap-2 justify-between flex-col items-center">
          <div className="w-full mt-5">
            <div className="flex items-center gap-5 p-3 border-b-2">
              <i className="text-lg ri-map-pin-2-fill"></i>
              <div>
                <h3 className="text-lg font-medium">{ride?.destination}</h3>
              </div>
            </div>
            <div className="flex items-center gap-5 p-3">
              <i className="ri-currency-line"></i>
              <div>
                <h3 className="text-lg font-medium">₹{ride?.fare} </h3>
                <p className="text-sm -mt-1 text-gray-600">Cash</p>
              </div>
            </div>
          </div>
        </div>
        <button className="w-full mt-5 bg-green-700 text-white font-semibold p-2 rounded-lg">
          Make Payment
        </button>
      </div>
    </div>
  );
};

export default ActiveRide;
