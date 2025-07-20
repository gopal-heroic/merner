import React, { useContext, useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { UserContext } from '../../App';
import TeacherHome from '../user/teacher/TeacherHome';
import AdminHome from '../admin/AdminHome';
import StudentHome from '../user/student/StudentHome';

const UserHome = () => {
   const user = useContext(UserContext);
   const [refreshKey, setRefreshKey] = useState(0);

   useEffect(() => {
      // Listen for enrollment success to refresh data
      const handleEnrollmentSuccess = () => {
         setRefreshKey(prev => prev + 1);
      };

      window.addEventListener('enrollmentSuccess', handleEnrollmentSuccess);
      
      return () => {
         window.removeEventListener('enrollmentSuccess', handleEnrollmentSuccess);
      };
   }, []);

   let content;
   switch (user.userData.type) {
      case "Teacher":
         content = <TeacherHome key={refreshKey} />
         break;
      case "Admin":
         content = <AdminHome key={refreshKey} />
         break;
      case "Student":
         content = <StudentHome key={refreshKey} />
         break;
      default:
         content = <div>Invalid user type</div>
         break;
   }

   return (
      <Container>
         {content}
      </Container>
   );
};

export default UserHome;