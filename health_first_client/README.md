# Health First - Healthcare Application

A comprehensive healthcare application with patient and provider interfaces, featuring secure authentication, multi-step registration, and environment-based configuration.

## 🏥 Features

### Patient Interface
- **Welcoming Login**: Calming, accessible patient login with flexible input (email/phone)
- **Patient Registration**: Multi-step registration wizard with comprehensive form validation
- **Security Features**: Password visibility toggle, secure authentication, password strength indicator
- **Error Handling**: User-friendly error messages and recovery options
- **Accessibility**: High contrast, large touch targets, screen reader support

### Provider Interface
- **Professional Login**: Clean, medical-themed provider authentication
- **Multi-Step Registration**: Comprehensive provider registration wizard
- **Availability Management**: Advanced calendar interface for appointment scheduling
- **Form Validation**: Real-time validation with helpful feedback
- **Progress Tracking**: Visual progress indicator for registration steps

### Technical Features
- **Environment Configuration**: Flexible API configuration via environment variables
- **API Integration**: Axios-based HTTP client with interceptors
- **Security**: JWT token management, secure cookie handling
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Calendar Management**: Multi-view calendar with drag-and-drop functionality

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd health_first_client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```bash
   # API Configuration
   REACT_APP_API_BASE_URL=http://192.168.0.163:5000/api
   REACT_APP_API_VERSION=v1
   REACT_APP_API_TIMEOUT=10000
   
   # Application Settings
   REACT_APP_APP_NAME=Health First
   REACT_APP_APP_VERSION=1.0.0
   REACT_APP_ENVIRONMENT=development
   
   # Feature Flags
   REACT_APP_ENABLE_PATIENT_REGISTRATION=true
   REACT_APP_ENABLE_PROVIDER_REGISTRATION=true
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔧 Environment Variables

### Required Variables
- `REACT_APP_API_BASE_URL`: Base URL for your API server
- `REACT_APP_ENVIRONMENT`: Environment (development, staging, production)

### API Configuration
```bash
REACT_APP_API_BASE_URL=http://192.168.0.163:5000/api
REACT_APP_API_VERSION=v1
REACT_APP_API_TIMEOUT=10000
```

### Authentication Endpoints
```bash
REACT_APP_AUTH_ENDPOINT=/auth
REACT_APP_LOGIN_ENDPOINT=/login
REACT_APP_REGISTER_ENDPOINT=/register
REACT_APP_FORGOT_PASSWORD_ENDPOINT=/forgot-password
REACT_APP_RESET_PASSWORD_ENDPOINT=/reset-password
```

### Patient API Endpoints
```bash
REACT_APP_PATIENT_LOGIN_ENDPOINT=/patient/login
REACT_APP_PATIENT_REGISTER_ENDPOINT=/patient/register
REACT_APP_PATIENT_PROFILE_ENDPOINT=/patient/profile
REACT_APP_PATIENT_RECORDS_ENDPOINT=/patient/records
```

### Provider API Endpoints
```bash
REACT_APP_PROVIDER_LOGIN_ENDPOINT=/provider/login
REACT_APP_PROVIDER_REGISTER_ENDPOINT=/provider/register
REACT_APP_PROVIDER_PROFILE_ENDPOINT=/provider/profile
REACT_APP_PROVIDER_DASHBOARD_ENDPOINT=/provider/dashboard
REACT_APP_PROVIDER_AVAILABILITY_ENDPOINT=/provider/availability
```

### Feature Flags
```bash
REACT_APP_ENABLE_PATIENT_REGISTRATION=true
REACT_APP_ENABLE_PROVIDER_REGISTRATION=true
REACT_APP_ENABLE_2FA=false
REACT_APP_ENABLE_SMS_VERIFICATION=false
```

### Development Settings
```bash
REACT_APP_DEBUG_MODE=true
REACT_APP_LOG_LEVEL=debug
REACT_APP_MOCK_API=false
```

## 📁 Project Structure

```
health_first_client/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── PatientLogin.js          # Patient login interface
│   │   ├── PatientRegistration.js   # Patient registration wizard
│   │   ├── ProviderLogin.js         # Provider login interface
│   │   ├── ProviderRegistration.js  # Provider registration wizard
│   │   ├── ProviderAvailability.js  # Provider availability management
│   │   └── registration/            # Registration step components
│   │       ├── Step1PersonalInfo.js
│   │       ├── Step2ProfessionalInfo.js
│   │       ├── Step3PracticeInfo.js
│   │       ├── Step4Security.js
│   │       └── Step5Review.js
│   ├── services/
│   │   └── api.js                  # API service with environment config
│   ├── utils/
│   │   └── config.js               # Environment configuration utility
│   ├── App.js                      # Main application component
│   ├── index.js                    # Application entry point
│   └── index.css                   # Global styles and Tailwind
├── .env                            # Environment variables (not in git)
├── .env.example                    # Environment template
├── .gitignore                      # Git ignore rules
├── package.json                    # Dependencies and scripts
├── tailwind.config.js              # Tailwind CSS configuration
└── README.md                       # This file
```

## 🛠️ Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run build:prod` - Build for production environment
- `npm run build:staging` - Build for staging environment
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## 🔒 Security Features

