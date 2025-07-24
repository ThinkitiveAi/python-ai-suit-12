import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Upload, Eye, EyeOff, AlertCircle, CheckCircle, Stethoscope } from 'lucide-react';
import clsx from 'clsx';
import Step1PersonalInfo from './registration/Step1PersonalInfo';
import Step2ProfessionalInfo from './registration/Step2ProfessionalInfo';
import Step3PracticeInfo from './registration/Step3PracticeInfo';
import Step4Security from './registration/Step4Security';
import Step5Review from './registration/Step5Review';

const ProviderRegistration = ({ onNavigateToLogin }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    profilePhoto: null,
    
    // Professional Information
    licenseNumber: '',
    specialization: '',
    yearsExperience: '',
    medicalDegree: '',
    
    // Practice Information
    practiceName: '',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    practiceType: '',
    
    // Security
    password: '',
    confirmPassword: '',
    termsAccepted: false
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const totalSteps = 5;

  const steps = [
    { id: 1, title: 'Personal Info', description: 'Basic information' },
    { id: 2, title: 'Professional', description: 'Medical credentials' },
    { id: 3, title: 'Practice', description: 'Practice details' },
    { id: 4, title: 'Security', description: 'Account security' },
    { id: 5, title: 'Review', description: 'Review & submit' }
  ];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFormDataChange = (data) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      setIsSuccess(true);
      
      // Redirect after success
      setTimeout(() => {
        console.log('Registration successful, redirecting to login...');
      }, 2000);
      
    } catch (error) {
      setErrors({
        general: 'Registration failed. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1PersonalInfo
            formData={formData}
            onChange={handleFormDataChange}
            errors={errors}
            setErrors={setErrors}
          />
        );
      case 2:
        return (
          <Step2ProfessionalInfo
            formData={formData}
            onChange={handleFormDataChange}
            errors={errors}
            setErrors={setErrors}
          />
        );
      case 3:
        return (
          <Step3PracticeInfo
            formData={formData}
            onChange={handleFormDataChange}
            errors={errors}
            setErrors={setErrors}
          />
        );
      case 4:
        return (
          <Step4Security
            formData={formData}
            onChange={handleFormDataChange}
            errors={errors}
            setErrors={setErrors}
          />
        );
      case 5:
        return (
          <Step5Review
            formData={formData}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            isSuccess={isSuccess}
          />
        );
      default:
        return null;
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="w-full max-w-md text-center">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Registration Successful!
          </h1>
          <p className="text-gray-600 mb-6">
            Thank you for registering with Health First. We've sent a verification email to your inbox.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">Next Steps:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Check your email for verification link</li>
              <li>• Complete your profile verification</li>
              <li>• Wait for account approval (24-48 hours)</li>
            </ul>
          </div>
          <button
            onClick={() => onNavigateToLogin && onNavigateToLogin()}
            className="btn-primary"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-primary-500 p-3 rounded-full">
              <Stethoscope className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Provider Registration
          </h1>
          <p className="text-gray-600">
            Join Health First as a healthcare provider
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={clsx(
                  "flex items-center justify-center w-10 h-10 rounded-full border-2 font-semibold text-sm",
                  currentStep >= step.id
                    ? "bg-primary-500 border-primary-500 text-white"
                    : "bg-white border-gray-300 text-gray-500"
                )}>
                  {currentStep > step.id ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    step.id
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={clsx(
                    "flex-1 h-1 mx-4",
                    currentStep > step.id ? "bg-primary-500" : "bg-gray-300"
                  )} />
                )}
              </div>
            ))}
          </div>
          
          {/* Step Labels */}
          <div className="flex justify-between text-sm text-gray-600">
            {steps.map((step) => (
              <div key={step.id} className="text-center flex-1">
                <div className={clsx(
                  "font-medium",
                  currentStep === step.id ? "text-primary-600" : ""
                )}>
                  {step.title}
                </div>
                <div className="text-xs mt-1">{step.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
          {renderStep()}

          {/* Navigation Buttons */}
          <div className="nav-container mt-8 pt-6 border-t border-gray-200">
            {/* Previous Button */}
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={clsx(
                "btn-nav",
                currentStep === 1 ? "btn-nav-disabled" : "btn-nav-secondary"
              )}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Previous</span>
              <span className="sm:hidden">Back</span>
            </button>

            {/* Step Indicator */}
            <div className="step-indicator">
              <span className="font-medium">Step {currentStep}</span>
              <span className="mx-1">of</span>
              <span className="font-medium">{totalSteps}</span>
            </div>

            {/* Next Button */}
            {currentStep < totalSteps ? (
              <button
                onClick={handleNext}
                className="btn-nav btn-nav-primary"
              >
                <span className="hidden sm:inline">Next</span>
                <span className="sm:hidden">Next</span>
                <ChevronRight className="w-4 h-4 ml-2" />
              </button>
            ) : (
              <div className="min-w-[120px]"></div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Already have an account?{' '}
            <button
              onClick={() => onNavigateToLogin && onNavigateToLogin()}
              className="btn-secondary"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProviderRegistration; 