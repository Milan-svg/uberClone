import React from "react";
import { useNavigate } from "react-router";
import api from "../utils/axiosInstance";

const RideComplete = ({ setCompleteRidePanel, ride, syncRideState }) => {
  const navigate = useNavigate();
  const handleFinishRide = async () => {
    try {
      const res = await api.post("/rides/end", {
        rideId: ride._id,
      });
      if (res.status === 200) {
        await syncRideState();
        navigate("/captain-home");
      }
    } catch (error) {
      console.error("ERROR AT handleFinishRide fnc: ", error);
    }
  };

  return (
    <div className=" pb-3 pt-2">
      <div
        className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-3"
        onClick={() => setCompleteRidePanel(false)}
      ></div>

      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xl font-bold text-gray-900">Finish Ride</h3>
        <span className="text-md text-gray-500">Review</span>
      </div>

      <div className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-xl mb-3">
        <div className="flex items-center gap-2">
          <img
            className="h-10 w-10 rounded-full object-cover"
            src="https://plus.unsplash.com/premium_photo-1661602011150-6c6f8b9ba788?q=80&w=1470&auto=format&fit=crop"
            alt=""
          />
          <span className="text-md font-semibold text-gray-900">
            {ride?.user?.fullname.firstname +
              " " +
              ride?.user?.fullname.lastname}
          </span>
        </div>

        <span className="text-sm font-semibold text-gray-800">2.2 km</span>
      </div>

      <div className="divide-y rounded-xl border border-gray-100 bg-white">
        <div className="flex items-start gap-3 px-3 py-2">
          <i className="ri-map-pin-user-fill text-gray-600"></i>
          <p className="text-md font-semibold capitalize">{ride?.pickup}</p>
        </div>

        <div className="flex items-start gap-3 px-3 py-2">
          <i className="ri-map-pin-2-fill text-gray-600"></i>
          <p className="text-md font-semibold capitalize">
            {ride?.destination}
          </p>
        </div>

        <div className="flex items-center gap-3 px-3 py-2">
          <i className="ri-currency-line text-gray-600"></i>
          <div className="flex items-center justify-between w-full">
            <span className="text-sm font-medium text-gray-900">
              ₹{ride?.fare}
            </span>
            <span className="text-xs text-gray-500">Cash</span>
          </div>
        </div>
      </div>

      <button
        className="w-full mt-4 bg-green-600 hover:bg-green-700 active:scale-[0.97] transition-all text-white text-lg font-semibold py-2.5 rounded-lg"
        onClick={handleFinishRide}
      >
        Finish Ride
      </button>
    </div>
  );
};

export default RideComplete;
