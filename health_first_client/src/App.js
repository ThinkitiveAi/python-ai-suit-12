import React, { useState } from 'react';
import ProviderLogin from './components/ProviderLogin';
import ProviderRegistration from './components/ProviderRegistration';
import PatientLogin from './components/PatientLogin';
import PatientRegistration from './components/PatientRegistration';
import ProviderAvailability from './components/ProviderAvailability';

function App() {
  const [currentPage, setCurrentPage] = useState('patient-login'); // 'patient-login', 'patient-register', 'provider-login', 'provider-register', 'provider-availability'

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'patient-login':
        return (
          <PatientLogin 
            onNavigateToRegister={() => handleNavigate('patient-register')} 
          />
        );
      case 'patient-register':
        return (
          <PatientRegistration 
            onNavigateToLogin={() => handleNavigate('patient-login')} 
          />
        );
      case 'provider-login':
        return (
          <ProviderLogin 
            onNavigateToRegister={() => handleNavigate('provider-register')} 
          />
        );
      case 'provider-register':
        return (
          <ProviderRegistration 
            onNavigateToLogin={() => handleNavigate('provider-login')} 
          />
        );
      case 'provider-availability':
        return <ProviderAvailability />;
      default:
        return (
          <PatientLogin 
            onNavigateToRegister={() => handleNavigate('patient-register')} 
          />
        );
    }
  };

  return (
    <div className="App">
      {renderCurrentPage()}
      
      {/* Navigation Toggle - Show on patient pages */}
      {(currentPage === 'patient-login' || currentPage === 'patient-register') && (
        <div className="fixed top-4 right-4">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-2">
            <div className="flex space-x-2">
              <button
                onClick={() => handleNavigate('patient-login')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  currentPage === 'patient-login'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Patient
              </button>
              <button
                onClick={() => handleNavigate('provider-login')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  currentPage === 'provider-login'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Provider
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Provider Navigation - Show on provider pages */}
      {(currentPage === 'provider-login' || currentPage === 'provider-register' || currentPage === 'provider-availability') && (
        <div className="fixed top-4 right-4">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-2">
            <div className="flex space-x-2">
              <button
                onClick={() => handleNavigate('provider-login')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  currentPage === 'provider-login'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => handleNavigate('provider-register')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  currentPage === 'provider-register'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Register
              </button>
              <button
                onClick={() => handleNavigate('provider-availability')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  currentPage === 'provider-availability'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Availability
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App; 