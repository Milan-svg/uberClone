import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router";
import { UserProvider } from "./context/UserContext.jsx";
import { CaptainProvider } from "./context/CaptainContext.jsx";
import SocketProvider from "./context/SocketContext.jsx";
import { RideProvider } from "./context/RideContext.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SocketProvider>
      <CaptainProvider>
        <UserProvider>
          <RideProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </RideProvider>
        </UserProvider>
      </CaptainProvider>
    </SocketProvider>
  </StrictMode>
);
