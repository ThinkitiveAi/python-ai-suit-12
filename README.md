# python-ai-suit-12

A modern healthcare management solution, featuring a robust backend for provider registration and a responsive frontend for healthcare providers and patients.

---

## 📦 Repository Structure

- `health-first-server/` — Flask-based backend for provider registration and management
- `health_first_client/` — React + TypeScript frontend for providers and patients

---

## 🖥️ Healthcare Provider Registration Service (`health-first-server/`)

A secure and robust Flask backend for registering healthcare providers, supporting advanced validation, email verification, and multiple database types.

### 🔑 Features

- Secure provider registration with comprehensive validation
- Supports MySQL, PostgreSQL, and MongoDB databases
- Email verification system
- Rate limiting to prevent abuse
- Secure password hashing (bcrypt)
- Input sanitization and validation
- Detailed error handling & audit logging
- API documentation

### ⚖️ Prerequisites

- Python 3.8+
- MySQL, PostgreSQL, or MongoDB
- Redis (optional, for rate limiting)
- SMTP server for email verification

### 🚀 Setup & Installation

```bash
git clone <repository-url>
cd health-first-server

# Create & activate a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your DB, email, and security settings
```

### 🛠️ Database Setup

- MySQL:

```sql
CREATE DATABASE health_first CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

- PostgreSQL:

```sql
CREATE DATABASE health_first;
```

- MongoDB:

> No setup required if running with defaults.

### ▶️ Running the App

- Development:

```bash
flask run
```

- Production:

```bash
gunicorn run:app
```

### 🔮 Testing

- Run tests:

```bash
pytest
```

- With coverage:

```bash
pytest --cov=src tests/
```

### 🔹 API Highlights

- `POST /api/v1/provider/register` — Provider registration
- `GET /api/v1/provider/verify/<token>` — Email verification

### 🔐 Security

- Password hashing (bcrypt)
- Rate limiting
- Input validation & sanitization
- Secure email verification tokens
- Sensitive data redaction in logs

---

## 💻 Healthcare Management Frontend (`health_first_client/`)

A modern, responsive frontend built with React, TypeScript, and Mantine UI, catering to both providers and patients.

### 👨‍⚕️ For Healthcare Providers

- Secure registration & login with license verification
- Professional dashboard & patient management
- Appointment scheduling & management
- Secure messaging & communication tools
- Billing, reports, & referral management

### 👨‍👩‍⚕️ For Patients

- Easy registration & login
- Personal dashboard for medical records and appointments
- Provider search and appointment booking
- Secure messaging with providers

### 🛠️ Tech Stack

- React 18, TypeScript
- Mantine UI, TanStack Router
- Formik + Yup, Axios, Tabler Icons

### ⚖️ Prerequisites

- Node.js (16+), npm (7+) or yarn, Git

### 🚀 Installation & Setup

```bash
git clone <repository-url>
cd health_first_client

# Install dependencies
npm install
# or
yarn install

# Start development server
npm start
# or
yarn start
```

> App runs at: `http://localhost:3000`

### 📆 Build for Production

```bash
npm run build
# or
yarn build
```

---

## 🔌 API Configuration

- Base URL (default): `http://192.168.0.201:8000`
- API endpoints used:
  - `POST /api/v1/provider/register`
  - `POST /api/v1/provider/login`

> Automatic fallback to dummy data if API is unavailable

---

## 📊 Test Credentials

### 💪 Provider Login

- Email: `provider@medical.com` | Password: `password123`
- Phone: `+15551234567` | Password: `password123`

### 👨‍⚕️ Patient Login

- Email: `patient@healthcare.com` | Password: `patient123`
- Phone: `+15559876543` | Password: `patient123`

---

## 📁 Project Structure

```text
src/
 ├── components/         # Reusable React components
 ├── services/           # API services and utilities
 ├── App.tsx             # Main app component with routing
 └── index.tsx           # App entry point
```

---

## 🔐 Security & UX

- Input validation (Yup), strong password enforcement
- JWT token authentication, HTTPS ready
- Responsive design, dark/light themes, accessibility (WCAG)
- Modern animations, smooth loading, error handling

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch:

```bash
git checkout -b feature/amazing-feature
```

3. Commit your changes:

```bash
git commit -m "Add some amazing feature"
```

4. Push to your branch:

```bash
git push origin feature/amazing-feature
```

5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🚘 Support

- Create an issue in the repository for bugs and questions
- Contact the development team
- Check the documentation

---

## 🔄 API Integration Status

- ✅ Provider Registration & Login — Fully integrated
- ⏳ Patient Registration & Login — In development
- ⏳ Dashboard & Appointment APIs — Planned

> Note: The frontend application includes fallback mechanisms: if the backend API is unavailable, dummy credentials and mock responses maintain functionality during development.

