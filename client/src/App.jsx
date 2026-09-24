import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';

import HomePage from './pages/HomePage';
import RoomsPage from './pages/RoomsPage';
import RoomDetailPage from './pages/RoomDetailPage';
import MyBookingsPage from './pages/MyBookingsPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  const [authModalState, setAuthModalState] = useState({ isOpen: false, mode: 'login' });

  const openAuth = (mode = 'login') => {
    setAuthModalState({ isOpen: true, mode });
  };

  const closeAuth = () => {
    setAuthModalState({ isOpen: false, mode: 'login' });
  };

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen text-gray-900 bg-white selection:bg-amber-100 selection:text-amber-900">
          
          {/* Toast Notification Container */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                background: '#18181b',
                color: '#fff',
                borderRadius: '16px',
                fontSize: '13px',
                fontWeight: '500',
                padding: '12px 18px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />

          {/* Navigation Bar */}
          <Navbar onOpenAuth={openAuth} />

          {/* Main Routing Content */}
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage onOpenAuth={openAuth} />} />
              <Route path="/rooms" element={<RoomsPage onOpenAuth={openAuth} />} />
              <Route path="/rooms/:id" element={<RoomDetailPage onOpenAuth={openAuth} />} />
              <Route path="/my-bookings" element={<MyBookingsPage onOpenAuth={openAuth} />} />
              <Route path="/dashboard" element={<DashboardPage onOpenAuth={openAuth} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Footer */}
          <Footer />

          {/* Auth Dialog Modal */}
          <AuthModal
            isOpen={authModalState.isOpen}
            initialMode={authModalState.mode}
            onClose={closeAuth}
          />

        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;