- **JWT Token Management**: Secure token storage in HTTP-only cookies
- **CSRF Protection**: Built-in CSRF protection with secure headers
- **Input Validation**: Client-side and server-side validation
- **Error Handling**: Secure error messages without exposing sensitive data
- **Session Management**: Configurable session timeouts
- **Password Strength**: Visual password strength indicator with requirements

## 🌐 API Integration

The application uses a centralized API service (`src/services/api.js`) that:

- **Environment Configuration**: Uses environment variables for API endpoints
- **Request Interceptors**: Automatically adds authentication headers
- **Response Interceptors**: Handles common errors (401, 500, etc.)
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Feature Flags**: Environment-based feature toggles

### API Service Usage

```javascript
import apiService from '../services/api';

// Patient login
const response = await apiService.login(credentials, 'patient');

// Patient registration
const response = await apiService.register(userData, 'patient');

// Provider registration
const response = await apiService.register(userData, 'provider');

// Availability management
const availability = await apiService.getProviderAvailability();
const newSlot = await apiService.addAvailability(slotData);
const updatedSlot = await apiService.updateAvailability(slotId, updatedData);
const deletedSlot = await apiService.deleteAvailability(slotId);

// Check authentication
if (apiService.isAuthenticated()) {
  // User is logged in
}
```

## 🎨 Design System

### Color Palette
- **Primary Blue**: `#2563eb` - Professional medical theme
- **Secondary Green**: `#059669` - Healthcare associations
- **Patient Blue**: `#3b82f6` - Calming patient interface
- **Patient Green**: `#10b981` - Soothing healthcare colors
- **Availability Colors**: 
  - Available: `#10b981` (Green)
  - Booked: `#3b82f6` (Blue)
  - Blocked: `#ef4444` (Red)
  - Tentative: `#f59e0b` (Yellow)
  - Break: `#6b7280` (Gray)
- **Neutral Grays**: Various shades for text and backgrounds

### Typography
- **Font Family**: Inter (Google Fonts)
- **Font Weights**: Regular, Medium, Semibold, Bold
- **Responsive**: Mobile-first typography scaling

### Components
- **Input Fields**: Consistent styling with focus states
- **Buttons**: Primary and secondary button styles
- **Cards**: Clean, modern card components
- **Navigation**: Responsive navigation with proper alignment
- **Progress Indicators**: Visual step progress for multi-step forms
- **Calendar Views**: Multi-view calendar with drag-and-drop functionality

## ♿ Accessibility

- **WCAG 2.1 AA Compliance**: High contrast ratios and proper focus management
- **Screen Reader Support**: Semantic HTML and ARIA labels
- **Keyboard Navigation**: Full keyboard accessibility
- **Touch Targets**: Minimum 44px touch targets for mobile
- **Error Handling**: Clear, helpful error messages
- **Age-Friendly Design**: Large text options and simple navigation
- **Calendar Accessibility**: Keyboard navigation for calendar interactions

## 📱 Responsive Design

- **Mobile-First**: Optimized for mobile devices
- **Tablet Support**: Responsive layouts for tablet screens
- **Desktop Optimization**: Enhanced layouts for larger screens
- **Orientation Support**: Proper handling of device rotation
- **Calendar Responsiveness**: Adaptive calendar views for different screen sizes

## 🔧 Configuration

### Environment-Based Configuration

The application uses environment variables for configuration, following the [Create React App environment variables guide](https://create-react-app.dev/docs/adding-custom-environment-variables/) and [Node.js environment variables best practices](https://medium.com/the-node-js-collection/making-your-node-js-work-everywhere-with-environment-variables-2da8cdf6e786):

1. **Development**: Uses `.env` file for local development
2. **Staging**: Environment variables set in staging environment
3. **Production**: Environment variables set in production environment

### Configuration Utility

The `src/utils/config.js` utility provides:

- **Type-Safe Access**: Centralized configuration management
- **Environment Detection**: Automatic environment detection
- **Feature Flags**: Environment-based feature toggles
- **Validation**: Required configuration validation

## 🚀 Deployment

### Development
```bash
npm start
```

### Production Build
```bash
npm run build:prod
```

### Environment-Specific Builds
```bash
# Staging
npm run build:staging

# Production
npm run build:prod
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- **Documentation**: Check this README and inline code comments
- **Issues**: Create an issue in the repository
- **Email**: Contact the development team

## 🔄 Version History

- **v1.0.0**: Initial release with patient and provider interfaces
- **v1.1.0**: Added environment variable configuration
- **v1.2.0**: Enhanced API integration and error handling
- **v1.3.0**: Added comprehensive Patient Registration wizard
- **v1.4.0**: Added Provider Availability Management system

---

Built with ❤️ for healthcare professionals and patients.