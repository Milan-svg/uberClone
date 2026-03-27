import React from "react";

const WaitingForCaptain = ({ setIsWaitingForCaptain, ride }) => {
  return (
    <div>
      <div
        className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-3"
        onClick={() => {
          setIsWaitingForCaptain(false);
        }}
      ></div>

      <div className="flex items-center justify-between">
        <img
          className="h-16"
          src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg"
          alt=""
        />
        <div className="text-right space-y-2">
          <h2 className="text-xl font-bold capitalize">
            {ride?.captain?.fullname.firstname +
              " " +
              ride?.captain?.fullname.lastname}
          </h2>
          <h4 className="text-xl font-semibold -mt-1 -mb-1">
            {ride?.captain?.vehicle.plate}
          </h4>
          <p className="text-md text-gray-600">Maruti Suzuki Alto</p>
          <h1 className="text-lg font-semibold">{ride?.otp}</h1>
        </div>
      </div>

      <div className="flex gap-2 justify-between flex-col items-center">
        <div className="w-full mt-5">
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="ri-map-pin-user-fill"></i>
            <div>
              <h3 className="text-lg font-medium capitalize">{ride?.pickup}</h3>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="text-lg ri-map-pin-2-fill"></i>
            <div>
              <h3 className="text-lg font-medium capitalize">
                {ride?.destination}
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3">
            <i className="ri-currency-line"></i>
            <div>
              <h3 className="text-lg font-medium">₹{ride?.fare}</h3>
              <p className="text-sm -mt-1 text-gray-600">Cash</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitingForCaptain;
