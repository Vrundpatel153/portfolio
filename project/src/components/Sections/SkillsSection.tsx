import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { Plus, Edit, Trash2, Save, X, Upload } from 'lucide-react';
import Button from '../UI/Button';
import { toast } from 'react-toastify';

interface Skill {
  id: string;
  name: string;
  icon_url: string;
  category: string;
}

const SkillsSection: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [newSkill, setNewSkill] = useState({ name: '', icon_url: '', category: 'frontend' });
  const [newIconFile, setNewIconFile] = useState<File | null>(null);
  const [editingIconFile, setEditingIconFile] = useState<File | null>(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.from('skills').select('*').order('category');
      
      if (error) throw error;
      
      if (data) {
        setSkills(data);
      }
    } catch (error) {
      console.error('Error fetching skills:', error);
      // Use placeholder data if there's an error
      setSkills([
        { id: '1', name: 'React', icon_url: 'https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/react/react.png', category: 'frontend' },
        { id: '2', name: 'TypeScript', icon_url: 'https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/typescript/typescript.png', category: 'frontend' },
        { id: '3', name: 'Node.js', icon_url: 'https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/nodejs/nodejs.png', category: 'backend' },
        { id: '4', name: 'MongoDB', icon_url: 'https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/mongodb/mongodb.png', category: 'backend' },
        { id: '5', name: 'Python', icon_url: 'https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/python/python.png', category: 'programming' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const uploadSkillIcon = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('skill-icons')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('skill-icons')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading skill icon:', error);
      throw error;
    }
  };

  const deleteSkillIcon = async (iconUrl: string) => {
    try {
      const fileName = iconUrl.split('/').pop();
      if (!fileName) return;

      const { error } = await supabase.storage
        .from('skill-icons')
        .remove([fileName]);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting skill icon:', error);
    }
  };

  const addSkill = async () => {
    if (!newSkill.name) {
      toast.error('Please enter a skill name');
      return;
    }
    
    try {
      let iconUrl = '';
      if (newIconFile) {
        iconUrl = await uploadSkillIcon(newIconFile);
      }

      const skillData = {
        ...newSkill,
        icon_url: iconUrl
      };

      const { data, error } = await supabase
        .from('skills')
        .insert([skillData])
        .select();
        
      if (error) throw error;
      
      if (data) {
        setSkills([...skills, data[0]]);
        setNewSkill({ name: '', icon_url: '', category: 'frontend' });
        setNewIconFile(null);
        toast.success('Skill added successfully');
      }
    } catch (error) {
      console.error('Error adding skill:', error);
      toast.error('Failed to add skill');
    }
  };

  const updateSkill = async () => {
    if (!editingSkill) return;
    
    try {
      let iconUrl = editingSkill.icon_url;

      // If a new icon is selected, upload it and delete the old one
      if (editingIconFile) {
        // Delete old icon if it exists
        if (editingSkill.icon_url) {
          await deleteSkillIcon(editingSkill.icon_url);
        }
        // Upload new icon
        iconUrl = await uploadSkillIcon(editingIconFile);
      }

      const updatedSkill = {
        ...editingSkill,
        icon_url: iconUrl
      };

      const { error } = await supabase
        .from('skills')
        .update(updatedSkill)
        .eq('id', editingSkill.id);
        
      if (error) throw error;
      
      setSkills(skills.map(skill => 
        skill.id === editingSkill.id ? updatedSkill : skill
      ));
      setEditingSkill(null);
      setEditingIconFile(null);
      toast.success('Skill updated successfully');
    } catch (error) {
      console.error('Error updating skill:', error);
      toast.error('Failed to update skill');
    }
  };

  const deleteSkill = async (id: string) => {
    try {
      const skillToDelete = skills.find(skill => skill.id === id);
      if (!skillToDelete) return;

      // Delete the icon first
      if (skillToDelete.icon_url) {
        await deleteSkillIcon(skillToDelete.icon_url);
      }

      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setSkills(skills.filter(skill => skill.id !== id));
      toast.success('Skill deleted successfully');
    } catch (error) {
      console.error('Error deleting skill:', error);
      toast.error('Failed to delete skill');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isEditing = false) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast.error('Image size should be less than 2MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }
      if (isEditing) {
        setEditingIconFile(file);
      } else {
        setNewIconFile(file);
      }
    }
  };

  const categories = [
    { id: 'frontend', name: 'Frontend' },
    { id: 'backend', name: 'Backend' },
    { id: 'programming', name: 'Programming Languages' },
    { id: 'design', name: 'Design' },
    { id: 'tools', name: 'Tools & Others' }
  ];

  // Group skills by category
  const skillsByCategory = categories.map(category => ({
    ...category,
    skills: skills.filter(skill => skill.category === category.id)
  }));

  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 flex justify-between items-center">
          <motion.h2 
            className="text-3xl font-bold text-gray-900 dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Skills & Technologies
          </motion.h2>
          
          {isAuthenticated && (
            <Button 
              variant="outline" 
              leftIcon={isEditing ? <X size={16} /> : <Edit size={16} />}
              onClick={() => {
                setIsEditing(!isEditing);
                setEditingSkill(null);
                setEditingIconFile(null);
                setNewIconFile(null);
              }}
            >
              {isEditing ? 'Cancel Editing' : 'Edit Skills'}
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {skillsByCategory.map((category, index) => (
              category.skills.length > 0 && (
                <motion.div 
                  key={category.id}
                  className="mb-10"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                    {category.name}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {category.skills.map(skill => (
                      <div 
                        key={skill.id}
                        className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 flex ${
                          isEditing ? 'flex-col' : 'items-center'
                        } transition-all duration-300 hover:shadow-md`}
                      >
                        {isEditing && editingSkill?.id === skill.id ? (
                          <div className="space-y-2 w-full">
                            <input
                              type="text"
                              value={editingSkill.name}
                              onChange={e => setEditingSkill({...editingSkill, name: e.target.value})}
                              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                              placeholder="Skill name"
                            />
                            <div className="flex items-center space-x-2">
                              <div className="w-12 h-12 relative">
                                <img
                                  src={editingIconFile ? URL.createObjectURL(editingIconFile) : editingSkill.icon_url}
                                  alt={editingSkill.name}
                                  className="w-full h-full object-contain rounded"
                                />
                              </div>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={e => handleFileChange(e, true)}
                                className="hidden"
                                id={`edit-icon-${skill.id}`}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => document.getElementById(`edit-icon-${skill.id}`)?.click()}
                              >
                                Change Icon
                              </Button>
                            </div>
                            <select
                              value={editingSkill.category}
                              onChange={e => setEditingSkill({...editingSkill, category: e.target.value})}
                              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                            >
                              {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                              ))}
                            </select>
                            <div className="flex space-x-2">
                              <Button 
                                onClick={updateSkill} 
                                variant="primary" 
                                size="sm" 
                                leftIcon={<Save size={14} />}
                              >
                                Save
                              </Button>
                              <Button 
                                onClick={() => {
                                  setEditingSkill(null);
                                  setEditingIconFile(null);
                                }} 
                                variant="outline" 
                                size="sm"
                                leftIcon={<X size={14} />}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className={`${isEditing ? 'flex justify-between w-full' : ''}`}>
                              <div className={`${isEditing ? '' : 'flex items-center'}`}>
                                <div className="w-8 h-8 mr-2 flex-shrink-0">
                                  <img
                                    src={skill.icon_url}
                                    alt={skill.name}
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                                <span className="text-gray-800 dark:text-gray-200">{skill.name}</span>
                              </div>
                              
                              {isEditing && (
                                <div className="flex space-x-1">
                                  <button
                                    onClick={() => setEditingSkill(skill)}
                                    className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                                  >
                                    <Edit size={16} />
                                  </button>
                                  <button
                                    onClick={() => deleteSkill(skill.id)}
                                    className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )
            ))}

            {isEditing && (
              <motion.div 
                className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                  Add New Skill
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={newSkill.name}
                    onChange={e => setNewSkill({...newSkill, name: e.target.value})}
                    className="p-3 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                    placeholder="Skill name"
                  />
                  <select
                    value={newSkill.category}
                    onChange={e => setNewSkill({...newSkill, category: e.target.value})}
                    className="p-3 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div className="mt-4 flex items-center space-x-4">
                  {newIconFile && (
                    <div className="w-12 h-12">
                      <img
                        src={URL.createObjectURL(newIconFile)}
                        alt="New skill icon preview"
                        className="w-full h-full object-contain rounded"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => handleFileChange(e, false)}
                    className="hidden"
                    id="new-skill-icon"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    leftIcon={<Upload size={16} />}
                    onClick={() => document.getElementById('new-skill-icon')?.click()}
                  >
                    Upload Icon
                  </Button>
                  <Button 
                    onClick={addSkill} 
                    leftIcon={<Plus size={16} />}
                    disabled={!newSkill.name || !newIconFile}
                  >
                    Add Skill
                  </Button>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default SkillsSection;