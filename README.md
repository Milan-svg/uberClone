# Real-Time Ride Hailing Platform (MERN + Socket.IO)

Uber-style ride booking app with real-time user ↔ captain updates, OTP-based ride start, and persistent “current ride” recovery after reload.

## Features

- User flow: search route → create ride → wait for captain → ride started → ride ended
- Captain flow: receive ride request → accept → verify OTP → start/end ride
- Real-time events via Socket.IO (ride confirmed/started/ended)
- JWT auth (separate User/Captain models), cookies, protected APIs
- “Current ride” API to restore state after refresh/navigation

## Tech Stack

React (Vite), Node.js, Express, MongoDB (Mongoose), Socket.IO

Heres a Video Demo for the Project:
https://youtu.be/LSgdxrukkYA
