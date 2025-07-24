import React, { useState } from 'react';
import { Eye, EyeOff, User, Lock, Heart, AlertCircle, CheckCircle, HelpCircle, Shield } from 'lucide-react';
import clsx from 'clsx';
import apiService from '../services/api';
import config from '../utils/config';

const PatientLogin = ({ onNavigateToRegister }) => {
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: '',
    rememberMe: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.emailOrPhone.trim()) {
      newErrors.emailOrPhone = 'Please enter your email or phone number';
    } else {
      const isEmail = formData.emailOrPhone.includes('@');
      if (isEmail && !validateEmail(formData.emailOrPhone)) {
        newErrors.emailOrPhone = 'Please enter a valid email address';
      } else if (!isEmail && !validatePhone(formData.emailOrPhone)) {
        newErrors.emailOrPhone = 'Please enter a valid phone number';
      }
    }

    if (!formData.password) {
      newErrors.password = 'Please enter your password';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});
    
    try {
      // Use API service for login
      const credentials = {
        emailOrPhone: formData.emailOrPhone,
        password: formData.password,
        rememberMe: formData.rememberMe
      };

      const response = await apiService.login(credentials, 'patient');
      
      // Handle successful login
      setIsSuccess(true);
      
      // Log success in development
      if (config.isDebugMode) {
        console.log('Patient login successful:', response);
      }
      
      // Redirect after success
      setTimeout(() => {
        // Redirect to patient dashboard (in real app)
        console.log('Redirecting to patient dashboard...');
        // You can use React Router here: history.push('/patient/dashboard');
      }, 1000);
      
    } catch (error) {
      // Handle different types of errors
      let errorMessage = 'Unable to sign in. Please check your information and try again.';
      
      if (error.response) {
        const { status, data } = error.response;
        
        switch (status) {
          case 401:
            errorMessage = 'Invalid email/phone or password. Please try again.';
            break;
          case 403:
            errorMessage = 'Your account has been locked. Please contact support.';
            break;
          case 404:
            errorMessage = 'Account not found. Please check your email/phone or create a new account.';
            break;
          case 429:
            errorMessage = 'Too many login attempts. Please wait a few minutes before trying again.';
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
      
      // Log error in development
      if (config.isDebugMode) {
        console.error('Patient login error:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.emailOrPhone) {
      setErrors({
        general: 'Please enter your email address first.'
      });
      return;
    }

    try {
      await apiService.forgotPassword(formData.emailOrPhone, 'patient');
      alert('Password reset instructions have been sent to your email.');
    } catch (error) {
      setErrors({
        general: 'Unable to send password reset. Please try again later.'
      });
    }
  };

  const handleRegister = () => {
    if (onNavigateToRegister) {
      onNavigateToRegister();
    }
  };

  const getInputType = () => {
    return formData.emailOrPhone.includes('@') ? 'email' : 'tel';
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 calm-fade-in">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-500 p-3 rounded-full">
              <Heart className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold high-contrast mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600 text-lg">
            Sign in to access your health records
          </p>
        </div>

        {/* Login Card */}
        <div className="patient-card calm-slide-up">
          {isSuccess ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold high-contrast mb-2">
                Welcome Back!
              </h2>
              <p className="text-gray-600">
                Taking you to your dashboard...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email/Phone Input */}
              <div>
                <label htmlFor="emailOrPhone" className="block text-sm font-medium high-contrast mb-2">
                  Email or Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={getInputType()}
                    id="emailOrPhone"
                    name="emailOrPhone"
                    value={formData.emailOrPhone}
                    onChange={handleInputChange}
                    className={clsx(
                      "patient-input pl-10 focus-visible",
                      errors.emailOrPhone && "border-red-500 focus:ring-red-500"
                    )}
                    placeholder="Enter your email or phone number"
                    autoComplete="username"
                    autoFocus
                  />
                </div>
                {errors.emailOrPhone && (
                  <div className="flex items-center mt-2 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.emailOrPhone}
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  We'll send you a secure link to sign in
                </p>
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium high-contrast mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={clsx(
                      "patient-input pl-10 pr-10 focus-visible",
                      errors.password && "border-red-500 focus:ring-red-500"
                    )}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center touch-target"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <div className="flex items-center mt-2 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.password}
                  </div>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="h-5 w-5 text-blue-500 focus:ring-blue-500 border-gray-300 rounded touch-target"
                  />
                  <label htmlFor="rememberMe" className="ml-2 block text-sm high-contrast">
                    Keep me signed in
                  </label>
                </div>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors touch-target"
                >
                  Forgot password?
                </button>
              </div>

              {/* General Error */}
              {errors.general && (
                <div className="error-message">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
                  <span className="text-sm text-red-700">{errors.general}</span>
                </div>
              )}

              {/* Security Notice */}
              <div className="security-notice">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-900">Secure Sign In</h4>
                    <p className="text-sm text-blue-800 mt-1">
                      Your information is protected with bank-level security. We never share your personal data.
                    </p>
                  </div>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="patient-btn flex items-center justify-center touch-target"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          )}
        </div>

        {/* Help Section */}
        <div className="mt-6 text-center">
          <div className="help-section mb-4">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <HelpCircle className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium high-contrast">Need Help?</span>
            </div>
            <div className="flex justify-center space-x-4 text-sm">
              <button className="text-blue-600 hover:text-blue-700 transition-colors touch-target">
                Contact Support
              </button>
              <button className="text-blue-600 hover:text-blue-700 transition-colors touch-target">
                FAQ
              </button>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="text-center mt-6 calm-fade-in">
          <p className="text-gray-600">
            New patient?{' '}
            <button
              onClick={handleRegister}
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors touch-target"
            >
              Create an account
            </button>
          </p>
        </div>

        {/* Additional Links */}
        <div className="text-center mt-4 text-sm text-gray-500">
          <div className="flex justify-center space-x-4">
            <button className="hover:text-gray-700 transition-colors touch-target">
              Privacy Policy
            </button>
            <button className="hover:text-gray-700 transition-colors touch-target">
              Terms of Service
            </button>
            <button className="hover:text-gray-700 transition-colors touch-target">
              Accessibility
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientLogin; 