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

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      {/* Mobile Navbar */}
      <nav className="md:hidden flex items-center justify-between bg-green-600 px-4 py-3">
        <div className="text-white text-xl font-extrabold">Chats</div>
        <button
          className="text-white focus:outline-none"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
      </nav>

      {/* Sidebar */}
        <aside className={`fixed md:static top-0 left-0 h-full md:h-screen z-40 bg-green-600 border-r border-green-700 flex-shrink-0 flex flex-col w-64 md:w-72 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="p-6 text-white text-2xl font-extrabold border-b border-green-700 hidden md:block">Chats</div>
        <UserList
          currentUserId={currentUserId}
          onSelectUser={handleSelectUser}
        />
      </aside>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Main chat area */}
      <main className="flex-1 flex flex-col md:ml-0 ml-0 md:pl-0 pl-0">
        <ChatBox
          currentUserId={currentUserId}
          selectedUserId={selectedUserId}
        />
      </main>
    </div>
  );
};

export default Home;

