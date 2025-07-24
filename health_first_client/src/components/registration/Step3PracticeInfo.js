import React from 'react';
import { Building, MapPin, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

const Step3PracticeInfo = ({ formData, onChange, errors, setErrors }) => {
  const practiceTypes = [
    'Private Practice',
    'Hospital',
    'Clinic',
    'Urgent Care',
    'Academic Medical Center',
    'Government Facility',
    'Other'
  ];

  const states = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
    'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
    'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
    'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
    'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
    'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
    'Wisconsin', 'Wyoming'
  ];

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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Practice Information</h2>
        <p className="text-gray-600">Please provide details about your practice or workplace.</p>
      </div>

      {/* Practice Name */}
      <div>
        <label htmlFor="practiceName" className="block text-sm font-medium text-gray-700 mb-2">
          Practice/Hospital Name *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Building className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            id="practiceName"
            name="practiceName"
            value={formData.practiceName}
            onChange={handleInputChange}
            className={clsx(
              "input-field pl-10",
              errors.practiceName && "border-red-500 focus:ring-red-500"
            )}
            placeholder="Enter your practice or hospital name"
            required
          />
        </div>
        {errors.practiceName && (
          <div className="flex items-center mt-1 text-sm text-red-600">
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors.practiceName}
          </div>
        )}
      </div>

      {/* Practice Type */}
      <div>
        <label htmlFor="practiceType" className="block text-sm font-medium text-gray-700 mb-2">
          Practice Type *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Building className="h-5 w-5 text-gray-400" />
          </div>
          <select
            id="practiceType"
            name="practiceType"
            value={formData.practiceType}
            onChange={handleInputChange}
            className={clsx(
              "input-field pl-10 appearance-none",
              errors.practiceType && "border-red-500 focus:ring-red-500"
            )}
            required
          >
            <option value="">Select practice type</option>
            {practiceTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {errors.practiceType && (
          <div className="flex items-center mt-1 text-sm text-red-600">
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors.practiceType}
          </div>
        )}
      </div>

      {/* Address Fields */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Practice Address</h3>
        
        {/* Street Address */}
        <div>
          <label htmlFor="streetAddress" className="block text-sm font-medium text-gray-700 mb-2">
            Street Address *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="streetAddress"
              name="streetAddress"
              value={formData.streetAddress}
              onChange={handleInputChange}
              className={clsx(
                "input-field pl-10",
                errors.streetAddress && "border-red-500 focus:ring-red-500"
              )}
              placeholder="Enter street address"
              required
            />
          </div>
          {errors.streetAddress && (
            <div className="flex items-center mt-1 text-sm text-red-600">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.streetAddress}
            </div>
          )}
        </div>

        {/* City, State, ZIP */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
              City *
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className={clsx(
                "input-field",
                errors.city && "border-red-500 focus:ring-red-500"
              )}
              placeholder="City"
              required
            />
            {errors.city && (
              <div className="flex items-center mt-1 text-sm text-red-600">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.city}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
              State *
            </label>
            <select
              id="state"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              className={clsx(
                "input-field appearance-none",
                errors.state && "border-red-500 focus:ring-red-500"
              )}
              required
            >
              <option value="">Select state</option>
              {states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
            {errors.state && (
              <div className="flex items-center mt-1 text-sm text-red-600">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.state}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-2">
              ZIP Code *
            </label>
            <input
              type="text"
              id="zipCode"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleInputChange}
              className={clsx(
                "input-field",
                errors.zipCode && "border-red-500 focus:ring-red-500"
              )}
              placeholder="ZIP Code"
              required
            />
            {errors.zipCode && (
              <div className="flex items-center mt-1 text-sm text-red-600">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.zipCode}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Additional Practice Information */}
      <div>
        <label htmlFor="additionalPracticeInfo" className="block text-sm font-medium text-gray-700 mb-2">
          Additional Practice Information
        </label>
        <textarea
          id="additionalPracticeInfo"
          name="additionalPracticeInfo"
          value={formData.additionalPracticeInfo || ''}
          onChange={handleInputChange}
          rows={3}
          className="input-field resize-none"
          placeholder="Any additional information about your practice (optional)"
        />
        <p className="text-xs text-gray-500 mt-1">
          Optional: Include practice hours, specialties, or other relevant information
        </p>
      </div>
    </div>
  );
};

export default Step3PracticeInfo; 