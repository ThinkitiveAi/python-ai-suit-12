import React, { useState } from 'react';
import { Lock, Eye, EyeOff, Shield, AlertCircle, CheckCircle } from 'lucide-react';
import clsx from 'clsx';

const Step4Security = ({ formData, onChange, errors, setErrors }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    onChange({ [name]: type === 'checkbox' ? checked : value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar,
      isValid: minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar
    };
  };

  const passwordValidation = validatePassword(formData.password);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Account Security</h2>
        <p className="text-gray-600">Create a secure password for your account.</p>
      </div>

      {/* Password Field */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
          Password *
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
            placeholder="Create a strong password"
            required
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
        
        {/* Password Strength Indicator */}
        <div className="mt-3 space-y-2">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Password Requirements:</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div className={clsx(
              "flex items-center space-x-2",
              passwordValidation.minLength ? "text-green-600" : "text-gray-500"
            )}>
              {passwordValidation.minLength ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              <span>At least 8 characters</span>
            </div>
            <div className={clsx(
              "flex items-center space-x-2",
              passwordValidation.hasUpperCase ? "text-green-600" : "text-gray-500"
            )}>
              {passwordValidation.hasUpperCase ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              <span>One uppercase letter</span>
            </div>
            <div className={clsx(
              "flex items-center space-x-2",
              passwordValidation.hasLowerCase ? "text-green-600" : "text-gray-500"
            )}>
              {passwordValidation.hasLowerCase ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              <span>One lowercase letter</span>
            </div>
            <div className={clsx(
              "flex items-center space-x-2",
              passwordValidation.hasNumbers ? "text-green-600" : "text-gray-500"
            )}>
              {passwordValidation.hasNumbers ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              <span>One number</span>
            </div>
            <div className={clsx(
              "flex items-center space-x-2",
              passwordValidation.hasSpecialChar ? "text-green-600" : "text-gray-500"
            )}>
              {passwordValidation.hasSpecialChar ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              <span>One special character</span>
            </div>
          </div>
        </div>

        {errors.password && (
          <div className="flex items-center mt-1 text-sm text-red-600">
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors.password}
          </div>
        )}
      </div>

      {/* Confirm Password Field */}
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
          Confirm Password *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className={clsx(
              "input-field pl-10 pr-10",
              errors.confirmPassword && "border-red-500 focus:ring-red-500"
            )}
            placeholder="Confirm your password"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showConfirmPassword ? (
              <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <div className="flex items-center mt-1 text-sm text-red-600">
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors.confirmPassword}
          </div>
        )}
      </div>

      {/* Terms and Conditions */}
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <input
            id="termsAccepted"
            name="termsAccepted"
            type="checkbox"
            checked={formData.termsAccepted}
            onChange={handleInputChange}
            className="mt-1 h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300 rounded"
            required
          />
          <div className="flex-1">
            <label htmlFor="termsAccepted" className="text-sm text-gray-700">
              I agree to the{' '}
              <button
                type="button"
                className="text-primary-600 hover:text-primary-700 font-medium"
                onClick={() => console.log('Open Terms of Service')}
              >
                Terms of Service
              </button>
              {' '}and{' '}
              <button
                type="button"
                className="text-primary-600 hover:text-primary-700 font-medium"
                onClick={() => console.log('Open Privacy Policy')}
              >
                Privacy Policy
              </button>
              *
            </label>
            {errors.termsAccepted && (
              <div className="flex items-center mt-1 text-sm text-red-600">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.termsAccepted}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <input
            id="marketingConsent"
            name="marketingConsent"
            type="checkbox"
            checked={formData.marketingConsent || false}
            onChange={handleInputChange}
            className="mt-1 h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300 rounded"
          />
          <div className="flex-1">
            <label htmlFor="marketingConsent" className="text-sm text-gray-700">
              I would like to receive updates about new features and healthcare industry news
            </label>
            <p className="text-xs text-gray-500 mt-1">
              You can unsubscribe at any time
            </p>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-900">Security Notice</h4>
            <p className="text-sm text-blue-800 mt-1">
              Your information is encrypted and securely stored. We follow HIPAA guidelines and industry best practices to protect your data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step4Security; 