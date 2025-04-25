import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, Sun, Moon, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  // Close mobile menu when location changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const navLinks = [
    { title: 'Home', path: '/' },
    { title: 'Projects', path: '/projects' },
    { title: 'Certifications', path: '/certifications' },
    { title: 'Contact', path: '/contact' },
  ];

  const headerClass = cn(
    'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
    scrolled 
      ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-lg border-b border-gray-200 dark:border-gray-800 py-3' 
      : 'bg-transparent py-5'
  );

  return (
    <header className={headerClass}>
      <div className="container mx-auto px-6">
        <nav className="flex items-center justify-between">
          <Link 
            to="/" 
            className="text-2xl font-bold relative group"
          >
            <span className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 text-transparent bg-clip-text transition-all duration-300">
              VP
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 transition-all duration-300 group-hover:w-full"></span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  cn(
                    'px-4 py-2 rounded-lg font-medium transition-all duration-200',
                    isActive
                      ? 'text-blue-600 dark:text-blue-400 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 shadow-sm'
                      : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50/30 dark:hover:from-gray-800/50 dark:hover:to-blue-900/30'
                  )
                }
              >
                {link.title}
              </NavLink>
            ))}

            {isAuthenticated && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  cn(
                    'px-4 py-2 rounded-lg font-medium transition-all duration-200',
                    isActive
                      ? 'text-blue-600 dark:text-blue-400 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 shadow-sm'
                      : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50/30 dark:hover:from-gray-800/50 dark:hover:to-blue-900/30'
                  )
                }
              >
                Admin
              </NavLink>
            )}

            {!isAuthenticated && (
              <Link
                to="/admin/login"
                className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50/30 dark:hover:from-gray-800/50 dark:hover:to-blue-900/30 transition-colors ml-2"
                aria-label="Login"
              >
                <User size={20} />
              </Link>
            )}

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50/30 dark:hover:from-gray-800/50 dark:hover:to-blue-900/30 transition-colors ml-2"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50/30 dark:hover:from-gray-800/50 dark:hover:to-blue-900/30 transition-colors mr-2"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50/30 dark:hover:from-gray-800/50 dark:hover:to-blue-900/30 transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden py-4"
          >
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    cn(
                      'px-4 py-2 rounded-lg font-medium transition-all duration-200',
                      isActive
                        ? 'text-blue-600 dark:text-blue-400 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 shadow-sm'
                        : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50/30 dark:hover:from-gray-800/50 dark:hover:to-blue-900/30'
                    )
                  }
                >
                  {link.title}
                </NavLink>
              ))}

              {isAuthenticated && (
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    cn(
                      'px-4 py-2 rounded-lg font-medium transition-all duration-200',
                      isActive
                        ? 'text-blue-600 dark:text-blue-400 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 shadow-sm'
                        : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50/30 dark:hover:from-gray-800/50 dark:hover:to-blue-900/30'
                    )
                  }
                >
                  Admin
                </NavLink>
              )}

              {!isAuthenticated && (
                <Link
                  to="/admin/login"
                  className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50/30 dark:hover:from-gray-800/50 dark:hover:to-blue-900/30 transition-colors ml-2"
                  aria-label="Login"
                >
                  <User size={20} />
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header;