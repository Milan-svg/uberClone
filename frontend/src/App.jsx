import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Start from "./pages/Start";
import UserLogin from "./pages/UserLogin";
import UserSignup from "./pages/UserSignup";
import CaptainLogin from "./pages/CaptainLogin";
import CaptainSignup from "./pages/CaptainSignup";
import MobileLayout from "./components/MobileLayout";
import CaptainHome from "./pages/CaptainHome";
import ActiveRide from "./pages/ActiveRide";
import CaptainActiveRide from "./pages/CaptainActiveRide";

function App() {
  return (
    <>
      <Routes>
        <Route element={<MobileLayout />}>
          <Route path="/" element={<Start />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/signup" element={<UserSignup />} />
          <Route path="/riding" element={<ActiveRide />} />
          <Route path="/captain-login" element={<CaptainLogin />} />
          <Route path="/captain-signup" element={<CaptainSignup />} />
          <Route path="/captain-home" element={<CaptainHome />} />
          <Route path="/captain-riding" element={<CaptainActiveRide />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
