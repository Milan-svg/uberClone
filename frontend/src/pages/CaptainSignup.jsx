import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import { useCaptain } from "../context/CaptainContext";
function CaptainSignup() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    color: "",
    plate: "",
    capacity: "",
    vehicleType: "",
  });
  const navigate = useNavigate();
  const { updateCaptain } = useCaptain();

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const captain = {
      fullname: {
        firstname: formData.firstName,
        lastname: formData.lastName,
      },
      email: formData.email,
      password: formData.password,
      vehicle: {
        color: formData.color,
        plate: formData.plate,
        capacity: formData.capacity,
        vehicleType: formData.vehicleType,
      },
    };
    console.log("FORMDATA:-", captain);
    const res = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/captains/register`,
      captain
    );

    //console.log("RES:", res);
    if (res.status === 201) {
      const data = res.data.data;
      //console.log("CAPTAIN: ", data.captain);
      updateCaptain(data.captain);
      navigate("/home");
    }
  };
  return (
    <div className="min-h-screen p-7 flex flex-col justify-between">
      <div>
        <img
          className="w-20 mb-7"
          src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
          alt=""
        />
        <form onSubmit={handleSubmit}>
          <label className="form-label">What's your name?</label>
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="First Name"
              className="input"
              name="firstName"
              value={formData.firstName}
              onChange={handleInput}
            />
            <input
              type="text"
              placeholder="Last Name"
              className="input"
              name="lastName"
              value={formData.lastName}
              onChange={handleInput}
            />
          </div>
          <label className="form-label"> What's your email?</label>
          <input
            type="email"
            placeholder="example@email.com"
            className="input"
            value={formData.email}
            name="email"
            onChange={handleInput}
          />
          <label className="form-label"> Enter a Password</label>
          <input
            type="password"
            placeholder="password"
            className="input"
            value={formData.password}
            name="password"
            onChange={handleInput}
          />
          <label className="form-label"> Vehicle Information</label>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              className="input"
              placeholder="color"
              name="color"
              value={formData.color}
              onChange={handleInput}
            />
            <input
              type="text"
              className="input"
              placeholder="numberplate"
              name="plate"
              value={formData.plate}
              onChange={handleInput}
            />
            <input
              type="number"
              className="input"
              placeholder="capacity"
              name="capacity"
              value={formData.capacity}
              onChange={handleInput}
            />
            <select
              className="input"
              placeholder="vehicle type"
              name="vehicleType"
              value={formData.vehicleType}
              onChange={handleInput}
            >
              <option value="">Select Type</option>
              <option value="car">Car</option>
              <option value="motorcycle">Motorcycle</option>
              <option value="auto">Auto</option>
            </select>
          </div>
          <button className="btn-primary" type="submit">
            Create Account
          </button>
        </form>
        <p className="text-center mt-2">
          Already have an Account?{" "}
          <Link to="/captain-login" className="text-blue-600 font-medium">
            Login here
          </Link>{" "}
        </p>
      </div>
      <Link
        to="/login"
        className="bg-[#d5622d] flex items-center justify-center text-white font-semibold mb-5 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base"
      >
        Sign in as User
      </Link>
    </div>
  );
}

export default CaptainSignup;
