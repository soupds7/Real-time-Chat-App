# Real-time Chat App

A professional, WhatsApp-inspired real-time chat application built with React, Node.js, Express, MongoDB, Socket.io, and Tailwind CSS.

## Features
- **Real-time Messaging:** Instant chat powered by Socket.io.
- **WhatsApp-inspired UI:** Clean, modern interface using Tailwind CSS.
- **Authentication:** Secure login and registration.
- **Online Status:** See which users are online in real time.
- **Typing Indicator:** Know when your chat partner is typing.
- **Notifications:** New message and friend request notifications.
- **Friend System:** Add/search friends, send/accept/decline friend requests.
- **Auto-scroll:** Chat auto-scrolls to the latest message.
- **No visible scrollbars:** Clean chat experience.

## Tech Stack
- **Frontend:** React, Tailwind CSS, Socket.io-client
- **Backend:** Node.js, Express, MongoDB, Socket.io

## Getting Started

### Prerequisites
- Node.js
- MongoDB

### Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/soupds7/Real-time-Chat-App.git
   cd Real-time-Chat-App
   ```
2. Install dependencies for both client and server:
   ```sh
   cd server
   npm install
   cd ../client
   npm install
   ```
3. Set up environment variables:
   - Create a `.env` file in `server/` with:
     ```env
     MONGO_URI=your_mongodb_uri
     JWT_SECRET=your_jwt_secret
     PORT=5000
     ```
4. Start the backend server:
   ```sh
   cd server
   npm start
   ```
5. Start the frontend:
   ```sh
   cd ../client
   npm start
   ```

## Usage
- Register or log in.
- Add/search friends and manage friend requests.
- Select a user to start chatting.
- Enjoy real-time messaging and notifications.

## License
MIT

---

Made with ❤️ by soupds7
