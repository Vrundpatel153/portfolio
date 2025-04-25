import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Download, Github, Linkedin } from 'lucide-react';
import Button from '../components/UI/Button';
import SkillsSection from '../components/Sections/SkillsSection';
import { supabase } from '../lib/supabase';
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

const HomePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .limit(1)  // Get the first (admin) profile
        .single();

      if (error) throw error;
      setProfile(data || {});
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadResume = async () => {
    setIsDownloading(true);
    try {
      const { data, error } = await supabase.storage
        .from('resume')
        .download('resume.pdf');

      if (error) throw error;

      // Create a URL for the downloaded file
      const url = window.URL.createObjectURL(data);
      
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Vrund_Patel_Resume.pdf');
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      // Clean up the URL
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading resume:', error);
      toast.error('Failed to download resume. Please try again later.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-white via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-full blur-3xl"></div>
          <div className="absolute top-20 -left-40 w-80 h-80 bg-gradient-to-br from-blue-100 to-teal-100 dark:from-blue-900/20 dark:to-teal-900/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative container mx-auto px-6 pt-32 pb-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="flex-1 max-w-2xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-tight">
                  Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400">{profile?.full_name || 'Vrund Patel'}</span>
                </h1>
                <h2 className="text-2xl md:text-3xl font-medium bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-300 dark:to-white bg-clip-text text-transparent">
                  Full-Stack Engineer
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                  {profile?.bio || 'B.Tech in Computer Engineering with expertise in building modern web applications. Passionate about creating beautiful, user-friendly experiences with cutting-edge technologies.'}
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <Button 
                    variant="primary" 
                    size="lg"
                    rightIcon={<Download size={18} />}
                    onClick={handleDownloadResume}
                    isLoading={isDownloading}
                    className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 dark:from-blue-500 dark:via-indigo-500 dark:to-purple-500 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Download Resume
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    leftIcon={<Github size={18} />}
                    onClick={() => window.open('https://github.com/Vrundpatel153', '_blank')}
                    className="border-2 border-gray-300 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    GitHub
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    leftIcon={<Linkedin size={18} />}
                    onClick={() => window.open('https://www.linkedin.com/in/vrund-patel-73a239284', '_blank')}
                    className="border-2 border-gray-300 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    LinkedIn
                  </Button>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <div className="relative w-72 h-72 md:w-96 md:h-96">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-full blur-2xl opacity-20 dark:opacity-40 animate-pulse"></div>
                <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-2xl bg-gradient-to-br from-gray-100 to-white dark:from-gray-800 dark:to-gray-900">
                  <img
                    src={profile?.avatar_url || 'https://ui-avatars.com/api/?name=User'}
                    alt={profile?.full_name || 'Vrund Patel'}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div 
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: [0, -10, 0],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <a 
              href="#about" 
              className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <ArrowDown size={24} className="text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 mb-8 text-center">
              About Me
            </h2>
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 md:p-12 border border-gray-200 dark:border-gray-700">
              <div className="space-y-6 text-lg">
                <p className="text-gray-600 dark:text-gray-300">
                  {profile?.bio || "I'm a passionate Full-Stack Engineer with a B.Tech in Computer Engineering. My journey in software development began during my university years, and I've been building modern web applications ever since."}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  I specialize in creating responsive, user-friendly applications using modern JavaScript frameworks 
                  like React.js, along with backend technologies including Node.js, Express, and various database systems.
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  When I'm not coding, you can find me exploring new technologies, contributing to open-source projects, 
                  or sharing my knowledge through technical blog posts and community discussions.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Skills Section */}
      <SkillsSection />
    </div>
  );
};

export default HomePage;