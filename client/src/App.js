import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Products from "./components/Products";
import Payment from "./components/Payment";
import Success from "./components/Success";
import History from "./components/History";
import Navbar from "./components/Navbar";
import './App.css';

function App() {
  const [account, setAccount] = useState(localStorage.getItem("activeAccount"));

  const handleLogin = (acc) => {
    localStorage.setItem("activeAccount", acc);
    setAccount(acc);
  };

  const handleLogout = () => {
    localStorage.removeItem("activeAccount");
    setAccount(null);
  };

  return (
    <>
      {account && <Navbar account={account} onLogout={handleLogout} />}
      <div className="App">
        <Routes>
          <Route path="/" element={account ? <Navigate to="/products" /> : <Login onLogin={handleLogin} />} />
          <Route path="/products" element={account ? <Products /> : <Navigate to="/" />} />
          <Route path="/payment" element={account ? <Payment /> : <Navigate to="/" />} />
          <Route path="/success" element={account ? <Success /> : <Navigate to="/" />} />
          <Route path="/history" element={account ? <History /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
