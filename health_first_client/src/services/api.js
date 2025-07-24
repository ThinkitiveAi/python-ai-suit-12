import axios from 'axios';
import Cookies from 'js-cookie';

// API Configuration from environment variables
const API_CONFIG = {
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://192.168.0.163:5000/api',
  version: process.env.REACT_APP_API_VERSION || 'v1',
  timeout: parseInt(process.env.REACT_APP_API_TIMEOUT) || 10000,
  environment: process.env.REACT_APP_ENVIRONMENT || 'development',
  debugMode: process.env.REACT_APP_DEBUG_MODE === 'true',
  mockAPI: process.env.REACT_APP_MOCK_API === 'true'
};

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: `${API_CONFIG.baseURL}/${API_CONFIG.version}`,
  timeout: API_CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor to add authentication token
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add environment and debug headers
    config.headers['X-Environment'] = API_CONFIG.environment;
    if (API_CONFIG.debugMode) {
      config.headers['X-Debug-Mode'] = 'true';
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle authentication errors
    if (error.response?.status === 401) {
      Cookies.remove('auth_token');
      // Redirect to login page
      window.location.href = '/login';
    }
    
    // Handle server errors
    if (error.response?.status >= 500) {
      console.error('Server error:', error.response.data);
    }
    
    return Promise.reject(error);
  }
);

// API Endpoints from environment variables
const ENDPOINTS = {
  // Authentication
  auth: process.env.REACT_APP_AUTH_ENDPOINT || '/auth',
  login: process.env.REACT_APP_LOGIN_ENDPOINT || '/login',
  register: process.env.REACT_APP_REGISTER_ENDPOINT || '/register',
  forgotPassword: process.env.REACT_APP_FORGOT_PASSWORD_ENDPOINT || '/forgot-password',
  resetPassword: process.env.REACT_APP_RESET_PASSWORD_ENDPOINT || '/reset-password',
  
  // Patient endpoints
  patientLogin: process.env.REACT_APP_PATIENT_LOGIN_ENDPOINT || '/patient/login',
  patientRegister: process.env.REACT_APP_PATIENT_REGISTER_ENDPOINT || '/patient/register',
  patientProfile: process.env.REACT_APP_PATIENT_PROFILE_ENDPOINT || '/patient/profile',
  patientRecords: process.env.REACT_APP_PATIENT_RECORDS_ENDPOINT || '/patient/records',
  
  // Provider endpoints
  providerLogin: process.env.REACT_APP_PROVIDER_LOGIN_ENDPOINT || '/provider/login',
  providerRegister: process.env.REACT_APP_PROVIDER_REGISTER_ENDPOINT || '/provider/register',
  providerProfile: process.env.REACT_APP_PROVIDER_PROFILE_ENDPOINT || '/provider/profile',
  providerDashboard: process.env.REACT_APP_PROVIDER_DASHBOARD_ENDPOINT || '/provider/dashboard',
  providerAvailability: process.env.REACT_APP_PROVIDER_AVAILABILITY_ENDPOINT || '/provider/availability'
};

// API Service class
class ApiService {
  constructor() {
    this.config = API_CONFIG;
    this.endpoints = ENDPOINTS;
  }

