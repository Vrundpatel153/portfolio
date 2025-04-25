import React, { useState } from 'react';
import { Card, CardHeader, CardBody, CardFooter } from '../UI/Card';
import Button from '../UI/Button';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

interface ProfileFormProps {
  profile: {
    full_name?: string;
    bio?: string;
    avatar_url?: string;
    location?: string;
    website_url?: string;
    github_url?: string;
    linkedin_url?: string;
    twitter_url?: string;
  };
  onUpdate: () => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ profile, onUpdate }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    bio: profile?.bio || '',
    location: profile?.location || 'Vadodara, Gujarat, India',
    website_url: profile?.website_url || '',
    github_url: profile?.github_url || 'https://github.com/Vrundpatel153',
    linkedin_url: profile?.linkedin_url || 'https://www.linkedin.com/in/vrund-patel-73a239284',
    twitter_url: profile?.twitter_url || 'https://x.com/VrundPatel1535',
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!user) throw new Error('No authenticated user');

      let avatarUrl = profile?.avatar_url;

      // Upload new avatar if selected
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;

        // Delete old avatar if exists and is not the default avatar
        if (profile?.avatar_url && !profile.avatar_url.includes('ui-avatars.com')) {
          try {
            const oldFilePath = new URL(profile.avatar_url).pathname.split('/').pop();
            if (oldFilePath) {
              const { error: deleteError } = await supabase.storage
                .from('avatars')
                .remove([oldFilePath]);
              
              if (deleteError) {
                console.error('Error deleting old avatar:', deleteError);
              }
            }
          } catch (error) {
            console.error('Error parsing old avatar URL:', error);
          }
        }

        console.log('Uploading new avatar:', fileName);
        // Upload new avatar
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, avatarFile, {
            cacheControl: '3600',
            upsert: true
          });

        if (uploadError) {
          console.error('Upload error details:', uploadError);
          throw uploadError;
        }

        if (uploadData) {
          console.log('Upload successful:', uploadData);
          const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(fileName);

          avatarUrl = publicUrl;
          console.log('New avatar URL:', avatarUrl);
        }
      }

      // Log the profile data we're about to update
      const profileData = {
        user_id: user.id,
        ...formData,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      };
      console.log('Updating profile with data:', profileData);

      // First try to update existing profile
      const { data: updateData, error: updateError } = await supabase
        .from('user_profiles')
        .update(profileData)
        .eq('user_id', user.id)
        .select()
        .single();

      if (updateError) {
        // If update fails (profile doesn't exist), try to insert
        console.log('Update failed, attempting insert');
        const { data: insertData, error: insertError } = await supabase
          .from('user_profiles')
          .insert(profileData)
          .select()
          .single();

        if (insertError) {
          console.error('Insert error details:', insertError);
          throw insertError;
        }

        console.log('Profile insert successful:', insertData);
      } else {
        console.log('Profile update successful:', updateData);
      }

      toast.success('Profile updated successfully!');
      onUpdate();
    } catch (error: any) {
      console.error('Full error details:', {
        error,
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      toast.error(error.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Profile Settings
        </h2>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardBody className="space-y-4">
          <div>
            <label
              htmlFor="avatar"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Profile Photo
            </label>
            <div className="flex items-center space-x-4">
              <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-blue-600 dark:border-blue-400">
                <img
                  src={avatarFile ? URL.createObjectURL(avatarFile) : profile?.avatar_url || 'https://ui-avatars.com/api/?name=User'}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <input
                id="avatar"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('avatar')?.click()}
              >
                Change Photo
              </Button>
            </div>
          </div>

          <div>
            <label
              htmlFor="full_name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Full Name
            </label>
            <input
              id="full_name"
              name="full_name"
              type="text"
              value={formData.full_name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label
              htmlFor="bio"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
              placeholder="Tell us about yourself"
            />
          </div>

          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Location
            </label>
            <input
              id="location"
              name="location"
              type="text"
              value={formData.location}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
              placeholder="Your location"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="website_url"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Website URL
              </label>
              <input
                id="website_url"
                name="website_url"
                type="url"
                value={formData.website_url}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                placeholder="https://your-website.com"
              />
            </div>

            <div>
              <label
                htmlFor="github_url"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                GitHub URL
              </label>
              <input
                id="github_url"
                name="github_url"
                type="url"
                value={formData.github_url}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                placeholder="https://github.com/username"
              />
            </div>

            <div>
              <label
                htmlFor="linkedin_url"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                LinkedIn URL
              </label>
              <input
                id="linkedin_url"
                name="linkedin_url"
                type="url"
                value={formData.linkedin_url}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                placeholder="https://linkedin.com/in/username"
              />
            </div>

            <div>
              <label
                htmlFor="twitter_url"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Twitter URL
              </label>
              <input
                id="twitter_url"
                name="twitter_url"
                type="url"
                value={formData.twitter_url}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                placeholder="https://twitter.com/username"
              />
            </div>
          </div>
        </CardBody>
        <CardFooter className="flex justify-end">
          <Button type="submit" isLoading={isSubmitting}>
            Save Changes
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ProfileForm; 