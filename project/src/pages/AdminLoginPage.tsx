import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, CardHeader, CardBody, CardFooter } from '../components/UI/Card';
import Button from '../components/UI/Button';
import { motion } from 'framer-motion';
import { LogIn } from 'lucide-react';

const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { error } = await login(email, password);
      
      if (error) {
        throw error;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to login. Please check your credentials.');
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="max-w-md w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <h2 className="text-center text-2xl font-bold text-gray-900 dark:text-white">
              Admin Login
            </h2>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardBody className="space-y-6">
              {error && (
                <div className="bg-red-100 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded-md p-3">
                  <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
                </div>
              )}
              
              <div>
                <label 
                  htmlFor="email" 
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                  placeholder="admin@example.com"
                />
              </div>
              
              <div>
                <label 
                  htmlFor="password" 
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                  placeholder="••••••••"
                />
              </div>
            </CardBody>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full"
                isLoading={isLoading}
                leftIcon={<LogIn size={18} />}
              >
                Sign in
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            This page is for admin access only. To create an account, please connect to Supabase and set up authentication.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLoginPage;