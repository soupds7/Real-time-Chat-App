import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home"

import { messaging } from './firebase';
import { getToken } from "firebase/messaging";
import { useEffect } from "react";
import { onMessage } from "firebase/messaging";


import { Route, Routes, Navigate } from "react-router-dom";
function App() {
  useEffect(() => {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        getToken(messaging, { vapidKey: "BPXRKvADSx7yZsEStHjli9VFXZm2SEkxSQ9vE44KKjxO9KOq8M3Gfm4GOHBwH7QYf_U46ouRPi_BK5jZjULOD20" }).then((currentToken) => {
          if (currentToken) {
            // Save token to backend
            const user = JSON.parse(localStorage.getItem("user"));
            if (user?._id) {
              fetch("https://real-time-chat-app-production-06a7.up.railway.app/api/user/fcm-token", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user._id, fcmToken: currentToken })
              });
            }
            console.log("FCM Token:", currentToken);
          }
        });
      }
    });
  }, []);

  useEffect(() => {
    onMessage(messaging, (payload) => {
            console.log('Received push notification:', payload);
      
    });
  }, []);
  return (
    <div>
      
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/home" element={<Home/>}/>
      </Routes>
      
    </div>
  );
}

export default App;
