import React, { useContext } from "react";

const CaptainDetails = ({ captain }) => {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-start gap-3">
          <img
            className="h-12 w-12 rounded-full object-cover shadow-xl"
            src="https://static.vecteezy.com/system/resources/previews/001/131/187/large_2x/serious-man-portrait-real-people-high-definition-grey-background-photo.jpg"
            alt=""
          />
          <h4 className="text-xl font-semibold capitalize">
            {captain?.fullname?.firstname}
          </h4>
        </div>
        <div>
          <h4 className="text-xl font-semibold">₹ —</h4>
          <p className="text-md ">Earned</p>
        </div>
      </div>
      <div className="mt-4 h-px w-full bg-gray-400" />

      <div className="mt-6 rounded-2xl bg-gray-100 px-4 py-3 shadow-md">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="flex flex-col items-center gap-1">
            <i className="ri-timer-2-line text-3xl text-black"></i>
            <span className="text-base font-semibold text-gray-900">—</span>
            <span className="text-md text-gray-500">Online today</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <i className="ri-road-map-line text-3xl text-black"></i>
            <span className="text-base font-semibold text-gray-900">—</span>
            <span className="text-md text-gray-500">Trips</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <i className="ri-star-line text-3xl text-black"></i>
            <span className="text-base font-semibold text-gray-900">—</span>
            <span className="text-md text-gray-500">Rating</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaptainDetails;

// <div>
//     {/* Top row */}
//     <div className="flex items-center justify-between">
//       <div className="flex items-center gap-2">
//         <img
//           className="h-10 w-10 rounded-full object-cover"
//           src="https://static.vecteezy.com/system/resources/previews/001/131/187/large_2x/serious-man-portrait-real-people-high-definition-grey-background-photo.jpg"
//           alt=""
//         />
//         <h4 className="text-base font-semibold text-gray-900 capitalize">
//           {captain?.fullname?.firstname}
//         </h4>
//       </div>

//       <div className="text-right leading-tight">
//         <p className="text-sm font-semibold text-gray-900">₹ —</p>
//         <span className="text-[11px] text-gray-500">Earned</span>
//       </div>
//     </div>

//     {/* Divider */}
//     <div className="h-px bg-gray-200 my-3" />

//     {/* Stats */}
//     <div className="grid grid-cols-3 gap-2 text-center">
//       <div className="flex flex-col items-center gap-0.5">
//         <i className="ri-timer-2-line text-lg text-gray-700"></i>
//         <span className="text-sm font-semibold text-gray-900">—</span>
//         <span className="text-[11px] text-gray-500">Online</span>
//       </div>

//       <div className="flex flex-col items-center gap-0.5">
//         <i className="ri-road-map-line text-lg text-gray-700"></i>
//         <span className="text-sm font-semibold text-gray-900">—</span>
//         <span className="text-[11px] text-gray-500">Trips</span>
//       </div>

//       <div className="flex flex-col items-center gap-0.5">
//         <i className="ri-star-line text-lg text-gray-700"></i>
//         <span className="text-sm font-semibold text-gray-900">—</span>
//         <span className="text-[11px] text-gray-500">Rating</span>
//       </div>
//     </div>
//   </div>
