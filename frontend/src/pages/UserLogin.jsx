import React, { useState } from "react";
import { Link } from "react-router";
import axios from "axios";
import { useUser } from "../context/UserContext";
function UserLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userData, setUserData] = useState(null);
  const { user, setUser } = useUser();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = {
      email: email,
      password: password,
    };
    //setUserData();
    const res = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/users/login`,
      user
    );
    if (res.status === 201) {
      const data = res.data;
      setUserData(data.user);
      console.log(data);
      setUser(data.user);
      navigate("/home");
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
            value={email}
            name="email"
            onChange={handleInput}
          />
          <label className="text-xl mb-2 font-medium">Enter Password</label>
          <input
            required
            type="password"
            placeholder="password"
            className="input"
            value={password}
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
