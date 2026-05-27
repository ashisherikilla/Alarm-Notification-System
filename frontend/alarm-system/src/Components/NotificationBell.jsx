import React, { useEffect, useState } from "react";
import axios from "axios";
import socket from "../socket";

import { FaBell } from "react-icons/fa";

const NotificationBell = () => {
  const [alarms, setAlarms] = useState([]);
  const [open, setOpen] = useState(false);

  // Fetch existing alarms initially
  useEffect(() => {
    fetchAlarms();

    // Listen for real-time updates
    socket.on("alarmUpdated", (updatedAlarms) => {
      console.log("Real-time alarms received");

      setAlarms(updatedAlarms);
    });

    // Cleanup
    return () => {
      socket.off("alarmUpdated");
    };
  }, []);

  // API call
  const fetchAlarms = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/alarms"
      );

      setAlarms(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      style={{
        padding: "30px",
        position: "relative",
      }}
    >
      {/* Bell Icon */}
      <FaBell
        size={30}
        style={{ cursor: "pointer" }}
        onClick={() => setOpen(!open)}
      />

      {/* Notification Count */}
      {alarms.length > 0 && (
        <span
          style={{
            position: "absolute",
            top: 20,
            left: 50,
            background: "red",
            color: "white",
            borderRadius: "50%",
            padding: "5px 10px",
            fontSize: "12px",
          }}
        >
          {alarms.length}
        </span>
      )}

      {/* Notification Dropdown */}
      {open && (
        <div
          style={{
            width: "300px",
            background: "white",
            border: "1px solid #ccc",
            borderRadius: "10px",
            marginTop: "20px",
            padding: "10px",
          }}
        >
          <h3>Latest Alarms</h3>

          {alarms.map((alarm) => (
            <div
              key={alarm._id}
              style={{
                borderBottom: "1px solid #eee",
                padding: "10px 0",
              }}
            >
              <p>{alarm.message}</p>

              <small>
                Severity: {alarm.severity}
              </small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;