import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useUser } from "../context/UserContext";
import axios from "axios";
import api from "../utils/axiosInstance.js";

function UserSignup() {
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = {
      fullname: {
        firstname: formData.firstName,
        lastname: formData.lastName,
      },
      email: formData.email,
      password: formData.password,
    };
    const res = await api.post("/users/register", user);

    // axios.post(
    //   `${import.meta.env.VITE_BASE_URL}/users/register`,
    //   user
    // );
    console.log("USER SIGNUP RES: ", res);
    if (res.status === 201) {
      const data = res.data;
      setUserData(data.user);
      setUser(data.user);
      console.log(data.user);
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
            placeholder="email@example.com"
            className="input"
            value={formData.email}
            name="email"
            onChange={handleInput}
          />
          <label className="form-label"> Enter Password</label>
          <input
            type="password"
            placeholder="password"
            className="input"
            value={formData.password}
            name="password"
            onChange={handleInput}
          />

          <button className="btn-primary" type="submit">
            Create Account
          </button>
        </form>
        <p className="text-center mt-2">
          Already have an Account?{" "}
          <Link to="/login" className="text-blue-600 font-medium">
            Login here
          </Link>{" "}
        </p>
      </div>
      <Link
        to="/captain-login"
        className="bg-[#10b461] flex items-center justify-center text-white font-semibold mb-5 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base"
      >
        Sign in as Captain
      </Link>
    </div>
  );
}

export default UserSignup;
