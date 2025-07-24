import React from 'react';
import { CheckCircle, AlertCircle, User, Mail, Phone, FileText, Award, Building, MapPin, Shield } from 'lucide-react';
import clsx from 'clsx';

const Step5Review = ({ formData, onSubmit, isLoading, isSuccess }) => {
  const formatAddress = () => {
    const parts = [
      formData.streetAddress,
      formData.city,
      formData.state,
      formData.zipCode
    ].filter(Boolean);
    return parts.join(', ');
  };

  const renderSection = (title, icon, data) => (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-center space-x-2 mb-3">
        {icon}
        <h3 className="font-medium text-gray-900">{title}</h3>
      </div>
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span className="text-gray-600">{item.label}:</span>
            <span className="text-gray-900 font-medium">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const personalData = [
    { label: 'Full Name', value: `${formData.firstName} ${formData.lastName}` },
    { label: 'Email', value: formData.email },
    { label: 'Phone', value: formData.phone },
    { label: 'Profile Photo', value: formData.profilePhoto ? formData.profilePhoto.name : 'Not uploaded' }
  ];

  const professionalData = [
    { label: 'License Number', value: formData.licenseNumber },
    { label: 'Specialization', value: formData.specialization },
    { label: 'Experience', value: formData.yearsExperience },
    { label: 'Medical Degree', value: formData.medicalDegree }
  ];

  const practiceData = [
    { label: 'Practice Name', value: formData.practiceName },
    { label: 'Practice Type', value: formData.practiceType },
    { label: 'Address', value: formatAddress() }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Review Your Information</h2>
        <p className="text-gray-600">Please review all the information before submitting your registration.</p>
      </div>

      {/* Review Sections */}
      <div className="space-y-4">
        {renderSection('Personal Information', <User className="w-5 h-5 text-primary-500" />, personalData)}
        {renderSection('Professional Information', <FileText className="w-5 h-5 text-primary-500" />, professionalData)}
        {renderSection('Practice Information', <Building className="w-5 h-5 text-primary-500" />, practiceData)}
      </div>

      {/* Important Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-yellow-900">Important Notice</h4>
            <ul className="text-sm text-yellow-800 mt-1 space-y-1">
              <li>• Your registration will be reviewed within 24-48 hours</li>
              <li>• You will receive a verification email to confirm your account</li>
              <li>• Please ensure all information is accurate and up-to-date</li>
              <li>• You may be contacted for additional verification if needed</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-900">Data Security</h4>
            <p className="text-sm text-blue-800 mt-1">
              All your information is encrypted and stored securely. We follow HIPAA guidelines and industry best practices to protect your data.
            </p>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <button
          onClick={onSubmit}
          disabled={isLoading}
          className={clsx(
            "w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center",
            isLoading
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-primary-500 hover:bg-primary-600 text-white focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          )}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Submitting Registration...
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5 mr-2" />
              Submit Registration
            </>
          )}
        </button>
        
        {isLoading && (
          <p className="text-sm text-gray-600 text-center mt-2">
            Please wait while we process your registration...
          </p>
        )}
      </div>

      {/* Edit Notice */}
      <div className="text-center">
        <p className="text-sm text-gray-500">
          Need to make changes? Use the Previous button to go back and edit your information.
        </p>
      </div>
    </div>
  );
};

export default Step5Review; 