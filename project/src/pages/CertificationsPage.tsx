import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Card, CardBody, CardFooter } from '../components/UI/Card';
import Button from '../components/UI/Button';
import { Plus, Edit, Trash2, Calendar, Award } from 'lucide-react';
import CertificationForm from '../components/Certifications/CertificationForm';
import { formatDate } from '../lib/utils';

interface Certification {
  id: string;
  title: string;
  issuer: string;
  date_issued: string;
  credential_url?: string;
  image_url?: string;
  description?: string;
}

const CertificationsPage: React.FC = () => {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingCertification, setIsAddingCertification] = useState(false);
  const [editingCertification, setEditingCertification] = useState<Certification | null>(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchCertifications();
  }, []);

  const fetchCertifications = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('certifications')
        .select('*')
        .order('date_issued', { ascending: false });
      
      if (error) throw error;
      
      if (data) {
        setCertifications(data);
      }
    } catch (error) {
      console.error('Error fetching certifications:', error);
      // Use placeholder data if there's an error
      setCertifications([
        {
          id: '1',
          title: 'Full-Stack Web Development',
          issuer: 'Udemy',
          date_issued: '2023-04-15',
          credential_url: 'https://example.com/credential/123',
          image_url: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg',
          description: 'Comprehensive course covering modern web development techniques and best practices.'
        },
        {
          id: '2',
          title: 'Advanced React & Redux',
          issuer: 'Coursera',
          date_issued: '2022-11-20',
          credential_url: 'https://example.com/credential/456',
          image_url: 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg',
          description: 'Advanced concepts in React and state management with Redux.'
        },
        {
          id: '3',
          title: 'Machine Learning Fundamentals',
          issuer: 'edX',
          date_issued: '2022-06-10',
          credential_url: 'https://example.com/credential/789',
          image_url: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg',
          description: 'Introduction to machine learning algorithms and applications.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCertification = async (certification: Omit<Certification, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('certifications')
        .insert([certification])
        .select();
      
      if (error) throw error;
      
      if (data) {
        setCertifications([data[0], ...certifications]);
        setIsAddingCertification(false);
      }
    } catch (error) {
      console.error('Error adding certification:', error);
    }
  };

  const handleUpdateCertification = async (updatedCertification: Certification) => {
    try {
      const { error } = await supabase
        .from('certifications')
        .update(updatedCertification)
        .eq('id', updatedCertification.id);
      
      if (error) throw error;
      
      setCertifications(certifications.map(certification => 
        certification.id === updatedCertification.id ? updatedCertification : certification
      ));
      setEditingCertification(null);
    } catch (error) {
      console.error('Error updating certification:', error);
    }
  };

  const handleDeleteCertification = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this certification?')) return;
    
    try {
      const { error } = await supabase
        .from('certifications')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setCertifications(certifications.filter(certification => certification.id !== id));
    } catch (error) {
      console.error('Error deleting certification:', error);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="pt-28 pb-16">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Certifications</h1>
          
          {isAuthenticated && (
            <Button 
              onClick={() => {
                setIsAddingCertification(true);
                setEditingCertification(null);
              }}
              leftIcon={<Plus size={16} />}
            >
              Add Certification
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {(isAddingCertification || editingCertification) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-8"
              >
                <CertificationForm
                  certification={editingCertification}
                  onSubmit={editingCertification ? handleUpdateCertification : handleAddCertification}
                  onCancel={() => {
                    setIsAddingCertification(false);
                    setEditingCertification(null);
                  }}
                />
              </motion.div>
            )}
            
            {certifications.length > 0 ? (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={container}
                initial="hidden"
                animate="show"
              >
                {certifications.map(certification => (
                  <motion.div key={certification.id} variants={item}>
                    <Card className="h-full flex flex-col">
                      {certification.image_url && (
                        <div className="relative h-40 overflow-hidden rounded-t-lg">
                          <img
                            src={certification.image_url}
                            alt={certification.title}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          />
                          {isAuthenticated && (
                            <div className="absolute top-2 right-2 flex space-x-1">
                              <button
                                onClick={() => setEditingCertification(certification)}
                                className="p-2 bg-white dark:bg-gray-800 rounded-full shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                aria-label="Edit certification"
                              >
                                <Edit size={16} className="text-gray-700 dark:text-gray-300" />
                              </button>
                              <button
                                onClick={() => handleDeleteCertification(certification.id)}
                                className="p-2 bg-white dark:bg-gray-800 rounded-full shadow hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
                                aria-label="Delete certification"
                              >
                                <Trash2 size={16} className="text-gray-700 dark:text-gray-300" />
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <CardBody className={`flex-grow ${!certification.image_url ? 'pt-6' : ''}`}>
                        <div className="mb-4">
                          <div className="flex justify-between items-start mb-2">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                              {certification.title}
                            </h2>
                            <Award className="text-blue-600 dark:text-blue-400 ml-2 flex-shrink-0" size={20} />
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">
                            {certification.issuer}
                          </p>
                        </div>
                        
                        {certification.description && (
                          <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                            {certification.description}
                          </p>
                        )}
                        
                        <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                          <Calendar size={16} className="mr-1" />
                          <span>{formatDate(certification.date_issued)}</span>
                        </div>
                      </CardBody>
                      
                      {certification.credential_url && (
                        <CardFooter>
                          <a
                            href={certification.credential_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                          >
                            View Credential
                          </a>
                        </CardFooter>
                      )}
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">No certifications found.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CertificationsPage;