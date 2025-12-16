import React from "react";

const LookingForCaptain = ({ setIsLookingForCaptain, ride }) => {
  return (
    <div>
      <h5
        className="p-1 text-center w-[93%] absolute top-0"
        onClick={() => {
          setIsLookingForCaptain(false);
        }}
      >
        <i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
      </h5>
      <h3 className="text-2xl font-semibold mb-5">Searching for a Captain</h3>
      <img
        className="h-20 w-40 mx-auto mb-6"
        src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg"
        alt=""
      />
      <div className="flex items-center gap-5 p-3 border-b-2 ">
        <i className="ri-map-pin-user-fill text-2xl"></i>
        <div>
          <h3 className="text-lg font-bold capitalize">{ride?.pickup}</h3>
        </div>
      </div>
      <div className="flex items-center gap-5 p-3 border-b-2 ">
        <i className="ri-map-pin-user-fill text-2xl"></i>
        <div>
          <h3 className="text-lg font-bold capitalize">{ride?.destination}</h3>
        </div>
      </div>
      <div className="flex items-center gap-5 p-3">
        <i className="ri-currency-line text-2xl"></i>
        <div>
          <h3 className="text-lg font-medium">₹{ride?.fare}</h3>
          <p className="text-sm -mt-1 text-gray-600">Cash</p>
        </div>
      </div>
    </div>
  );
};

export default LookingForCaptain;
