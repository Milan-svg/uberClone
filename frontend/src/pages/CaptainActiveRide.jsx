import React, { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
} from "react-leaflet";
import L, { map } from "leaflet";
import "leaflet/dist/leaflet.css";
import { Link, useLocation, useNavigate } from "react-router";
import RideComplete from "../components/RideComplete";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useSocket } from "../context/SocketContext";
import { useRide } from "../context/RideContext";
import { useCaptain } from "../context/CaptainContext";

const CaptainActiveRide = () => {
  const [completeRidePanel, setCompleteRidePanel] = useState(false);
  const completeRidePanelRef = useRef(null);
  const [roadRoute, setRoadRoute] = useState([]);
  const [captainLocation, setCaptainLocation] = useState(null);
  const { captain } = useCaptain();
  const { socket } = useSocket();
  const mapRef = useRef();
  const navigate = useNavigate();

  const { currentRide: ride, syncRideState } = useRide();
  const hasPickup =
    ride?.pickupCoordinates &&
    Number.isFinite(ride.pickupCoordinates.ltd) &&
    Number.isFinite(ride.pickupCoordinates.lng);
  const hasDestination =
    ride?.destinationCoordinates &&
    Number.isFinite(ride.destinationCoordinates.ltd) &&
    Number.isFinite(ride.destinationCoordinates.lng);
  const fallbackCenter = [
    ride?.pickupCoordinates?.ltd ?? 28.6,
    ride?.pickupCoordinates?.lng ?? 77.2,
  ];

  useEffect(() => {
    if (!socket || !captain) return;
    //location updte function
    const updateLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const locationData = {
            ltd: position.coords.latitude,
            lng: position.coords.longitude,
          };

          socket.emit("update-captain-location", {
            userId: captain._id,
            location: locationData,
          });
          //console.log("LOCATION DATA SENT");
          setCaptainLocation(locationData);
          const map = mapRef.current;
          if (map) {
            map.setView([locationData.ltd, locationData.lng], 16, {
              animate: true,
            });
          }
        });
      }
    };

    updateLocation();
    const IntervalId = setInterval(updateLocation, 6000);

    return () => {
      clearInterval(IntervalId);
    };
  }, [captain, socket]);

  useEffect(() => {
    const checkRide = async () => {
      const ride = await syncRideState();
      //console.log("CHECKED RIDE: ", ride);
      if (!ride) {
        navigate("/captain-home");
      }
    };
    checkRide();
  }, []);

  useEffect(() => {
    if (hasPickup && hasDestination) {
      getRoute(ride.pickupCoordinates, ride.destinationCoordinates).then(
        (route) => setRoadRoute(route),
      );
    }
  }, [ride]);
  useGSAP(
    function () {
      gsap.to(completeRidePanelRef.current, {
        transform: completeRidePanel ? "translateY(0%)" : "translateY(100%)",
        ease: "power2.out",
        duration: 0.5,
      });
    },
    [completeRidePanel],
  );

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
              icon={emojiIcon("📍")}
            >
              <Popup>Pickup Location</Popup>
            </Marker>
          )}

          {/*Captain live location */}
          {captainLocation && (
            <Marker
              position={[captainLocation.ltd, captainLocation.lng]}
              icon={emojiIcon("🚗")}
            >
              <Popup>You</Popup>
            </Marker>
          )}

          {/* Destination */}
          {hasDestination && (
            <Marker
              position={[
                ride.destinationCoordinates.ltd,
                ride.destinationCoordinates.lng,
              ]}
              icon={emojiIcon("🏁")}
            >
              <Popup>🏁 Destination</Popup>
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

          {/* pickup to destination polyline */}
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

      <div
        className="absolute bottom-0 w-full bg-white z-10 shadow-2xl rounded-xl p-4"
        onClick={() => {
          setCompleteRidePanel(true);
        }}
      >
        <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-2"></div>

        <div className="flex items-center justify-between ">
          <div className="flex flex-col leading-tight">
            <span className="text-md text-gray-500">Ride status</span>
            <span className="text-xl font-semibold text-gray-900">
              Underway 🚗
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
              Active
            </span>

            <button className="bg-green-600 hover:bg-green-700 active:scale-[0.97] transition-all text-white text-lg font-bold px-4 py-2 rounded-lg">
              Complete
            </button>
          </div>
        </div>
      </div>

      <div
        ref={completeRidePanelRef}
        className="absolute w-full z-10 bottom-0 translate-y-full bg-white px-3"
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
