import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect, createContext } from "react";

import "./App.css";
import Home from "./components/common/Home";
import Login from "./components/common/Login";
import Register from "./components/common/Register";
import Dashboard from "./components/common/Dashboard";
import CourseContent from "./components/user/student/CourseContent";
import ErrorBoundary from "./components/common/ErrorBoundary";
import PrivateRoute from "./components/common/PrivateRoute";

export const UserContext = createContext();

function App() {
  const date = new Date().getFullYear();
  const [userData, setUserData] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    try {
      const user = localStorage.getItem("user");
      const token = localStorage.getItem("token");
      
      if (user && token) {
        const parsedUser = JSON.parse(user);
        setUserData(parsedUser);
        setUserLoggedIn(true);
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      // Clear corrupted data
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <UserContext.Provider value={{ userData, userLoggedIn, setUserData, setUserLoggedIn }}>
        <div className="App">
          <Router>
            <div className="content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route 
                  path="/dashboard" 
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/courseSection/:courseId/:courseTitle" 
                  element={
                    <PrivateRoute>
                      <CourseContent />
                    </PrivateRoute>
                  } 
                />
              </Routes>
            </div>
            <footer className="footer">
              <div className="text-center">
                <p className="mb-0">© {date} LearnHub. Empowering learners worldwide.</p>
              </div>
            </footer>
          </Router>
        </div>
      </UserContext.Provider>
    </ErrorBoundary>
  );
}

export default App;