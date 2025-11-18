import React from "react";

const LocationSearchPanel = ({
  suggestions,
  setPickup,
  setDestination,
  activeField,
  setPickupSuggestions,
  setDestinationSuggestions,
}) => {
  const handleLocationSelect = (location) => {
    if (suggestions === undefined) return;
    if (activeField === "pickup") {
      setPickup(location);
      setPickupSuggestions([]);
    } else if (activeField === "destination") {
      setDestination(location);
      setDestinationSuggestions([]);
    }
  };
  return (
    <div>
      {suggestions?.map((item, i) => (
        <div
          onClick={() => handleLocationSelect(item)}
          key={i}
          className="flex gap-4 border-2 p-3 border-gray-50 active:border-black rounded-xl items-center my-2 justify-start"
        >
          <div className="bg-[#eee] h-8 flex items-center justify-center w-12 rounded-full">
            <i className="ri-map-pin-fill"></i>
          </div>
          <h4 className="font-medium">{item}</h4>
        </div>
      ))}
    </div>
  );
};

export default LocationSearchPanel;
