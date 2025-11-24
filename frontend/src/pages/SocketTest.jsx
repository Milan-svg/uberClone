// TestSocket.jsx
import { useContext, useEffect } from "react";
import { SocketContext } from "../context/SocketContext";
function TestSocket() {
  const { socket } = useContext(SocketContext);

  useEffect(() => {
    // Simulate a user joining
    const testUserId = "691c860a24c64428996c1f42";

    console.log("Emitting join event...");
    socket.emit("join", {
      userId: testUserId,
      userType: "user",
    });
  }, [socket]);

  return (
    <div>
      <h1>Socket Test Page</h1>
      <p>Check your browser console and backend terminal!</p>
    </div>
  );
}

export default TestSocket;
