# LearnHub - Online Learning Platform

A comprehensive online learning platform built with React.js frontend and Node.js backend, featuring course management, user authentication, and progress tracking.
## Features

### For Students
- Browse and search courses
- Enroll in free and paid courses
- Track learning progress
- Download completion certificates
- Video-based learning modules

### For Teachers
- Create and manage courses
- Upload video content
- Track student enrollments
- Course analytics

### For Admins
- User management
- Course oversight
- Platform analytics
- ###Demo vedio link:
- https://drive.google.com/file/d/1_nYgZVVehekjr-A5OJ500djLZD2r57hz/view?usp=drivesdk

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB Atlas** for database
- **JWT** for authentication
- **Multer** for file uploads
- **bcryptjs** for password hashing

### Frontend
- **React.js** with Vite
- **React Router** for navigation
- **Bootstrap** & **Material-UI** for styling
- **Axios** for API calls
- **React Player** for video playback

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- Git

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure your `.env` file:
```env
MONGO_DB=mongodb+srv://username:password@cluster.mongodb.net/learnhub?retryWrites=true&w=majority
JWT_KEY=your_super_secret_jwt_key_here
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

5. Start the backend server:
```bash
npm start
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure your `.env` file:
```env
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=LearnHub
VITE_APP_VERSION=1.0.0
```

5. Start the frontend development server:
```bash
npm run dev
```

## MongoDB Atlas Setup

1. Create a MongoDB Atlas account at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Create a database user with read/write permissions
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string and update the `MONGO_DB` variable in your `.env` file

## API Endpoints

### Authentication
- `POST /api/user/register` - User registration
- `POST /api/user/login` - User login

### Courses
- `GET /api/user/getallcourses` - Get all courses (public)
- `POST /api/user/addcourse` - Create new course (teacher only)
- `GET /api/user/getallcoursesteacher` - Get teacher's courses
- `DELETE /api/user/deletecourse/:id` - Delete course

### Enrollment
- `POST /api/user/enrolledcourse/:id` - Enroll in course
- `GET /api/user/coursecontent/:id` - Get course content
- `POST /api/user/completemodule` - Mark module as complete
- `GET /api/user/getallcoursesuser` - Get user's enrolled courses

### Admin
- `GET /api/admin/getallusers` - Get all users
- `GET /api/admin/getallcourses` - Get all courses
- `DELETE /api/admin/deleteuser/:id` - Delete user
- `DELETE /api/admin/deletecourse/:id` - Delete course

## File Structure

```
learnhub/
├── backend/
│   ├── config/
│   │   └── connect.js
│   ├── controllers/
│   │   ├── adminController.js
│   │   └── userControllers.js
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   └── upload.js
│   ├── routers/
│   │   ├── adminRoutes.js
│   │   └── userRoutes.js
│   ├── schemas/
│   │   ├── courseModel.js
│   │   ├── coursePaymentModel.js
│   │   ├── enrolledCourseModel.js
│   │   └── userModel.js
│   ├── uploads/
│   ├── .env.example
│   ├── index.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   ├── common/
│   │   │   └── user/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- File upload restrictions
- CORS configuration
- Environment variable protection

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@learnhub.com or create an issue in the repository.
