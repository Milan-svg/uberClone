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
        syncRideState();
        navigate("/captain-home");
      }
    } catch (error) {
      console.error("ERROR AT handleFinishRide fnc: ", error);
    }
  };
  return (
    <div>
      <h5
        className="p-1 text-center w-[93%] absolute top-0"
        onClick={() => {
          setCompleteRidePanel(false);
        }}
      >
        <i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
      </h5>
      <h3 className="text-2xl font-semibold mb-5">Finish this Ride</h3>
      <div className="flex items-center justify-between p-4 border-2  rounded-lg mt-4">
        <div className="flex items-center gap-3 ">
          <img
            className="h-12 rounded-full object-cover w-12"
            src="https://plus.unsplash.com/premium_photo-1661602011150-6c6f8b9ba788?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt=""
          />
          <h2 className="text-lg font-medium">
            {ride?.user?.fullname.firstname +
              " " +
              ride?.user?.fullname.lastname}
          </h2>
        </div>
        <h5 className="text-lg font-semibold">2.2 KM</h5>
      </div>
      <div className="flex gap-2 justify-between flex-col items-center">
        <div className="w-full mt-5">
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="ri-map-pin-user-fill"></i>
            <div>
              <h3 className="text-lg font-medium">{ride?.pickup}</h3>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="text-lg ri-map-pin-2-fill"></i>
            <div>
              <h3 className="text-lg font-medium">{ride?.destination}</h3>
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

        <div className="mt-10 w-full">
          <button
            className="w-full mt-5 flex  text-lg justify-center bg-green-700 text-white font-semibold p-3 rounded-lg"
            onClick={handleFinishRide}
          >
            Finish Ride
          </button>
        </div>
      </div>
    </div>
  );
};

export default RideComplete;
