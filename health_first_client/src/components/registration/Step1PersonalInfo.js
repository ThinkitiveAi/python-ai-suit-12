import React, { useState, useRef } from 'react';
import { User, Mail, Phone, Upload, X, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

const Step1PersonalInfo = ({ formData, onChange, errors, setErrors }) => {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileUpload = (file) => {
    if (file && file.type.startsWith('image/')) {
      if (file.size <= 5 * 1024 * 1024) { // 5MB limit
        onChange({ profilePhoto: file });
        setErrors(prev => ({ ...prev, profilePhoto: '' }));
      } else {
        setErrors(prev => ({ ...prev, profilePhoto: 'File size must be less than 5MB' }));
      }
    } else {
      setErrors(prev => ({ ...prev, profilePhoto: 'Please select a valid image file' }));
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const removePhoto = () => {
    onChange({ profilePhoto: null });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Personal Information</h2>
        <p className="text-gray-600">Please provide your basic personal details.</p>
      </div>

      {/* Name Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
            First Name *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className={clsx(
                "input-field pl-10",
                errors.firstName && "border-red-500 focus:ring-red-500"
              )}
              placeholder="Enter your first name"
              required
            />
          </div>
          {errors.firstName && (
            <div className="flex items-center mt-1 text-sm text-red-600">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.firstName}
            </div>
          )}
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
            Last Name *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className={clsx(
                "input-field pl-10",
                errors.lastName && "border-red-500 focus:ring-red-500"
              )}
              placeholder="Enter your last name"
              required
            />
          </div>
          {errors.lastName && (
            <div className="flex items-center mt-1 text-sm text-red-600">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.lastName}
            </div>
          )}
        </div>
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email Address *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={clsx(
              "input-field pl-10",
              errors.email && "border-red-500 focus:ring-red-500"
            )}
            placeholder="Enter your email address"
            required
          />
        </div>
        {errors.email && (
          <div className="flex items-center mt-1 text-sm text-red-600">
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors.email}
          </div>
        )}
      </div>

      {/* Phone Field */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Phone className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className={clsx(
              "input-field pl-10",
              errors.phone && "border-red-500 focus:ring-red-500"
            )}
            placeholder="Enter your phone number"
            required
          />
        </div>
        {errors.phone && (
          <div className="flex items-center mt-1 text-sm text-red-600">
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors.phone}
          </div>
        )}
      </div>

      {/* Profile Photo Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Profile Photo
        </label>
        <div
          className={clsx(
            "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
            dragActive
              ? "border-primary-500 bg-primary-50"
              : "border-gray-300 hover:border-primary-400"
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {formData.profilePhoto ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <img
                  src={URL.createObjectURL(formData.profilePhoto)}
                  alt="Profile preview"
                  className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                />
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span className="text-sm text-gray-600">
                  {formData.profilePhoto.name}
                </span>
                <button
                  type="button"
                  onClick={removePhoto}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Upload className="w-12 h-12 text-gray-400 mx-auto" />
              <div>
                <p className="text-sm text-gray-600">
                  <span className="font-medium text-primary-600">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG, GIF up to 5MB
                </p>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="btn-primary"
              >
                Choose File
              </button>
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />
        {errors.profilePhoto && (
          <div className="flex items-center mt-1 text-sm text-red-600">
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors.profilePhoto}
          </div>
        )}
      </div>
    </div>
  );
};

export default Step1PersonalInfo; 