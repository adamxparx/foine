import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUpload, FiUser, FiLogOut, FiSettings, FiMenu, FiX } from 'react-icons/fi';

const Header = ({ user, searchQuery, onSearch, onUploadClick, onLogout, onLoginClick, onRegisterClick }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery || '');
  const closeTimeoutRef = useRef(null);

  // Sync local search query with prop
  React.useEffect(() => {
    setLocalSearchQuery(searchQuery || '');
  }, [searchQuery]);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setLocalSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(localSearchQuery);
    }
  };
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Far Left */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2 flex-shrink-0"
          >
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Foine
            </span>
          </motion.div>

          {/* Search Bar - Centered */}
          <div className="hidden md:flex flex-1 justify-center px-8">
            <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md">
              <input
                type="text"
                value={localSearchQuery}
                onChange={handleSearchChange}
                placeholder="Search images, tags, users..."
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button type="submit" className="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg className="w-5 h-5 text-gray-400 hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>

          {/* Desktop Actions - Far Right */}
          <div className="hidden md:flex items-center space-x-4 flex-shrink-0">
            {user ? (
              <>
                {/* Upload Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onUploadClick}
                  className="btn-primary flex items-center space-x-2"
                >
                  <FiUpload className="w-4 h-4" />
                  <span>Upload</span>
                </motion.button>

                {/* User Menu */}
                <div
                  className="relative"
                  onMouseEnter={() => {
                    if (closeTimeoutRef.current) {
                      clearTimeout(closeTimeoutRef.current);
                      closeTimeoutRef.current = null;
                    }
                    setIsDropdownOpen(true);
                  }}
                  onMouseLeave={() => {
                    closeTimeoutRef.current = setTimeout(() => {
                      setIsDropdownOpen(false);
                    }, 200); // 200ms delay
                  }}
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    <FiUser className="w-4 h-4" />
                    <span className="hidden sm:block">{user.email}</span>
                  </motion.button>

                  {/* Dropdown */}
                  <div
                    className={`absolute right-0 mt-2 w-48 bg-background/95 backdrop-blur-md border border-white/20 rounded-lg shadow-glass transition-opacity duration-200 ${isDropdownOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                  >
                    <div className="py-2">
                      <button className="flex items-center space-x-2 w-full px-4 py-2 text-sm hover:bg-white/10 transition-colors">
                        <FiSettings className="w-4 h-4" />
                        <span>Settings</span>
                      </button>
                      <button
                        onClick={onLogout}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm hover:bg-white/10 transition-colors text-red-400"
                      >
                        <FiLogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onLoginClick}
                  className="btn-secondary"
                >
                  Login
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onRegisterClick}
                  className="btn-primary"
                >
                  Sign Up
                </motion.button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={localSearchQuery}
              onChange={handleSearchChange}
              placeholder="Search images, tags, users..."
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button type="submit" className="absolute inset-y-0 right-0 flex items-center pr-3">
              <svg className="w-5 h-5 text-gray-400 hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/10"
            >
              <div className="py-4 space-y-2">
                {user ? (
                  <>
                    <button
                      onClick={() => {
                        onUploadClick();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                    >
                      <FiUpload className="w-5 h-5" />
                      <span>Upload Image</span>
                    </button>
                    <button
                      onClick={() => {
                        onLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-3 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors"
                    >
                      <FiLogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        onLoginClick();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => {
                        onRegisterClick();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                    >
                      Sign Up
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header;