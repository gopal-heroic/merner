import React, { useContext, useState, useEffect } from 'react';
import NavBar from './NavBar';
import UserHome from "./UserHome"
import { Container } from 'react-bootstrap';
import AddCourse from '../user/teacher/AddCourse';
import StudentHome from '../user/student/StudentHome';
import AdminHome from '../admin/AdminHome';
import { UserContext } from '../../App';
import EnrolledCourses from '../user/student/EnrolledCourses';
import AllCourses from '../admin/AllCourses';
import AdminStatistics from '../admin/AdminStatistics';

const Dashboard = () => {
   const user = useContext(UserContext)
   const [selectedComponent, setSelectedComponent] = useState('home');

   // Listen for enrollment success to refresh data
   useEffect(() => {
      const handleEnrollmentSuccess = () => {
         // Force re-render of current component
         setSelectedComponent(prev => prev);
      };

      window.addEventListener('enrollmentSuccess', handleEnrollmentSuccess);
      
      return () => {
         window.removeEventListener('enrollmentSuccess', handleEnrollmentSuccess);
      };
   }, []);

   const renderSelectedComponent = () => {
      switch (selectedComponent) {
         case 'home':
            return <UserHome />
         case 'addcourse':
            return <AddCourse />
         case 'enrolledcourese':
            return <EnrolledCourses />
         case 'cousres':
            return <AllCourses />
         case 'statistics':
            return <AdminStatistics />
         default:
            return <UserHome />
      }
   };

   return (
      <>
         <NavBar setSelectedComponent={setSelectedComponent} />
         <Container className='my-3'>
            {renderSelectedComponent()}
         </Container>
      </>
   );
};

export default Dashboard;