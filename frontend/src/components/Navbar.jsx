import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../context/userContext';
import { toast } from 'react-hot-toast';
import { Menu, User, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, setUser, logout } = useContext(UserContext);
  
  const handleLogout = () => {
    if (user) {
      logout(); // Use the centralized logout function
      toast.success("Logged out successfully");
    } else {
      toast.error("You are not logged in");
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-gray-900 to-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex items-center space-x-2"
            >
              <span className="text-2xl font-bold bg-gradient-to-r pl-7 from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Wrestle
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {!user ? (
              <>
                <Link
                  to="/register"
                  className="text-gray-300 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-gray-700"
                >
                  <div className="flex items-center space-x-2">
                    <User size={18} />
                    <span>Register</span>
                  </div>
                </Link>
                <Link
                  to="/login"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Login
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:shadow-lg active:scale-95"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button className="text-gray-300 hover:text-white p-2">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;