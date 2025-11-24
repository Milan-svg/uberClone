import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import { useUser } from "../context/UserContext";
import api from "../utils/axiosInstance.js";
function UserLogin() {
  const [email, setEmail] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const { user, updateUser } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = {
      email: formData.email,
      password: formData.password,
    };
    //console.log("USER LOGIN DATA: ", user);
    //setUserData();
    try {
      const res = await api.post(`/users/login`, user);
      console.log("user login res (userlogin.jsx):", res);
      if (res.status === 200) {
        const data = res.data.data;
        //console.log(data);
        updateUser(data.user);
        navigate("/home");
      }
      return;
    } catch (error) {
      console.error("LOGIN ERROR: ", error);
    }
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  return (
    <div className="p-7 flex flex-col justify-between h-screen">
      <div>
        <img
          className="w-20 mb-7"
          src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
          alt=""
        />
        <form onSubmit={handleSubmit}>
          <label className="form-label">What's your email? </label>
          <input
            required
            type="email"
            placeholder="example@email.com"
            className="input"
            value={formData.email}
            name="email"
            onChange={handleInput}
          />
          <label className="text-xl mb-2 font-medium">Enter Password</label>
          <input
            required
            type="password"
            placeholder="password"
            className="input"
            value={formData.password}
            name="password"
            onChange={handleInput}
          />
          <button type="submit" className="btn-primary">
            Login
          </button>
        </form>
        <p className="text-center mt-2">
          New here?{" "}
          <Link to="/signup" className="font-medium text-blue-600">
            Create new Account
          </Link>
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

export default UserLogin;
