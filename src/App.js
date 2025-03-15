// src/App.js
import './App.css';
import './index.css';
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Dashboard from "./components/Dashboard/Dashboard";
import AddExpense from "./components/Expense/AddExpense";
import FriendExpenses from "./components/Expense/FriendExpenses";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-expense" element={<AddExpense />} />
        <Route path="/friend-expenses" element={<FriendExpenses />} />
        {/* Redirect root to login */}
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;