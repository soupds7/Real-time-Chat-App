import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserList from '../components/UserList';
import ChatBox from '../components/ChatBox';

const Home = () => {
  const [selectedUserId, setSelectedUserId] = useState();
  const [currentUserId, setCurrentUserId] = useState();

  const navigate = useNavigate();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?._id) {
      setCurrentUserId(user._id);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleSelectUser = (id) => {
    setSelectedUserId(id);
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <aside className="w-72 bg-green-600 border-r border-green-700 flex-shrink-0 flex flex-col">
        <div className="p-6 text-white text-2xl font-extrabold border-b border-green-700">Chats</div>
        <UserList
          currentUserId={currentUserId}
          onSelectUser={handleSelectUser}
        />
      </aside>
      <main className="flex-1 flex flex-col">
        <ChatBox
          currentUserId={currentUserId}
          selectedUserId={selectedUserId}
        />
      </main>
    </div>
  );
};

export default Home;
