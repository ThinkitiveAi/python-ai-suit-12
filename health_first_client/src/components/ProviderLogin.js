import React, { useState } from 'react';
import { Eye, EyeOff, User, Lock, Stethoscope, AlertCircle, CheckCircle } from 'lucide-react';
import clsx from 'clsx';

const ProviderLogin = ({ onNavigateToRegister }) => {
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
      newErrors.emailOrPhone = 'Email or phone number is required';
    } else {
      const isEmail = formData.emailOrPhone.includes('@');
      if (isEmail && !validateEmail(formData.emailOrPhone)) {
        newErrors.emailOrPhone = 'Please enter a valid email address';
      } else if (!isEmail && !validatePhone(formData.emailOrPhone)) {
        newErrors.emailOrPhone = 'Please enter a valid phone number';
      }
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
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
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful login
      setIsSuccess(true);
      setTimeout(() => {
        // Redirect to dashboard (in real app)
        console.log('Redirecting to dashboard...');
      }, 1000);
      
    } catch (error) {
      setErrors({
        general: 'Invalid credentials. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    console.log('Navigate to forgot password page');
  };

  const handleRegister = () => {
    if (onNavigateToRegister) {
      onNavigateToRegister();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex justify-center mb-4">
            <div className="bg-primary-500 p-3 rounded-full">
              <Stethoscope className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Health First
          </h1>
          <p className="text-gray-600">
            Provider Login
          </p>
        </div>

        {/* Login Card */}
        <div className="card animate-slide-up">
          {isSuccess ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Login Successful!
              </h2>
              <p className="text-gray-600">
                Redirecting to dashboard...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email/Phone Input */}
              <div>
                <label htmlFor="emailOrPhone" className="block text-sm font-medium text-gray-700 mb-2">
                  Email or Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="emailOrPhone"
                    name="emailOrPhone"
                    value={formData.emailOrPhone}
                    onChange={handleInputChange}
                    className={clsx(
                      "input-field pl-10",
                      errors.emailOrPhone && "border-red-500 focus:ring-red-500"
                    )}
                    placeholder="Enter your email or phone number"
                    autoComplete="username"
                  />
                </div>
                {errors.emailOrPhone && (
                  <div className="flex items-center mt-1 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.emailOrPhone}
                  </div>
                )}
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
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
                      "input-field pl-10 pr-10",
                      errors.password && "border-red-500 focus:ring-red-500"
                    )}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <div className="flex items-center mt-1 text-sm text-red-600">
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
                    className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="btn-secondary text-sm"
                >
                  Forgot password?
                </button>
              </div>

              {/* General Error */}
              {errors.general && (
                <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                  <span className="text-sm text-red-700">{errors.general}</span>
                </div>
              )}

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary flex items-center justify-center"
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

        {/* Footer Links */}
        <div className="text-center mt-6 animate-fade-in">
          <p className="text-gray-600">
            New provider?{' '}
            <button
              onClick={handleRegister}
              className="btn-secondary"
            >
              Register here
            </button>
          </p>
        </div>

        {/* Additional Links */}
        <div className="text-center mt-4 text-sm text-gray-500">
          <div className="flex justify-center space-x-4">
            <button className="hover:text-gray-700 transition-colors">
              Privacy Policy
            </button>
            <button className="hover:text-gray-700 transition-colors">
              Terms of Service
            </button>
            <button className="hover:text-gray-700 transition-colors">
              Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderLogin; 