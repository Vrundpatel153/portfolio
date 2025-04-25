import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/UI/Button';
import { Card, CardBody } from '../components/UI/Card';
import { motion } from 'framer-motion';
import { LogOut, User, Award, Briefcase, Settings, Lock } from 'lucide-react';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';
import ProfileForm from '../components/Profile/ProfileForm';
import { toast } from 'react-toastify';

interface UserProfile {
  full_name?: string;
  bio?: string;
  avatar_url?: string;
  location?: string;
  website_url?: string;
  github_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
}

const AdminDashboard: React.FC = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .single();

      if (error) throw error;
      setProfile(data || {});
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
      setIsLoggingOut(false);
    }
  };

  const handleProfileUpdate = async () => {
    await fetchProfile();
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const currentPassword = form.currentPassword.value;
    const newPassword = form.newPassword.value;
    const confirmPassword = form.confirmPassword.value;

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast.success('Password updated successfully');
      form.reset();
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error('Failed to update password');
    }
  };

  const navItems = [
    { name: 'Profile', path: '/admin', icon: <User size={20} /> },
    { name: 'Projects', path: '/admin/projects', icon: <Briefcase size={20} /> },
    { name: 'Certifications', path: '/admin/certifications', icon: <Award size={20} /> },
    { name: 'Settings', path: '/admin/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="pt-28 pb-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          <motion.div 
            className="md:w-64 flex-shrink-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardBody>
                <div className="mb-6 text-center">
                  <div className="relative w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden border-2 border-blue-600 dark:border-blue-400">
                    <img
                      src={profile?.avatar_url || 'https://ui-avatars.com/api/?name=User'}
                      alt="Admin avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    {profile?.full_name || user?.email?.split('@')[0] || 'Admin User'}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {user?.email || 'admin@example.com'}
                  </p>
                </div>
                
                <div className="space-y-1">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.path === '/admin'}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center px-4 py-2 rounded-md transition-colors',
                          isActive
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                        )
                      }
                    >
                      <span className="mr-3">{item.icon}</span>
                      <span>{item.name}</span>
                    </NavLink>
                  ))}
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    variant="outline"
                    className="w-full"
                    leftIcon={<LogOut size={18} />}
                    onClick={handleLogout}
                    isLoading={isLoggingOut}
                  >
                    Log Out
                  </Button>
                </div>
              </CardBody>
            </Card>
          </motion.div>
          
          <motion.div 
            className="flex-grow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Routes>
              <Route path="/" element={<AdminProfile profile={profile} onUpdate={handleProfileUpdate} />} />
              <Route path="/projects" element={<AdminProjects />} />
              <Route path="/certifications" element={<AdminCertifications />} />
              <Route path="/settings" element={<AdminSettings onPasswordChange={handlePasswordChange} />} />
            </Routes>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const AdminProfile: React.FC<{ profile: UserProfile | null; onUpdate: () => void }> = ({ profile, onUpdate }) => {
  return (
    <ProfileForm profile={profile || {}} onUpdate={onUpdate} />
  );
};

const AdminProjects: React.FC = () => {
  return (
    <Card>
      <CardBody>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Manage Projects
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          From here you can add, edit, or delete your projects. To get started, visit the Projects page
          and use the admin controls there.
        </p>
        <Button as="a" href="/projects">
          Go to Projects Page
        </Button>
      </CardBody>
    </Card>
  );
};

const AdminCertifications: React.FC = () => {
  return (
    <Card>
      <CardBody>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Manage Certifications
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          From here you can add, edit, or delete your certifications. To get started, visit the Certifications page
          and use the admin controls there.
        </p>
        <Button as="a" href="/certifications">
          Go to Certifications Page
        </Button>
      </CardBody>
    </Card>
  );
};

const AdminSettings: React.FC<{ onPasswordChange: (e: React.FormEvent) => void }> = ({ onPasswordChange }) => {
  return (
    <Card>
      <CardBody>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Account Settings
        </h2>
        <form onSubmit={onPasswordChange} className="space-y-4">
          <div>
            <label
              htmlFor="currentPassword"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Current Password
            </label>
            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              required
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              New Password
            </label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              required
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
            />
          </div>
          <Button type="submit" leftIcon={<Lock size={18} />}>
            Change Password
          </Button>
        </form>
      </CardBody>
    </Card>
  );
};

export default AdminDashboard;