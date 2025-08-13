import React, { useEffect, useState } from 'react';
import axios from 'axios';
import socket from '../Socket';

const UserList = ({ onSelectUser, currentUserId }) => {
  const [names, setNames] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [notifications, setNotifications] = useState({});

  useEffect(() => {
    axios
      .get('http://localhost:5001/api/user/name')
      .then((res) => setNames(res.data))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  useEffect(() => {
    // Notify server this user is online
    if (currentUserId) {
      socket.emit("user_online", currentUserId);
    }
    // Listen for online user updates
    socket.on("update_online", (users) => {
      setOnlineUsers(users);
    });
    // Listen for new messages for notification
    const handleReceive = (msg) => {
      if (
        msg.receiver === currentUserId &&
        msg.sender !== selected &&
        msg.sender !== currentUserId
      ) {
        setNotifications((prev) => ({
          ...prev,
          [msg.sender]: (prev[msg.sender] || 0) + 1
        }));
      }
    };
    socket.on("receive_message", handleReceive);
    return () => {
      socket.off("update_online");
      socket.off("receive_message", handleReceive);
    };
  }, [currentUserId, selected]);

  const handleClick = (id) => {
    setSelected(id);
    onSelectUser(id);
    // Clear notifications for this user
    setNotifications((prev) => ({ ...prev, [id]: 0 }));
  };

  // Sort users: latest message (notification) users at the top
  const sortedNames = [...names]
    .filter((user) => user._id !== currentUserId)
    .sort((a, b) => {
      const aNotif = notifications[a._id] || 0;
      const bNotif = notifications[b._id] || 0;
      if (aNotif === bNotif) return 0;
      return bNotif - aNotif;
    });

  return (
    <div className="flex-1 overflow-y-auto">
      <ul className="py-2">
        {sortedNames.map((user) => (
          <li
            key={user._id}
            onClick={() => handleClick(user._id)}
            className={`px-6 py-3 mb-2 mx-2 rounded-lg cursor-pointer font-semibold transition flex flex-col
              ${selected === user._id ? 'bg-green-700 ' : ' hover:bg-green-700'}`}
          >
            <span className={
              onlineUsers.includes(user._id)
                ? "font-bold text-white"
                : ""
            }>
              {user.name}
              {notifications[user._id] > 0 && (
              <span className="mt-1 mx-2 text-xs bg-[#7289DA] text-white rounded-full px-2 py-0.5 w-fit self-start">
                {notifications[user._id]} new message{notifications[user._id] > 1 ? 's' : ''}
              </span>
            )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
