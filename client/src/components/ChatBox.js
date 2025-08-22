import React, { useEffect, useState } from 'react';
import axios from 'axios';
import socket from '../Socket';

const ChatBox = ({ currentUserId, selectedUserId, sidebarOpen, setSidebarOpen, totalUnread }) => {  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedUserName, setSelectedUserName] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Fetch selected user's name
  useEffect(() => {
    if (!selectedUserId) {
      setSelectedUserName("");
      return;
    }
    axios
      .get(`https://real-time-chat-app-production-06a7.up.railway.app/api/user/name`)
      .then((res) => {
        const user = res.data.find((u) => u._id === selectedUserId);
        setSelectedUserName(user ? user.name : "");
      })
      .catch(() => setSelectedUserName(""));
  }, [selectedUserId]);

  // Fetch chat history
  useEffect(() => {
    if (!selectedUserId || !currentUserId) {
      setMessages([]);
      return;
    }
    axios
      .get(`https://real-time-chat-app-production-06a7.up.railway.app/api/messages/${currentUserId}/${selectedUserId}`)
      .then((res) => setMessages(res.data))
      .catch((err) => setMessages([]));
  }, [selectedUserId, currentUserId]);

  // Send message (real-time)
  const sendMessage = async () => {
    if (!currentUserId || !selectedUserId || !newMessage.trim()) {
      alert('Please select a user and type a message.');
      return;
    }
    const messageData = {
      sender: currentUserId,
      receiver: selectedUserId,
      text: newMessage,
      createdAt: new Date()
    };
    // Emit to socket.io
    socket.emit("send_message", messageData);
    // Save to DB as before
    try {
      await axios.post(`https://real-time-chat-app-production-06a7.up.railway.app/api/messages/box`, messageData);
      
      setNewMessage("");
    } catch (err) {
      alert('Failed to send message.');
    }
    // Send push notification
      const user = JSON.parse(localStorage.getItem("user"));
      const senderName = user && user.name ? user.name : "Someone";
      await axios.post(`https://real-time-chat-app-production-06a7.up.railway.app/api/user/send-notification`, {
        userId: selectedUserId,
        senderName,
        messageText: newMessage
      });
  };

  // Listen for incoming messages and typing indicator
  useEffect(() => {
    const handleReceive = (msg) => {
      if (
        (msg.sender === currentUserId && msg.receiver === selectedUserId) ||
        (msg.sender === selectedUserId && msg.receiver === currentUserId)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    };
    const handleTyping = (data) => {
      if (data.sender === selectedUserId && data.receiver === currentUserId) {
        setIsTyping(true);
        // Remove typing after 1.5s
        setTimeout(() => setIsTyping(false), 1500);
      }
    };
    socket.on("receive_message", handleReceive);
    socket.on("typing", handleTyping);
    return () => {
      socket.off("receive_message", handleReceive);
      socket.off("typing", handleTyping);
    };
  }, [currentUserId, selectedUserId]);

  // Emit typing event
  const handleTyping = () => {
    if (currentUserId && selectedUserId) {
      socket.emit("typing", { sender: currentUserId, receiver: selectedUserId });
    }
  };

  // Ref for message container
  const messagesEndRef = React.useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, selectedUserId]);

  return (
    <div className="flex flex-col min-h-screen h-screen bg-gray-100 md:p-6">
    {/* Mobile Navbar */}
      <nav className="md:hidden flex items-center justify-between bg-green-600 px-4 py-3 mb-2">
        <div className="flex items-center mb-2 md:mb-4 flex-wrap">
        <div className="text-xl md:text-2xl mt-2 font-extrabold text-gray-100">Inbox</div>
        {selectedUserName && (
          <div className="ml-2 md:ml-4 px-2 mt-2 md:px-4 py-1 md:py-2 rounded-lg bg-green-100 text-green-700 font-bold text-base md:text-lg">
            {selectedUserName}
          </div>
        )}
      </div>
        <button
          className="relative text-white focus:outline-none"
          onClick={() => setSidebarOpen && setSidebarOpen(!sidebarOpen)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          {totalUnread > 0 && (
            <span className="absolute -top-1 -right-2 bg-red-600 text-white rounded-full px-2 py-0.5 text-xs font-bold">
              {totalUnread}
            </span>
          )}
        </button>
      </nav>
      
      <div className="flex-1 overflow-y-auto space-y-2 mx-1 pb-2 md:pb-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {selectedUserId ? (
          <>
            {messages.length > 0 ? (
              messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`w-fit max-w-[80vw] md:max-w-md px-3 md:px-4 py-2 rounded-lg shadow text-sm md:text-base break-words ${
                    msg.sender === currentUserId
                      ? 'bg-green-500 text-white self-end ml-auto'
                      : 'bg-white text-green-900 self-start mr-auto border border-green-200'
                  }`}
                >
                  {msg.text}
                </div>
              ))
            ) : (
              <div className="text-green-700">No messages yet.</div>
            )}
            {isTyping && (
              <div className="text-green-500 font-semibold ml-2">Typing...</div>
            )}
            <div ref={messagesEndRef} />
          </>
        ) : (
          <div className="text-green-700">Select a user to start chatting.</div>
        )}
      </div>
      <form className="flex mb-2 mx-2 mt-2 gap-2 md:gap-0 pb-3" onSubmit={e => { e.preventDefault(); sendMessage(); }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => { setNewMessage(e.target.value); handleTyping(); }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="Type a message..."
          className="flex-1 px-3 md:px-4 py-4 rounded-l-lg bg-white text-green-900 border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm md:text-base"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 md:px-6 py-4 rounded-r-lg font-bold hover:bg-green-700 transition text-sm md:text-base"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
