import React from 'react';
import { FileText, Award, Clock, GraduationCap, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

const Step2ProfessionalInfo = ({ formData, onChange, errors, setErrors }) => {
  const specializations = [
    'Cardiology',
    'Dermatology',
    'Endocrinology',
    'Family Medicine',
    'Gastroenterology',
    'General Surgery',
    'Internal Medicine',
    'Neurology',
    'Obstetrics & Gynecology',
    'Oncology',
    'Ophthalmology',
    'Orthopedics',
    'Otolaryngology',
    'Pediatrics',
    'Psychiatry',
    'Pulmonology',
    'Radiology',
    'Urology',
    'Other'
  ];

  const practiceTypes = [
    'Private Practice',
    'Hospital',
    'Clinic',
    'Urgent Care',
    'Academic Medical Center',
    'Government Facility',
    'Other'
  ];

  const experienceYears = [
    'Less than 1 year',
    '1-2 years',
    '3-5 years',
    '6-10 years',
    '11-15 years',
    '16-20 years',
    'More than 20 years'
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
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Professional Information</h2>
        <p className="text-gray-600">Please provide your medical credentials and professional details.</p>
      </div>

      {/* Medical License Number */}
      <div>
        <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 mb-2">
          Medical License Number *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FileText className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            id="licenseNumber"
            name="licenseNumber"
            value={formData.licenseNumber}
            onChange={handleInputChange}
            className={clsx(
              "input-field pl-10",
              errors.licenseNumber && "border-red-500 focus:ring-red-500"
            )}
            placeholder="Enter your medical license number"
            required
          />
        </div>
        {errors.licenseNumber && (
          <div className="flex items-center mt-1 text-sm text-red-600">
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors.licenseNumber}
          </div>
        )}
      </div>

      {/* Specialization */}
      <div>
        <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-2">
          Primary Specialization *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Award className="h-5 w-5 text-gray-400" />
          </div>
          <select
            id="specialization"
            name="specialization"
            value={formData.specialization}
            onChange={handleInputChange}
            className={clsx(
              "input-field pl-10 appearance-none",
              errors.specialization && "border-red-500 focus:ring-red-500"
            )}
            required
          >
            <option value="">Select your specialization</option>
            {specializations.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {errors.specialization && (
          <div className="flex items-center mt-1 text-sm text-red-600">
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors.specialization}
          </div>
        )}
      </div>

      {/* Years of Experience */}
      <div>
        <label htmlFor="yearsExperience" className="block text-sm font-medium text-gray-700 mb-2">
          Years of Experience *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Clock className="h-5 w-5 text-gray-400" />
          </div>
          <select
            id="yearsExperience"
            name="yearsExperience"
            value={formData.yearsExperience}
            onChange={handleInputChange}
            className={clsx(
              "input-field pl-10 appearance-none",
              errors.yearsExperience && "border-red-500 focus:ring-red-500"
            )}
            required
          >
            <option value="">Select years of experience</option>
            {experienceYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {errors.yearsExperience && (
          <div className="flex items-center mt-1 text-sm text-red-600">
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors.yearsExperience}
          </div>
        )}
      </div>

      {/* Medical Degree/Qualifications */}
      <div>
        <label htmlFor="medicalDegree" className="block text-sm font-medium text-gray-700 mb-2">
          Medical Degree/Qualifications *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <GraduationCap className="h-5 w-5 text-gray-400" />
          </div>
          <textarea
            id="medicalDegree"
            name="medicalDegree"
            value={formData.medicalDegree}
            onChange={handleInputChange}
            rows={3}
            className={clsx(
              "input-field pl-10 resize-none",
              errors.medicalDegree && "border-red-500 focus:ring-red-500"
            )}
            placeholder="Enter your medical degrees and qualifications (e.g., MD, MBBS, DO, etc.)"
            required
          />
        </div>
        {errors.medicalDegree && (
          <div className="flex items-center mt-1 text-sm text-red-600">
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors.medicalDegree}
          </div>
        )}
      </div>

      {/* Additional Certifications */}
      <div>
        <label htmlFor="additionalCertifications" className="block text-sm font-medium text-gray-700 mb-2">
          Additional Certifications
        </label>
        <textarea
          id="additionalCertifications"
          name="additionalCertifications"
          value={formData.additionalCertifications || ''}
          onChange={handleInputChange}
          rows={3}
          className="input-field resize-none"
          placeholder="Enter any additional certifications, board certifications, or special training"
        />
        <p className="text-xs text-gray-500 mt-1">
          Optional: Include any board certifications, fellowships, or special training
        </p>
      </div>
    </div>
  );
};

export default Step2ProfessionalInfo; 