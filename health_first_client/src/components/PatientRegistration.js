import React, { useState, useRef } from 'react';
import { 
  User, Mail, Phone, Calendar, MapPin, Heart, Shield, 
  Upload, Eye, EyeOff, ChevronLeft, ChevronRight, 
  CheckCircle, AlertCircle, Camera, X 
} from 'lucide-react';
import clsx from 'clsx';
import apiService from '../services/api';
import config from '../utils/config';

const PatientRegistration = ({ onNavigateToLogin }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', dateOfBirth: '', gender: '',
    streetAddress: '', city: '', state: '', zipCode: '', country: 'United States',
    emergencyName: '', emergencyRelationship: '', emergencyPhone: '',
    password: '', confirmPassword: '',
    termsAccepted: false, privacyAccepted: false, hipaaConsent: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const fileInputRef = useRef(null);
  const totalSteps = 4;

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  };

  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const strength = [minLength, hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar]
      .filter(Boolean).length;
    
    setPasswordStrength(strength);
    return strength >= 3;
  };

  const validateAge = (dateOfBirth) => {
    if (!dateOfBirth) return false;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age >= 13;
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email.trim()) {
          newErrors.email = 'Email is required';
        } else if (!validateEmail(formData.email)) {
          newErrors.email = 'Please enter a valid email address';
        }
        if (!formData.phone.trim()) {
          newErrors.phone = 'Phone number is required';
        } else if (!validatePhone(formData.phone)) {
          newErrors.phone = 'Please enter a valid phone number';
        }
        if (!formData.dateOfBirth) {
          newErrors.dateOfBirth = 'Date of birth is required';
        } else if (!validateAge(formData.dateOfBirth)) {
          newErrors.dateOfBirth = 'You must be at least 13 years old to register';
        }
        if (!formData.gender) newErrors.gender = 'Please select your gender';
        break;

      case 2:
        if (!formData.streetAddress.trim()) newErrors.streetAddress = 'Street address is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.state.trim()) newErrors.state = 'State is required';
        if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
        break;

      case 3:
        if (!formData.emergencyName.trim()) newErrors.emergencyName = 'Emergency contact name is required';
        if (!formData.emergencyRelationship) newErrors.emergencyRelationship = 'Please select relationship';
        if (!formData.emergencyPhone.trim()) {
          newErrors.emergencyPhone = 'Emergency contact phone is required';
        } else if (!validatePhone(formData.emergencyPhone)) {
          newErrors.emergencyPhone = 'Please enter a valid phone number';
        }
        break;

      case 4:
        if (!formData.password) {
          newErrors.password = 'Password is required';
        } else if (!validatePassword(formData.password)) {
          newErrors.password = 'Password must meet security requirements';
        }
        if (!formData.confirmPassword) {
          newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        }
        if (!formData.termsAccepted) newErrors.termsAccepted = 'You must accept the terms of service';
        if (!formData.privacyAccepted) newErrors.privacyAccepted = 'You must accept the privacy policy';
        if (!formData.hipaaConsent) newErrors.hipaaConsent = 'You must consent to HIPAA regulations';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    if (name === 'password') {
      validatePassword(value);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          profilePhoto: 'File size must be less than 5MB'
        }));
        return;
      }

      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          profilePhoto: 'Please select an image file'
        }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        profilePhoto: file
      }));

      setErrors(prev => ({
        ...prev,
        profilePhoto: ''
      }));
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const registrationData = {
        personalInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          dateOfBirth: formData.dateOfBirth,
          gender: formData.gender
        },
        address: {
          streetAddress: formData.streetAddress,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        },
        emergencyContact: {
          name: formData.emergencyName,
          relationship: formData.emergencyRelationship,
          phone: formData.emergencyPhone
        },
        security: {
          password: formData.password
        },
        legal: {
          termsAccepted: formData.termsAccepted,
          privacyAccepted: formData.privacyAccepted,
          hipaaConsent: formData.hipaaConsent
        }
      };

      const response = await apiService.register(registrationData, 'patient');
      
      setIsSuccess(true);
      
      if (config.isDebugMode) {
        console.log('Patient registration successful:', response);
      }
      
    } catch (error) {
      let errorMessage = 'Unable to complete registration. Please try again.';
      
      if (error.response) {
        const { status, data } = error.response;
        
        switch (status) {
          case 409:
            errorMessage = 'An account with this email already exists. Please use a different email or try logging in.';
            break;
          case 400:
            errorMessage = data?.message || 'Please check your information and try again.';
            break;
          case 500:
            errorMessage = 'Server error. Please try again later.';
            break;
          default:
            errorMessage = data?.message || errorMessage;
        }
      } else if (error.request) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      }
      
      setErrors({
        general: errorMessage
      });
      
      if (config.isDebugMode) {
        console.error('Patient registration error:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 0:
      case 1:
        return 'bg-red-500';
      case 2:
        return 'bg-yellow-500';
      case 3:
        return 'bg-blue-500';
      case 4:
      case 5:
        return 'bg-green-500';
      default:
        return 'bg-gray-300';
    }
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0:
      case 1:
        return 'Very Weak';
      case 2:
        return 'Weak';
      case 3:
        return 'Fair';
      case 4:
        return 'Good';
      case 5:
        return 'Strong';
      default:
        return '';
    }
  };

  const formatPhoneNumber = (value) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return value;
  };

  const handlePhoneChange = (e) => {
    const { name, value } = e.target;
    const formatted = formatPhoneNumber(value);
    setFormData(prev => ({
      ...prev,
      [name]: formatted
    }));
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome to Health First!
            </h1>
            <p className="text-gray-600 mb-6">
              Your account has been created successfully. Please check your email to verify your account.
            </p>
            <button
              onClick={() => onNavigateToLogin && onNavigateToLogin()}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Continue to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-500 p-3 rounded-full">
              <Heart className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Join Health First
          </h1>
          <p className="text-gray-600 text-lg">
            Create your account to access personalized healthcare services
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={clsx(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                    step < currentStep
                      ? "bg-green-500 text-white"
                      : step === currentStep
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-600"
                  )}
                >
                  {step < currentStep ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    step
                  )}
                </div>
                {step < 4 && (
                  <div
                    className={clsx(
                      "flex-1 h-1 mx-2",
                      step < currentStep ? "bg-green-500" : "bg-gray-200"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-2">
            <span className="text-sm text-gray-600">
              Step {currentStep} of {totalSteps}
            </span>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
          <form onSubmit={handleSubmit}>
            {/* Step Content */}
            <div className="space-y-6">
              {currentStep === 1 && (
                <div>
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">Personal Information</h2>
                    <p className="text-gray-600">Tell us about yourself to get started</p>
                  </div>

                  {/* Name Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={clsx(
                          "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200",
                          errors.firstName && "border-red-500 focus:ring-red-500"
                        )}
                        placeholder="Enter your first name"
                      />
                      {errors.firstName && (
                        <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={clsx(
                          "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200",
                          errors.lastName && "border-red-500 focus:ring-red-500"
                        )}
                        placeholder="Enter your last name"
                      />
                      {errors.lastName && (
                        <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="mb-4">
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
                          "w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200",
                          errors.email && "border-red-500 focus:ring-red-500"
                        )}
                        placeholder="Enter your email address"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="mb-4">
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
                        onChange={handlePhoneChange}
                        className={clsx(
                          "w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200",
                          errors.phone && "border-red-500 focus:ring-red-500"
                        )}
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
                    )}
                  </div>

                  {/* Date of Birth and Gender */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                        Date of Birth *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="date"
                          id="dateOfBirth"
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleInputChange}
                          className={clsx(
                            "w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200",
                            errors.dateOfBirth && "border-red-500 focus:ring-red-500"
                          )}
                        />
                      </div>
                      {errors.dateOfBirth && (
                        <p className="text-red-600 text-sm mt-1">{errors.dateOfBirth}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                        Gender *
                      </label>
                      <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className={clsx(
                          "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200",
                          errors.gender && "border-red-500 focus:ring-red-500"
                        )}
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer-not-to-say">Prefer not to say</option>
                      </select>
                      {errors.gender && (
                        <p className="text-red-600 text-sm mt-1">{errors.gender}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div>
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">Address Information</h2>
                    <p className="text-gray-600">Help us provide better care with your location</p>
                  </div>

                  {/* Street Address */}
                  <div className="mb-4">
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
                          "w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200",
                          errors.streetAddress && "border-red-500 focus:ring-red-500"
                        )}
                        placeholder="Enter your street address"
                      />
                    </div>
                    {errors.streetAddress && (
                      <p className="text-red-600 text-sm mt-1">{errors.streetAddress}</p>
                    )}
                  </div>

                  {/* City, State, ZIP */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                          "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200",
                          errors.city && "border-red-500 focus:ring-red-500"
                        )}
                        placeholder="City"
                      />
                      {errors.city && (
                        <p className="text-red-600 text-sm mt-1">{errors.city}</p>
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
                          "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200",
                          errors.state && "border-red-500 focus:ring-red-500"
                        )}
                      >
                        <option value="">Select state</option>
                        <option value="CA">California</option>
                        <option value="NY">New York</option>
                        <option value="TX">Texas</option>
                        <option value="FL">Florida</option>
                        <option value="IL">Illinois</option>
                        {/* Add more states as needed */}
                      </select>
                      {errors.state && (
                        <p className="text-red-600 text-sm mt-1">{errors.state}</p>
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
                          "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200",
                          errors.zipCode && "border-red-500 focus:ring-red-500"
                        )}
                        placeholder="12345"
                      />
                      {errors.zipCode && (
                        <p className="text-red-600 text-sm mt-1">{errors.zipCode}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div>
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">Emergency Contact</h2>
                    <p className="text-gray-600">Who should we contact in case of emergency?</p>
                  </div>

                  {/* Emergency Contact Name */}
                  <div className="mb-4">
                    <label htmlFor="emergencyName" className="block text-sm font-medium text-gray-700 mb-2">
                      Emergency Contact Name *
                    </label>
                    <input
                      type="text"
                      id="emergencyName"
                      name="emergencyName"
                      value={formData.emergencyName}
                      onChange={handleInputChange}
                      className={clsx(
                        "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200",
                        errors.emergencyName && "border-red-500 focus:ring-red-500"
                      )}
                      placeholder="Enter full name"
                    />
                    {errors.emergencyName && (
                      <p className="text-red-600 text-sm mt-1">{errors.emergencyName}</p>
                    )}
                  </div>

                  {/* Relationship and Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="emergencyRelationship" className="block text-sm font-medium text-gray-700 mb-2">
                        Relationship *
                      </label>
                      <select
                        id="emergencyRelationship"
                        name="emergencyRelationship"
                        value={formData.emergencyRelationship}
                        onChange={handleInputChange}
                        className={clsx(
                          "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200",
                          errors.emergencyRelationship && "border-red-500 focus:ring-red-500"
                        )}
                      >
                        <option value="">Select relationship</option>
                        <option value="spouse">Spouse</option>
                        <option value="parent">Parent</option>
                        <option value="sibling">Sibling</option>
                        <option value="child">Child</option>
                        <option value="friend">Friend</option>
                        <option value="other">Other</option>
                      </select>
                      {errors.emergencyRelationship && (
                        <p className="text-red-600 text-sm mt-1">{errors.emergencyRelationship}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="emergencyPhone" className="block text-sm font-medium text-gray-700 mb-2">
                        Emergency Phone *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          id="emergencyPhone"
                          name="emergencyPhone"
                          value={formData.emergencyPhone}
                          onChange={handlePhoneChange}
                          className={clsx(
                            "w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200",
                            errors.emergencyPhone && "border-red-500 focus:ring-red-500"
                          )}
                          placeholder="(555) 123-4567"
                        />
                      </div>
                      {errors.emergencyPhone && (
                        <p className="text-red-600 text-sm mt-1">{errors.emergencyPhone}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div>
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">Account Security</h2>
                    <p className="text-gray-600">Create a secure password and review our policies</p>
                  </div>

                  {/* Password */}
                  <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      Password *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Shield className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={clsx(
                          "w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200",
                          errors.password && "border-red-500 focus:ring-red-500"
                        )}
                        placeholder="Create a strong password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-600 text-sm mt-1">{errors.password}</p>
                    )}
                    
                    {/* Password Strength Indicator */}
                    {formData.password && (
                      <div className="mt-2">
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            {[1, 2, 3, 4, 5].map((level) => (
                              <div
                                key={level}
                                className={clsx(
                                  "h-2 w-8 rounded-full transition-colors",
                                  level <= passwordStrength ? getPasswordStrengthColor() : "bg-gray-200"
                                )}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">
                            {getPasswordStrengthText()}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Password must be at least 8 characters with uppercase, lowercase, number, and special character
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="mb-6">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Shield className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={clsx(
                          "w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200",
                          errors.confirmPassword && "border-red-500 focus:ring-red-500"
                        )}
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>
                    )}
                  </div>

                  {/* Legal Agreements */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Legal Agreements</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <input
                          id="termsAccepted"
                          name="termsAccepted"
                          type="checkbox"
                          checked={formData.termsAccepted}
                          onChange={handleInputChange}
                          className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <div className="flex-1">
                          <label htmlFor="termsAccepted" className="text-sm text-gray-700">
                            I accept the <a href="#" className="text-blue-600 hover:text-blue-700">Terms of Service</a> *
                          </label>
                          {errors.termsAccepted && (
                            <p className="text-red-600 text-sm mt-1">{errors.termsAccepted}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <input
                          id="privacyAccepted"
                          name="privacyAccepted"
                          type="checkbox"
                          checked={formData.privacyAccepted}
                          onChange={handleInputChange}
                          className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <div className="flex-1">
                          <label htmlFor="privacyAccepted" className="text-sm text-gray-700">
                            I accept the <a href="#" className="text-blue-600 hover:text-blue-700">Privacy Policy</a> *
                          </label>
                          {errors.privacyAccepted && (
                            <p className="text-red-600 text-sm mt-1">{errors.privacyAccepted}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <input
                          id="hipaaConsent"
                          name="hipaaConsent"
                          type="checkbox"
                          checked={formData.hipaaConsent}
                          onChange={handleInputChange}
                          className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <div className="flex-1">
                          <label htmlFor="hipaaConsent" className="text-sm text-gray-700">
                            I consent to the use and disclosure of my health information as described in the <a href="#" className="text-blue-600 hover:text-blue-700">HIPAA Notice</a> *
                          </label>
                          {errors.hipaaConsent && (
                            <p className="text-red-600 text-sm mt-1">{errors.hipaaConsent}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* General Error */}
            {errors.general && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                  <span className="text-sm text-red-700">{errors.general}</span>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className={clsx(
                  "flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200",
                  currentStep === 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-700 hover:text-gray-900"
                )}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </button>

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Already have an account?{' '}
            <button
              onClick={() => onNavigateToLogin && onNavigateToLogin()}
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PatientRegistration; 