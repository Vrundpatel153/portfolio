import React, { useState } from 'react';
import { Card, CardHeader, CardBody, CardFooter } from '../UI/Card';
import Button from '../UI/Button';
import { Upload } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-toastify';

interface Certification {
  id: string;
  title: string;
  issuer: string;
  date_issued: string;
  credential_url?: string;
  image_url?: string;
  description?: string;
}

interface CertificationFormProps {
  certification?: Certification;
  onSubmit: (certification: Omit<Certification, 'id'>) => Promise<void>;
  onCancel: () => void;
}

const CertificationForm: React.FC<CertificationFormProps> = ({ certification, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: certification?.title || '',
    issuer: certification?.issuer || '',
    date_issued: certification?.date_issued || '',
    credential_url: certification?.credential_url || '',
    image_url: certification?.image_url || '',
    description: certification?.description || ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

  const uploadCertificationImage = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;

      // Delete old image if exists and updating
      if (certification?.image_url) {
        const oldFileName = certification.image_url.split('/').pop();
        if (oldFileName) {
          await supabase.storage
            .from('certification-images')
            .remove([oldFileName]);
        }
      }

      // Upload new image
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('certification-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('certification-images')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading certification image:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imageUrl = formData.image_url;

      if (imageFile) {
        imageUrl = await uploadCertificationImage(imageFile);
      }

      await onSubmit({
        ...formData,
        image_url: imageUrl
      });

      toast.success(`Certification ${certification ? 'updated' : 'added'} successfully`);
    } catch (error) {
      console.error('Error submitting certification:', error);
      toast.error(`Failed to ${certification ? 'update' : 'add'} certification`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {certification ? 'Edit Certification' : 'Add New Certification'}
        </h2>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardBody className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Certificate Image
            </label>
            <div className="flex items-center space-x-4">
              {(imageFile || formData.image_url) && (
                <div className="w-32 h-24 relative">
                  <img
                    src={imageFile ? URL.createObjectURL(imageFile) : formData.image_url}
                    alt="Certificate preview"
                    className="w-full h-full object-cover rounded"
                  />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="certification-image"
              />
              <Button
                type="button"
                variant="outline"
                leftIcon={<Upload size={16} />}
                onClick={() => document.getElementById('certification-image')?.click()}
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
              placeholder="Certification title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Issuer *
            </label>
            <input
              type="text"
              name="issuer"
              value={formData.issuer}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
              placeholder="Issuing organization"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date Issued *
            </label>
            <input
              type="date"
              name="date_issued"
              value={formData.date_issued}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Credential URL
            </label>
            <input
              type="url"
              name="credential_url"
              value={formData.credential_url}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
              placeholder="https://example.com/credential"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
              placeholder="Brief description of the certification"
            />
          </div>
        </CardBody>
        <CardFooter className="flex justify-end space-x-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {certification ? 'Update Certification' : 'Add Certification'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default CertificationForm;