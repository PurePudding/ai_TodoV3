import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './layout/Header';
import Dashboard from './pages/Dashboard';
import VoiceAssistant from './pages/VoiceAssistant';
import AuthForm from './components/auth/AuthForm';
import useUserStore from './stores/userStore';
import { supabase } from './lib/supabase';

function App() {
  const { setUser, user, fetchProfile } = useUserStore();
  
  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile();
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, fetchProfile]);
  
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <AuthForm />
        </main>
      </div>
    );
  }
  
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        
        <main className="flex-1">
          <Routes>
            <Route 
              path="/" 
              element={<Navigate to="/dashboard" />} 
            />
            
            <Route 
              path="/dashboard" 
              element={<Dashboard />} 
            />
            
            <Route 
              path="/voice" 
              element={<VoiceAssistant />} 
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;