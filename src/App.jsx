import React from "react";
import { Routes, Route } from "react-router-dom";
import AuthForm from "./pages/AuthForm";
import Waiting from "./pages/Waiting";
import Questions from "./pages/Questions";
import Result from "./pages/Result";

export default function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route path="/waiting" element={<Waiting />} />
        <Route path="/questions" element={<Questions />} />
        <Route path="/result" element={<Result />} />
      </Routes>
    </div>
  );
}
