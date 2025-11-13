import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import { useCaptain } from "../context/CaptainContext";

function CaptainLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //const [formData, setFormData] = useState(null);
  const navigate = useNavigate();
  const { updateCaptain } = useCaptain();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      email: email,
      password: password,
    };
    console.log("FORMDATA-", formData);
    const res = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/captains/login`,
      formData
    );
    console.log("RES: ", res);
    if (res.status === 200) {
      const data = res.data.data;
      updateCaptain(data.captain);
      setEmail("");
      setPassword("");
      navigate("/home");
    }
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label className="text-xl mb-2 font-medium">Enter Password</label>
          <input
            required
            type="password"
            placeholder="password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="btn-primary">
            Login
          </button>
        </form>
        <p className="text-center mt-2">
          New here?{" "}
          <Link to="/captain-signup" className="font-medium text-blue-600">
            Create new Account
          </Link>
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

export default CaptainLogin;
