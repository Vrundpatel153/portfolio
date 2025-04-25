import React, { useState } from 'react';
import { Card, CardHeader, CardBody, CardFooter } from '../UI/Card';
import Button from '../UI/Button';
import { X, Plus, Upload } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-toastify';

interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string;
  live_url?: string;
  repo_url?: string;
  technologies: string[];
}

interface ProjectFormProps {
  project?: Project;
  onSubmit: (project: Omit<Project, 'id' | 'created_at'>) => Promise<void>;
  onCancel: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ project, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: project?.title || '',
    description: project?.description || '',
    image_url: project?.image_url || '',
    live_url: project?.live_url || '',
    repo_url: project?.repo_url || '',
    technologies: project?.technologies || ['']
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTechChange = (index: number, value: string) => {
    const newTechnologies = [...formData.technologies];
    newTechnologies[index] = value;
    setFormData(prev => ({ ...prev, technologies: newTechnologies }));
  };

  const addTechnology = () => {
    setFormData(prev => ({
      ...prev,
      technologies: [...prev.technologies, '']
    }));
  };

  const removeTechnology = (index: number) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter((_, i) => i !== index)
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }
      setImageFile(file);
    }
  };

  const uploadProjectImage = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;

      // Delete old image if exists and updating
      if (project?.image_url) {
        const oldFileName = project.image_url.split('/').pop();
        if (oldFileName) {
          await supabase.storage
            .from('project-images')
            .remove([oldFileName]);
        }
      }

      // Upload new image
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('project-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('project-images')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading project image:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imageUrl = formData.image_url;

      if (imageFile) {
        imageUrl = await uploadProjectImage(imageFile);
      }

      await onSubmit({
        ...formData,
        image_url: imageUrl,
        technologies: formData.technologies.filter(tech => tech.trim() !== '')
      });

      toast.success(`Project ${project ? 'updated' : 'added'} successfully`);
    } catch (error) {
      console.error('Error submitting project:', error);
      toast.error(`Failed to ${project ? 'update' : 'add'} project`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {project ? 'Edit Project' : 'Add New Project'}
        </h2>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardBody className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Project Image *
            </label>
            <div className="flex items-center space-x-4">
              {(imageFile || formData.image_url) && (
                <div className="w-32 h-24 relative">
                  <img
                    src={imageFile ? URL.createObjectURL(imageFile) : formData.image_url}
                    alt="Project preview"
                    className="w-full h-full object-cover rounded"
                  />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="project-image"
              />
              <Button
                type="button"
                variant="outline"
                leftIcon={<Upload size={16} />}
                onClick={() => document.getElementById('project-image')?.click()}
              >
                {formData.image_url ? 'Change Image' : 'Upload Image'}
              </Button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
              placeholder="Project title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
              placeholder="Project description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Live URL
            </label>
            <input
              type="url"
              name="live_url"
              value={formData.live_url}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
              placeholder="https://your-project.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Repository URL
            </label>
            <input
              type="url"
              name="repo_url"
              value={formData.repo_url}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
              placeholder="https://github.com/username/project"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Technologies *
            </label>
            {formData.technologies.map((tech, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={tech}
                  onChange={e => handleTechChange(index, e.target.value)}
                  className="flex-grow p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., React, Node.js"
                />
                <button
                  type="button"
                  onClick={() => removeTechnology(index)}
                  className="ml-2 p-2 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                  disabled={formData.technologies.length <= 1}
                >
                  <X size={18} />
                </button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              leftIcon={<Plus size={16} />}
              onClick={addTechnology}
              className="mt-2"
            >
              Add Technology
            </Button>
          </div>
        </CardBody>
        <CardFooter className="flex justify-end space-x-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {project ? 'Update Project' : 'Add Project'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ProjectForm;