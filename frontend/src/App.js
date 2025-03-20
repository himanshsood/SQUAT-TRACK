import Home from "./pages/home/Home";
import TopBar from "./components/topbar/TopBar";


import Login from "./pages/login/Login";
import Register from "./pages/register/Register";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useContext } from "react";
import { Context } from "./context/Context";

import Counter from "./components/counter/Counter";

function App() {
  const { user } = useContext(Context);

  return (
    <Router>
      <TopBar />
      <Routes>
        <Route path="/" element={<Home />} />
        
        
        <Route path="/register" element={user ? <Home /> : <Register />} />
        <Route path="/login" element={user ? <Home /> : <Login />} />
       

        <Route path="counter" element={<Counter />} />
        
      </Routes>
    </Router>
  );
}

export default App;
