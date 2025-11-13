import React from "react";

const RideConfirm = ({ setIsLookingForCaptain, setRideConfirmPanelOpen }) => {
  return (
    <div>
      <h5
        className="p-1 text-center w-[93%] absolute top-0"
        onClick={() => {
          setRideConfirmPanelOpen(false);
        }}
      >
        <i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
      </h5>
      <h3 className="text-2xl font-semibold mb-5">Confirm Ride</h3>
      <img
        className="h-20 w-40 mx-auto mb-6"
        src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg"
        alt=""
      />
      <div className="flex items-center gap-5 p-3 border-b-2 ">
        <i className="ri-map-pin-user-fill text-2xl"></i>
        <div>
          <h3 className="text-lg font-bold">562/11-A</h3>
          <p className="text-sm -mt-1 text-gray-600">location</p>
        </div>
      </div>
      <div className="flex items-center gap-5 p-3 border-b-2 ">
        <i className="ri-map-pin-user-fill text-2xl"></i>
        <div>
          <h3 className="text-lg font-bold">562/11-A</h3>
          <p className="text-sm -mt-1 text-gray-600">location</p>
        </div>
      </div>
      <div className="flex items-center gap-5 p-3">
        <i className="ri-currency-line text-2xl"></i>
        <div>
          <h3 className="text-lg font-medium">₹400</h3>
          <p className="text-sm -mt-1 text-gray-600">Cash</p>
        </div>
      </div>
      <button
        className="w-full mt-5 bg-green-600 text-white font-semibold p-2 rounded-lg"
        onClick={() => {
          setIsLookingForCaptain(true);
          setRideConfirmPanelOpen(false);
        }}
      >
        Confirm
      </button>
    </div>
  );
};

export default RideConfirm;
