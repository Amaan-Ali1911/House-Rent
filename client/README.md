# 🏠 House Rent Platform - Frontend

Modern React frontend for the House Rent property rental management platform built with **Vite**, **Tailwind CSS**, and **Ant Design**.

## ✨ Features

- ✅ User authentication with JWT tokens
- ✅ Role-based access control (Admin, Owner, User/Renter)
- ✅ Property browsing and management
- ✅ Booking system
- ✅ Responsive design
- ✅ Modern UI with Tailwind CSS and Ant Design

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- Backend running on `http://localhost:8000`

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open http://localhost:5173
```

### Backend Setup
```bash
cd HOUSE_RENT/server
npm start  # Runs on port 8000
```

## 📁 Project Structure

```
src/
├── config/          # API configuration
├── modules/
│   ├── common/      # Shared pages (Login, Register, Home)
│   ├── admin/       # Admin pages
│   └── user/        # User and Owner pages
├── images/          # Property images
└── App.jsx          # Main app with routing
```

## 🔌 API Integration

Backend API: `http://localhost:8000/api`

### Key Endpoints
- `POST /users/register` - Register
- `POST /users/login` - Login
- `GET /houses` - Get properties
- `POST /houses` - Add property (Owner)
- `GET /admin/*` - Admin endpoints
- `GET /owner/*` - Owner endpoints

## 🔐 Authentication

Users can register and login with JWT tokens. Tokens are stored in localStorage and sent with all API requests.

### User Roles
- **admin** - Admin dashboard and controls
- **owner** - Post and manage properties
- **user** - Browse and book properties

## 🛣️ Routes

### Public
- `/` - Home
- `/login` - Login
- `/register` - Register
- `/getAllProperties` - Browse properties

### Admin Only
- `/adminhome` - Admin dashboard
- `/admin/*` - Admin pages

### Owner Only
- `/ownerhome` - Owner dashboard
- `/owner/*` - Owner pages

### User Only
- `/renterhome` - Renter dashboard

## 📦 Building

```bash
# Build for production
npm run build

# Preview build
npm run preview
```

## 🧪 Testing

Test Credentials:
```
Admin: admin@example.com / password123
Owner: owner@example.com / password123
User: user@example.com / password123
```

## 🐛 Troubleshooting

**"Cannot connect to backend"**
- Ensure backend is running on port 8000
- Check `.env` file: `VITE_API_URL=http://localhost:8000`

**"Login not working"**
- Verify backend is running
- Check credentials
- Open DevTools Network tab to debug API calls

**"Styling not showing"**
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## 📚 Technologies

- React 19
- Vite
- React Router v7
- Axios
- Tailwind CSS
- Ant Design

## 📝 Environment Variables

```env
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=House Rent Platform
VITE_APP_VERSION=1.0.0
```

## 🎉 Ready to Go!

```bash
# Terminal 1
cd HOUSE_RENT/server && npm start

# Terminal 2
cd HOUSE_RENT/client && npm run dev
```

Visit:
- Frontend: http://localhost:5173
- Backend: http://localhost:8000

Happy coding! 🚀

---

**Built with ❤️ for the House Rent Platform**