  // Generic request method
  async request(method, endpoint, data = null, options = {}) {
    try {
      const config = {
        method,
        url: endpoint,
        ...options
      };

      if (data) {
        if (method.toLowerCase() === 'get') {
          config.params = data;
        } else {
          config.data = data;
        }
      }

      const response = await apiClient(config);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // GET request
  async get(endpoint, params = null, options = {}) {
    return this.request('GET', endpoint, params, options);
  }

  // POST request
  async post(endpoint, data = null, options = {}) {
    return this.request('POST', endpoint, data, options);
  }

  // PUT request
  async put(endpoint, data = null, options = {}) {
    return this.request('PUT', endpoint, data, options);
  }

  // DELETE request
  async delete(endpoint, options = {}) {
    return this.request('DELETE', endpoint, null, options);
  }

  // Authentication methods
  async login(credentials, userType = 'patient') {
    const endpoint = userType === 'patient' ? this.endpoints.patientLogin : this.endpoints.providerLogin;
    const response = await this.post(endpoint, credentials);
    
    if (response.token) {
      Cookies.set('auth_token', response.token, { 
        expires: 7, // 7 days
        secure: this.config.environment === 'production',
        sameSite: 'strict'
      });
    }
    
    return response;
  }

  async register(userData, userType = 'patient') {
    const endpoint = userType === 'patient' ? this.endpoints.patientRegister : this.endpoints.providerRegister;
    return this.post(endpoint, userData);
  }

  async forgotPassword(email, userType = 'patient') {
    return this.post(this.endpoints.forgotPassword, { email, userType });
  }

  async resetPassword(token, newPassword) {
    return this.post(this.endpoints.resetPassword, { token, newPassword });
  }

  // Patient methods
  async getPatientProfile() {
    return this.get(this.endpoints.patientProfile);
  }

  async updatePatientProfile(profileData) {
    return this.put(this.endpoints.patientProfile, profileData);
  }

  async getPatientRecords() {
    return this.get(this.endpoints.patientRecords);
  }

  // Provider methods
  async getProviderProfile() {
    return this.get(this.endpoints.providerProfile);
  }

  async updateProviderProfile(profileData) {
    return this.put(this.endpoints.providerProfile, profileData);
  }

  async getProviderDashboard() {
    return this.get(this.endpoints.providerDashboard);
  }

  // Availability Management methods
  async getProviderAvailability(dateRange = null) {
    const params = dateRange ? { startDate: dateRange.start, endDate: dateRange.end } : {};
    return this.get(this.endpoints.providerAvailability, params);
  }

  async addAvailability(availabilityData) {
    return this.post(this.endpoints.providerAvailability, availabilityData);
  }

  async updateAvailability(availabilityId, availabilityData) {
    return this.put(`${this.endpoints.providerAvailability}/${availabilityId}`, availabilityData);
  }

  async deleteAvailability(availabilityId) {
    return this.delete(`${this.endpoints.providerAvailability}/${availabilityId}`);
  }

  async bulkUpdateAvailability(updates) {
    return this.post(`${this.endpoints.providerAvailability}/bulk`, updates);
  }

  async getAvailabilityTemplates() {
    return this.get(`${this.endpoints.providerAvailability}/templates`);
  }

  async saveAvailabilityTemplate(templateData) {
    return this.post(`${this.endpoints.providerAvailability}/templates`, templateData);
  }

  async applyAvailabilityTemplate(templateId, dateRange) {
    return this.post(`${this.endpoints.providerAvailability}/templates/${templateId}/apply`, dateRange);
  }

  async exportAvailabilitySchedule(dateRange, format = 'pdf') {
    const params = { ...dateRange, format };
    return this.get(`${this.endpoints.providerAvailability}/export`, params);
  }

  async getAvailabilityConflicts(dateRange) {
    return this.get(`${this.endpoints.providerAvailability}/conflicts`, dateRange);
  }

  async getAvailabilityStatistics(dateRange) {
    return this.get(`${this.endpoints.providerAvailability}/statistics`, dateRange);
  }

  // Utility methods
  logout() {
    Cookies.remove('auth_token');
    // Redirect to login page
    window.location.href = '/login';
  }

  isAuthenticated() {
    return !!Cookies.get('auth_token');
  }

  getAuthToken() {
    return Cookies.get('auth_token');
  }

  // Error handling
  handleError(error) {
    if (this.config.debugMode) {
      console.error('API Error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });
    }

    // Log to external service in production
    if (this.config.environment === 'production' && process.env.REACT_APP_SENTRY_DSN) {
      // You can integrate with Sentry here
      console.error('Production error logged');
    }
  }

  // Configuration getters
  getConfig() {
    return this.config;
  }

  getEndpoints() {
    return this.endpoints;
  }

  // Feature flags
  isFeatureEnabled(feature) {
    const featureFlags = {
      patientRegistration: process.env.REACT_APP_ENABLE_PATIENT_REGISTRATION === 'true',
      providerRegistration: process.env.REACT_APP_ENABLE_PROVIDER_REGISTRATION === 'true',
      twoFactorAuth: process.env.REACT_APP_ENABLE_2FA === 'true',
      smsVerification: process.env.REACT_APP_ENABLE_SMS_VERIFICATION === 'true'
    };
    
    return featureFlags[feature] || false;
  }
}

// Create and export a singleton instance
const apiService = new ApiService();

export default apiService;
export { API_CONFIG, ENDPOINTS }; 