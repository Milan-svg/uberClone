import React from "react";

const VehiclePanel = ({
  setVehiclePanelOpen,
  setRideConfirmPanelOpen,
  fare,
  setVehicleType,
}) => {
  return (
    <div>
      <h5
        onClick={() => setVehiclePanelOpen(false)}
        className="absolute text-center  w-[90%] top-0 p-1"
      >
        <i className="text-3xl text-gray-500 ri-arrow-down-wide-line"></i>
      </h5>
      <h3 className="text-2xl font-semibold mb-5">Choose a Vehicle</h3>
      <div
        onClick={() => {
          setRideConfirmPanelOpen(true);
          setVehiclePanelOpen(false);
          setVehicleType("car");
        }}
        className="flex border-2 border-black rounded-xl items-center justify-between px-6 py-3 mb-2"
      >
        <img
          className="h-10"
          src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg"
          alt=""
        />

        <div className="ml-2 w-1/2">
          <h4 className="font-medium text-base ">
            UberGo
            <span>
              <i className="ri-user-3-fill"></i>4
            </span>
          </h4>
          <h5 className="font-medium text-sm">2 mins away</h5>
          <p className="font-normal text-xs">Affordable, compact rides</p>
        </div>
        <h2 className="font-semibold text-lg">₹{fare?.car}</h2>
      </div>
      <div
        onClick={() => {
          setRideConfirmPanelOpen(true);
          setVehiclePanelOpen(false);
          setVehicleType("auto");
        }}
        className="flex border-2 border-black rounded-xl items-center justify-between px-6 py-3 mb-2"
      >
        <img
          className="h-10"
          src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg"
          alt=""
        />
        <div className="ml-2 w-1/2">
          <h4 className="font-medium text-base ">
            UberAuto
            <span>
              <i className="ri-user-3-fill"></i>4
            </span>
          </h4>
          <h5 className="font-medium text-sm">2 mins away</h5>
          <p className="font-normal text-xs">Affordable, compact rides</p>
        </div>
        <h2 className="font-semibold text-lg">₹{fare?.auto}</h2>
      </div>
      <div
        onClick={() => {
          setRideConfirmPanelOpen(true);
          setVehiclePanelOpen(false);
          setVehicleType("moto");
        }}
        className="flex border-2 border-black rounded-xl items-center justify-between px-6 py-3 mb-2"
      >
        <img
          className="h-10"
          src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg"
          alt=""
        />

        <div className="ml-2 w-1/2">
          <h4 className="font-medium text-base ">
            UberMoto
            <span>
              <i className="ri-user-3-fill"></i>4
            </span>
          </h4>
          <h5 className="font-medium text-sm">2 mins away</h5>
          <p className="font-normal text-xs">Affordable, compact rides</p>
        </div>
        <h2 className="font-semibold text-lg">₹{fare?.moto}</h2>
      </div>
    </div>
  );
};

export default VehiclePanel;
