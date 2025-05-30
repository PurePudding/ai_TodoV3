import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./layout/Header";
import Dashboard from "./pages/Dashboard";
import VoiceAssistant from "./pages/VoiceAssistant";
import useUserStore from "./stores/userStore";

function App() {
  const { isAuthenticated, user } = useUserStore();

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />

        <main className="flex-1">
          <Routes>
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" />
                ) : (
                  <Navigate to="/voice" />
                )
              }
            />

            <Route
              path="/dashboard"
              element={
                isAuthenticated ? <Dashboard /> : <Navigate to="/voice" />
              }
            />

            <Route path="/voice" element={<VoiceAssistant />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
