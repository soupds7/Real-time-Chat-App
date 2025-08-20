import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home"

import { Route, Routes } from "react-router-dom";
function App() {
  return (
    <div>
      
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/home" element={<Home/>}/>
      </Routes>
      
    </div>
  );
}

export default App;
