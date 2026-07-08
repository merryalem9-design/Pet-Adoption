import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold">
            🐾 PawPath
          </Link>

          <div className="flex gap-6 items-center">
            <Link to="/pets" className="hover:bg-blue-700 px-3 py-2 rounded">
              Browse Pets
            </Link>
            <Link to="/feed" className="hover:bg-blue-700 px-3 py-2 rounded">
              Feed
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="hover:bg-blue-700 px-3 py-2 rounded">
                  Dashboard
                </Link>
                <span className="text-sm">{user?.displayName}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-white text-blue-600 hover:bg-gray-100 px-4 py-2 rounded"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded"
                >
                  Signup
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}