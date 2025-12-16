import React from "react";

const Map = () => {
  return (
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
          position={[ride.pickupCoordinates.ltd, ride.pickupCoordinates.lng]}
          icon={emojiIcon("📍")}
        >
          <Popup>Pickup Location</Popup>
        </Marker>
      )}

      {/* 2. User live location */}
      {/* {
                <Marker position={[28.5, 77.3]}>
                  <Popup>You are here</Popup>
                </Marker>
              } */}

      {/*Captain live location */}
      {captainLocation && (
        <Marker
          position={[captainLocation.ltd, captainLocation.lng]}
          icon={emojiIcon("🚗")}
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
  );
};

export default Map;
