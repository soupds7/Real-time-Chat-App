import React, { useEffect, useState } from 'react';
import axios from 'axios';
import socket from '../Socket';

const UserList = ({ onSelectUser, currentUserId, notifications, setNotifications }) => {
  const [friends, setFriends] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [addFriendId, setAddFriendId] = useState("");
  const [addFriendError, setAddFriendError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all users for add friend modal
  useEffect(() => {
    axios
      .get('https://real-time-chat-app-production-06a7.up.railway.app/api/user/name')
      .then((res) => setAllUsers(res.data))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  // Fetch friends for current user
  useEffect(() => {
    if (!currentUserId) return;
    axios
      .get(`https://real-time-chat-app-production-06a7.up.railway.app/api/user/friends/${currentUserId}`)
      .then((res) => setFriends(res.data))
      .catch((err) => setFriends([]));
  }, [currentUserId]);

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
  }, [currentUserId, selected, setNotifications]);

  const handleClick = (id) => {
    setSelected(id);
    onSelectUser(id);
    // Clear notifications for this user
    setNotifications((prev) => ({ ...prev, [id]: 0 }));
  };

  // Sort friends: latest message (notification) users at the top
  const sortedFriends = [...friends]
    .filter((user) => user._id !== currentUserId)
    .sort((a, b) => {
      const aNotif = notifications[a._id] || 0;
      const bNotif = notifications[b._id] || 0;
      if (aNotif === bNotif) return 0;
      return bNotif - aNotif;
    });

  return (
    <div className="flex-1 overflow-y-auto relative">
      <button
        className="ml-6 mt-3 bg-green-700 text-white px-3 py-1 rounded-lg font-bold hover:bg-green-800 transition"
        onClick={() => setShowAddFriend(true)}
      >
        Add Friend
      </button>
      <ul className="py-2">
        {sortedFriends.map((user) => (
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
              {onlineUsers.includes(user._id) && (
                <span className="text-green-200 text-xs block mt-1">Online</span>
              )}
              {notifications[user._id] > 0 && (
                <span className="mt-1 mx-2 text-xs bg-[#7289DA] text-white rounded-full px-2 py-0.5 w-fit self-start">
                  {notifications[user._id]} new message{notifications[user._id] > 1 ? 's' : ''}
                </span>
              )}
            </span>
          </li>
        ))}
      </ul>

      {/* Add Friend Modal */}
      {showAddFriend && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
            <button className="absolute top-2 right-2 text-green-700 font-bold" onClick={() => { setShowAddFriend(false); setAddFriendError(""); setSearchTerm(""); }}>
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-green-700">Add Friend</h2>
            <input
              type="text"
              className="w-full border border-green-300 rounded-lg px-3 py-2 mb-3"
              placeholder="Search users by name..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            {addFriendError && <div className="text-red-600 mb-2">{addFriendError}</div>}
            <ul className="max-h-64 overflow-y-auto mb-2">
              {allUsers
                .filter(u => u._id !== currentUserId && !friends.some(f => f._id === u._id))
                .filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .map(u => (
                  <li
                    key={u._id}
                    className="px-4 py-2 mb-1 rounded-lg cursor-pointer hover:bg-green-100 text-green-700 font-semibold border border-green-200"
                    onClick={async () => {
                      try {
                        await axios.post('https://real-time-chat-app-production-06a7.up.railway.app/api/user/add-friend', {
                          userId: currentUserId,
                          friendId: u._id
                        });
                        setShowAddFriend(false);
                        setAddFriendId("");
                        setAddFriendError("");
                        setSearchTerm("");
                        // Refresh friends list
                        const res = await axios.get(`https://real-time-chat-app-production-06a7.up.railway.app/api/user/friends/${currentUserId}`);
                        setFriends(res.data);
                      } catch (err) {
                        setAddFriendError("Failed to add friend.");
                      }
                    }}
                  >
                    {u.name}
                  </li>
                ))}
              {searchTerm && allUsers.filter(u => u._id !== currentUserId && !friends.some(f => f._id === u._id)).filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
                <li className="px-4 py-2 text-gray-500">No users found.</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
