import React from "react";
import { Link } from "react-router";
function Start() {
  return (
    <div>
      <div className="bg-cover bg-center bg-[url(https://images.unsplash.com/photo-1538563188159-070c4db2bc65?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687)] h-screen w-full pt-10 flex flex-col justify-between bg-red-400">
        <img
          className="w-20 ml-10"
          src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
          alt=""
        />
        <div className="bg-white py-5 px-5 pb-5">
          <h2 className="text-3xl font-bold">Get started with Uber</h2>
          <Link
            to="/login"
            className="flex items-center justify-center w-full bg-black text-white text-2xl py-4 rounded-2xl mt-3 "
          >
            Continue
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Start;
