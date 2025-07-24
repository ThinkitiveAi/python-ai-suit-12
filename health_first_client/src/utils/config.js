// Configuration utility for environment variables
// Based on best practices from Node.js environment variables guide

class Config {
  constructor() {
    this.loadEnvironmentVariables();
  }

  loadEnvironmentVariables() {
    // API Configuration
    this.api = {
      baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api',
      version: process.env.REACT_APP_API_VERSION || 'v1',
      timeout: parseInt(process.env.REACT_APP_API_TIMEOUT) || 10000
    };

    // Application Settings
    this.app = {
      name: process.env.REACT_APP_APP_NAME || 'Health First',
      version: process.env.REACT_APP_APP_VERSION || '1.0.0',
      environment: process.env.REACT_APP_ENVIRONMENT || 'development'
    };

    // Authentication Settings
    this.auth = {
      sessionTimeout: parseInt(process.env.REACT_APP_SESSION_TIMEOUT) || 3600000,
      maxLoginAttempts: parseInt(process.env.REACT_APP_MAX_LOGIN_ATTEMPTS) || 5,
      jwtSecret: process.env.REACT_APP_JWT_SECRET || 'your-jwt-secret-key-here'
    };

    // Feature Flags
    this.features = {
      patientRegistration: process.env.REACT_APP_ENABLE_PATIENT_REGISTRATION === 'true',
      providerRegistration: process.env.REACT_APP_ENABLE_PROVIDER_REGISTRATION === 'true',
      twoFactorAuth: process.env.REACT_APP_ENABLE_2FA === 'true',
      smsVerification: process.env.REACT_APP_ENABLE_SMS_VERIFICATION === 'true'
    };

    // External Services
    this.services = {
      sms: process.env.REACT_APP_SMS_SERVICE_URL || 'https://api.twilio.com',
      email: process.env.REACT_APP_EMAIL_SERVICE_URL || 'https://api.sendgrid.com',
      fileUpload: process.env.REACT_APP_FILE_UPLOAD_URL || 'https://api.cloudinary.com'
    };

    // Analytics and Monitoring
    this.analytics = {
      googleAnalyticsId: process.env.REACT_APP_GOOGLE_ANALYTICS_ID || '',
      sentryDsn: process.env.REACT_APP_SENTRY_DSN || ''
    };

    // Development Settings
    this.development = {
      debugMode: process.env.REACT_APP_DEBUG_MODE === 'true',
      logLevel: process.env.REACT_APP_LOG_LEVEL || 'info',
      mockAPI: process.env.REACT_APP_MOCK_API === 'true'
    };

    // API Endpoints
    this.endpoints = {
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
  }

  // Getter methods for easy access
  get isDevelopment() {
    return this.app.environment === 'development';
  }

  get isProduction() {
    return this.app.environment === 'production';
  }

  get isStaging() {
    return this.app.environment === 'staging';
  }

  get isDebugMode() {
    return this.development.debugMode;
  }

  get isMockAPI() {
    return this.development.mockAPI;
  }

  // Feature flag checks
  isFeatureEnabled(feature) {
    return this.features[feature] || false;
  }

  // API URL builder
  getApiUrl(endpoint = '') {
    return `${this.api.baseURL}/${this.api.version}${endpoint}`;
  }

  // Validation methods
  validateRequiredConfig() {
    const required = [
      'REACT_APP_API_BASE_URL',
      'REACT_APP_ENVIRONMENT'
    ];

    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
      console.warn('Missing required environment variables:', missing);
      return false;
    }

    return true;
  }

  // Log configuration (only in development)
  logConfig() {
    if (this.isDevelopment && this.isDebugMode) {
      console.log('Application Configuration:', {
        app: this.app,
        api: this.api,
        features: this.features,
        environment: this.app.environment,
        debugMode: this.isDebugMode
      });
    }
  }

  // Get all configuration
  getAll() {
    return {
      api: this.api,
      app: this.app,
      auth: this.auth,
      features: this.features,
      services: this.services,
      analytics: this.analytics,
      development: this.development,
      endpoints: this.endpoints
    };
  }

  // Get specific configuration section
  get(section) {
    return this[section] || null;
  }

  // Update configuration (useful for testing)
  updateConfig(newConfig) {
    Object.assign(this, newConfig);
  }
}

// Create and export a singleton instance
const config = new Config();

// Log configuration in development
config.logConfig();

export default config; 