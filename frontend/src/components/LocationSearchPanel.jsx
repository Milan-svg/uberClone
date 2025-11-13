import React from "react";

const LocationSearchPanel = ({ setVehiclePanelOpen, setPanelOpen }) => {
  const locations = [
    "Location 1",
    "Location 2",
    "Location 3",
    "Location 4",
    "Location 5",
  ];
  return (
    <div>
      {locations?.map((item, i) => (
        <div
          onClick={() => {
            setVehiclePanelOpen(true);
            setPanelOpen(false);
          }}
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
