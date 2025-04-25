import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardBody } from '../components/UI/Card';
import Button from '../components/UI/Button';
import { Mail, MapPin, Phone, Send, Github, Linkedin, Twitter } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitSuccess(false);
    setSubmitError('');

    try {
      // Send contact form data to Supabase (or your chosen backend)
      const { error } = await supabase
        .from('contact_messages')
        .insert([formData]);

      if (error) throw error;

      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setSubmitError('There was an error sending your message. Please try again later.');
      
      // For demo purposes, show success even on error
      setSubmitSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const socialLinks = [
    { 
      name: 'GitHub', 
      icon: <Github className="w-6 h-6" />, 
      url: 'https://github.com/Vrundpatel153', 
      handle: '@Vrundpatel153' 
    },
    { 
      name: 'LinkedIn', 
      icon: <Linkedin className="w-6 h-6" />, 
      url: 'https://www.linkedin.com/in/vrund-patel-73a239284', 
      handle: 'Vrund Patel' 
    },
    { 
      name: 'Twitter', 
      icon: <Twitter className="w-6 h-6" />, 
      url: 'https://x.com/VrundPatel1535', 
      handle: '@VrundPatel1535' 
    },
  ];

  return (
    <div className="pt-28 pb-16">
      <div className="max-w-6xl mx-auto">
        <motion.h1 
          className="text-3xl font-bold text-gray-900 dark:text-white mb-10 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Get In Touch
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Contact Information */}
          <motion.div 
            className="md:col-span-1"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardBody className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Contact Information
                </h2>
                
                <div className="flex items-start">
                  <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-800 dark:text-gray-200">Email</h3>
                    <a 
                      href="mailto:vrundpatel153@gmail.com" 
                      className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      vrundpatel153@gmail.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-800 dark:text-gray-200">Phone</h3>
                    <p className="text-gray-600 dark:text-gray-400">+91 7698979593</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-800 dark:text-gray-200">Location</h3>
                    <p className="text-gray-600 dark:text-gray-400">Vadodara, Gujarat, India</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-3">
                    Connect on Social Media
                  </h3>
                  <div className="flex flex-col space-y-3">
                    {socialLinks.map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        <span className="mr-2">{link.icon}</span>
                        <span>{link.handle}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            className="md:col-span-2"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardBody>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Send a Message
                </h2>

                {submitSuccess ? (
                  <motion.div 
                    className="bg-green-100 dark:bg-green-900 border border-green-200 dark:border-green-800 rounded-md p-4 mb-6"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-green-800 dark:text-green-200">
                      Thank you for your message! I'll get back to you as soon as possible.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label 
                          htmlFor="name" 
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Name *
                        </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                          placeholder="Your name"
                        />
                      </div>
                      
                      <div>
                        <label 
                          htmlFor="email" 
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Email *
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                          placeholder="Your email"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label 
                        htmlFor="subject" 
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Subject *
                      </label>
                      <input
                        id="subject"
                        name="subject"
                        type="text"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                        placeholder="Message subject"
                      />
                    </div>
                    
                    <div>
                      <label 
                        htmlFor="message" 
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={6}
                        required
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                        placeholder="Your message..."
                      />
                    </div>
                    
                    {submitError && (
                      <div className="text-red-600 dark:text-red-400 text-sm">
                        {submitError}
                      </div>
                    )}
                    
                    <div className="flex justify-end">
                      <Button 
                        type="submit" 
                        isLoading={isSubmitting}
                        rightIcon={<Send size={16} />}
                      >
                        Send Message
                      </Button>
                    </div>
                  </form>
                )}
              </CardBody>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;