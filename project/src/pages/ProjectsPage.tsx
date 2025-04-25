import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Card, CardBody, CardFooter } from '../components/UI/Card';
import Button from '../components/UI/Button';
import { Plus, Edit, Trash2, ExternalLink, Github } from 'lucide-react';
import ProjectForm from '../components/Projects/ProjectForm';

interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string;
  live_url?: string;
  repo_url?: string;
  technologies: string[];
  created_at: string;
}

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (data) {
        setProjects(data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      // Use placeholder data if there's an error
      setProjects([
        {
          id: '1',
          title: 'E-Commerce Dashboard',
          description: 'A comprehensive dashboard for e-commerce businesses with analytics, inventory management, and order processing.',
          image_url: 'https://images.pexels.com/photos/38568/apple-imac-ipad-workplace-38568.jpeg',
          live_url: 'https://example.com',
          repo_url: 'https://github.com/',
          technologies: ['React', 'Node.js', 'MongoDB', 'Chart.js'],
          created_at: '2023-01-15'
        },
        {
          id: '2',
          title: 'Task Management App',
          description: 'A productivity application with task tracking, due dates, and project organization features.',
          image_url: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg',
          live_url: 'https://example.com',
          repo_url: 'https://github.com/',
          technologies: ['Vue.js', 'Express', 'PostgreSQL'],
          created_at: '2022-11-10'
        },
        {
          id: '3',
          title: 'Weather Forecast App',
          description: 'Real-time weather information with 7-day forecasts, location-based services, and customizable alerts.',
          image_url: 'https://images.pexels.com/photos/1261728/pexels-photo-1261728.jpeg',
          technologies: ['React Native', 'Firebase', 'OpenWeather API'],
          created_at: '2022-08-22'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProject = async (project: Omit<Project, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([project])
        .select();
      
      if (error) throw error;
      
      if (data) {
        setProjects([data[0], ...projects]);
        setIsAddingProject(false);
      }
    } catch (error) {
      console.error('Error adding project:', error);
    }
  };

  const handleUpdateProject = async (updatedProject: Project) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update(updatedProject)
        .eq('id', updatedProject.id);
      
      if (error) throw error;
      
      setProjects(projects.map(project => 
        project.id === updatedProject.id ? updatedProject : project
      ));
      setEditingProject(null);
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setProjects(projects.filter(project => project.id !== id));
    } catch (error) {
      console.error('Error deleting project:', error);
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Projects</h1>
          
          {isAuthenticated && (
            <Button 
              onClick={() => {
                setIsAddingProject(true);
                setEditingProject(null);
              }}
              leftIcon={<Plus size={16} />}
            >
              Add Project
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {(isAddingProject || editingProject) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-8"
              >
                <ProjectForm
                  project={editingProject}
                  onSubmit={editingProject ? handleUpdateProject : handleAddProject}
                  onCancel={() => {
                    setIsAddingProject(false);
                    setEditingProject(null);
                  }}
                />
              </motion.div>
            )}
            
            {projects.length > 0 ? (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={container}
                initial="hidden"
                animate="show"
              >
                {projects.map(project => (
                  <motion.div key={project.id} variants={item}>
                    <Card className="h-full flex flex-col">
                      <div className="relative h-48 overflow-hidden rounded-t-lg">
                        <img
                          src={project.image_url || 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg'}
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                        {isAuthenticated && (
                          <div className="absolute top-2 right-2 flex space-x-1">
                            <button
                              onClick={() => setEditingProject(project)}
                              className="p-2 bg-white dark:bg-gray-800 rounded-full shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                              aria-label="Edit project"
                            >
                              <Edit size={16} className="text-gray-700 dark:text-gray-300" />
                            </button>
                            <button
                              onClick={() => handleDeleteProject(project.id)}
                              className="p-2 bg-white dark:bg-gray-800 rounded-full shadow hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
                              aria-label="Delete project"
                            >
                              <Trash2 size={16} className="text-gray-700 dark:text-gray-300" />
                            </button>
                          </div>
                        )}
                      </div>
                      <CardBody className="flex-grow">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                          {project.title}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          {project.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.technologies?.map((tech, index) => (
                            <span
                              key={index}
                              className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </CardBody>
                      <CardFooter className="flex justify-between items-center">
                        <div className="flex space-x-2">
                          {project.live_url && (
                            <a
                              href={project.live_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                              aria-label="Live Demo"
                            >
                              <ExternalLink size={18} />
                            </a>
                          )}
                          {project.repo_url && (
                            <a
                              href={project.repo_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                              aria-label="GitHub Repository"
                            >
                              <Github size={18} />
                            </a>
                          )}
                        </div>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">No projects found.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;