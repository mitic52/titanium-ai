import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import "./style.scss";
import Login from "./pages/login/Login";
import Main from "./pages/main/Application";

const App = () => {
  const key = localStorage.getItem("userKey");
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.key}>
        <Route path="/login" element={key ? <Navigate to="/app" /> : <Login />} />
        <Route path="/app" element={key ? <Main /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={key ? "/app" : "/login"} />} />
      </Routes>
    </AnimatePresence>
  );
};

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
