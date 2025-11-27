import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiUpload, FiImage, FiTrash2 } from 'react-icons/fi';

const UploadModal = ({ isOpen, onClose, onUpload, user }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors({ file: 'Please select a valid image file' });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setErrors({ file: 'File size must be less than 10MB' });
      return;
    }

    setSelectedFile(file);
    setErrors({});

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!selectedFile) {
      newErrors.file = 'Please select an image to upload';
    }

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    if (description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!user || !user.id) {
      alert('You must be logged in to upload images');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('userId', user.id); // Add userId parameter
      formData.append('tags', tags.split(',').map(tag => tag.trim()).filter(tag => tag));

      await onUpload(formData);
      handleClose();
    } catch (error) {
      console.error('Upload error:', error);
      // Error handling will be done in parent component
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreview(null);
    setTitle('');
    setDescription('');
    setTags('');
    setErrors({});
    setIsUploading(false);
    onClose();
  };

  const titleCount = title.length;
  const descriptionCount = description.length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="glass w-full max-w-2xl rounded-2xl p-8 relative max-h-[90vh] overflow-y-auto">
              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <FiX className="w-5 h-5 text-gray-400" />
              </motion.button>

              {/* Header */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Upload Image</h2>
                <p className="text-gray-400">Share your amazing visual with the community</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* File Upload Area */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Image *
                  </label>
                  {!selectedFile ? (
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                        isDragging
                          ? 'border-purple-400 bg-purple-500/10'
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                    >
                      <FiUpload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg text-gray-300 mb-2">
                        Drag & drop your image here
                      </p>
                      <p className="text-gray-500 mb-4">
                        or click to browse files
                      </p>
                      <p className="text-sm text-gray-500">
                        Supports: JPG, PNG, GIF, WebP (max 10MB)
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileInputChange}
                        className="hidden"
                      />
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-800">
                        <img
                          src={preview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20" />
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={removeFile}
                          className="absolute top-4 right-4 p-2 bg-red-500/20 backdrop-blur-md border border-red-500/50 rounded-full text-red-400 hover:bg-red-500/30 transition-colors"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </motion.button>
                      </div>
                      <div className="mt-2 flex items-center space-x-2 text-sm text-gray-400">
                        <FiImage className="w-4 h-4" />
                        <span>{selectedFile.name}</span>
                        <span>({Math.round(selectedFile.size / 1024)} KB)</span>
                      </div>
                    </div>
                  )}
                  {errors.file && (
                    <p className="text-red-400 text-sm mt-1">{errors.file}</p>
                  )}
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${
                      errors.title ? 'border-red-500' : 'border-gray-600'
                    }`}
                    placeholder="Give your image a catchy title"
                    maxLength={100}
                  />
                  <div className="flex justify-between items-center mt-1">
                    {errors.title && (
                      <p className="text-red-400 text-sm">{errors.title}</p>
                    )}
                    <p className={`text-sm ml-auto ${titleCount > 90 ? 'text-yellow-400' : 'text-gray-500'}`}>
                      {titleCount}/100
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors resize-none ${
                      errors.description ? 'border-red-500' : 'border-gray-600'
                    }`}
                    placeholder="Tell us about your image (optional)"
                    maxLength={500}
                  />
                  <div className="flex justify-between items-center mt-1">
                    {errors.description && (
                      <p className="text-red-400 text-sm">{errors.description}</p>
                    )}
                    <p className={`text-sm ml-auto ${descriptionCount > 450 ? 'text-yellow-400' : 'text-gray-500'}`}>
                      {descriptionCount}/500
                    </p>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                    placeholder="nature, photography, art (comma separated)"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Separate tags with commas (optional)
                  </p>
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isUploading}
                  type="submit"
                  className="w-full btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isUploading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <FiUpload className="w-5 h-5" />
                      <span>Upload Image</span>
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default UploadModal;