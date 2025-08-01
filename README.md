# Task Management System

A full-stack task management application built with React, Node.js, and MongoDB. This system provides role-based access control with admin and user functionalities, task management with file uploads, and a modern responsive UI.

## 🚀 Features

### Core Features
- **User Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (Admin/User)
  - Protected routes and middleware

- **Task Management**
  - Create, read, update, and delete tasks
  - Task status tracking (Todo, In Progress, Done)
  - Priority levels (Low, Medium, High)
  - Due date assignment
  - Task assignment to users
  - File/document uploads for tasks

- **Dashboard Features**
  - **Admin Dashboard**: Manage all tasks and users
  - **User Dashboard**: View assigned tasks and personal tasks
  - Advanced filtering and sorting
  - Pagination support
  - Real-time task updates

- **User Management** (Admin only)
  - View all users
  - Manage user roles
  - User-specific task views

### Technical Features
- **Frontend**: React 19 with Vite, Tailwind CSS, Radix UI
- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **File Uploads**: Multer middleware for document uploads
- **Testing**: Jest with Supertest for API testing
- **Containerization**: Docker and Docker Compose

## 🏗️ Project Structure

```
task-management-system/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # Auth context
│   │   ├── lib/           # Utilities and API config
│   │   ├── pages/         # Page components
│   │   ├── routes/        # Routing configuration
│   │   └── ui/           # Reusable UI components
│   └── package.json
├── server/                # Node.js backend
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Auth and upload middleware
│   │   ├── models/        # MongoDB schemas
│   │   ├── routes/        # API routes
│   │   └── uploads/       # File upload directory
│   ├── tests/            # API tests
│   └── package.json
├── docker-compose.yml     # Docker configuration
└── README.md
```

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible UI primitives
- **Lucide React** - Icon library
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **Bcryptjs** - Password hashing
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing

### Development & Testing
- **Jest** - Testing framework
- **Supertest** - HTTP testing
- **Docker** - Containerization
- **ESLint** - Code linting

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (or Docker for containerized setup)
- Git

### Option 1: Docker Setup (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd task-management-system
   ```

2. **Start with Docker Compose**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000
   - MongoDB: localhost:27017

### Option 2: Local Development Setup

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd task-management-system
   
   # Install backend dependencies
   cd server
   npm install
   
   # Install frontend dependencies
   cd ../client
   npm install
   ```

2. **Environment Setup**
   
   Create `.env` file in the server directory:
   ```env
   MONGO_URI=mongodb://localhost:27017/taskapp
   JWT_SECRET=your_jwt_secret_key
   PORT=3000
   ```

3. **Start the development servers**
   ```bash
   # Start backend (from server directory)
   cd server
   npm run dev
   
   # Start frontend (from client directory)
   cd ../client
   npm run dev
   ```

## 📋 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Tasks
- `GET /api/tasks` - Get all tasks (with filtering/pagination)
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get specific task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Users (Admin only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get specific user
- `PUT /api/users/:id` - Update user

## 🧪 Testing

### Backend Tests
```bash
cd server
npm test
```

### Frontend Tests
```bash
cd client
npm run test
```

## 🔧 Available Scripts

### Backend (server/)
- `npm start` - Start production server
- `npm run dev` - Start development server with watch mode
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode

### Frontend (client/)
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🐳 Docker Commands

```bash
# Build and start all services
docker-compose up --build

# Start in background
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild specific service
docker-compose up --build backend
```

## 📁 Key Components

### Frontend Components
- **AuthContext** - Authentication state management
- **ProtectedRoute/PublicRoute** - Route protection
- **UserDashboard** - User task management interface
- **AdminDashboard** - Admin task and user management
- **TaskForm** - Task creation/editing form
- **TaskCard** - Individual task display
- **ManageUser** - User management interface

### Backend Components
- **AuthController** - Authentication logic
- **TaskController** - Task CRUD operations
- **UserController** - User management
- **AuthMiddleware** - JWT verification
- **UploadMiddleware** - File upload handling

## 🔐 Environment Variables

### Backend (.env)
```env
MONGO_URI=mongodb://localhost:27017/taskapp
JWT_SECRET=your_secret_key_here
PORT=3000
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🆘 Support

For support, please open an issue in the repository or contact the development team.

---

**Note**: This is a full-stack task management system with role-based access control, file uploads, and modern UI/UX. The system supports both admin and user roles with different functionalities and permissions.


