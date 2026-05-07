import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { BrainCircuit, LogOut, LayoutDashboard, Target, History } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-surface border-b border-white/10 sticky top-0 z-50 backdrop-blur-md bg-surface/80">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <BrainCircuit className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            MentalIQ
          </span>
        </Link>
        
        <div className="flex items-center space-x-6">
          {user ? (
            <>
              <Link to="/dashboard" className="text-gray-300 hover:text-white transition flex items-center space-x-1">
                <LayoutDashboard className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
              <Link to="/history" className="text-gray-300 hover:text-white transition flex items-center space-x-1">
                <History className="h-5 w-5" />
                <span>History</span>
              </Link>
              <Link to="/games" className="text-gray-300 hover:text-white transition flex items-center space-x-1">
                <Target className="h-5 w-5" />
                <span>Games</span>
              </Link>
              {user.is_admin && (
                <Link to="/admin" className="text-accent hover:text-white transition">Admin</Link>
              )}
              <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-white/10">
                <span className="text-sm text-gray-400">Hi, {user.username}</span>
                <button 
                  onClick={handleLogout}
                  className="p-2 hover:bg-white/5 rounded-full transition text-gray-400 hover:text-white"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-300 hover:text-white transition">Login</Link>
              <Link to="/signup" className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition shadow-lg shadow-primary/20">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
