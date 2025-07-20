import React, { useEffect, useState } from 'react'
import axiosInstance from '../../common/AxiosInstance';
import { Link } from 'react-router-dom';
import { Button, Card, Row, Col, Badge, ProgressBar, Container } from 'react-bootstrap';
import { Play, BookOpen, Clock, Award } from 'lucide-react';

const EnrolledCourses = () => {
   const [allEnrolledCourses, setAllEnrolledCourses] = useState([])
   const [loading, setLoading] = useState(true)

   const getAllEnrolledCourses = async () => {
      try {
         setLoading(true);
         const res = await axiosInstance.get('/api/user/getallcoursesuser', {
            headers: {
               "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
         })
         if (res.data.success) {
            setAllEnrolledCourses(res.data.data)
         } else {
            console.error('Failed to fetch enrolled courses:', res.data.message)
         }
      } catch (error) {
         console.error('Error fetching enrolled courses:', error);
      } finally {
         setLoading(false);
      }
   }

   useEffect(() => {
      getAllEnrolledCourses()
      
      // Listen for enrollment success events
      const handleEnrollmentSuccess = () => {
         getAllEnrolledCourses();
      };
      
      window.addEventListener('enrollmentSuccess', handleEnrollmentSuccess);
      
      return () => {
         window.removeEventListener('enrollmentSuccess', handleEnrollmentSuccess);
      };
   }, [])

   const isPaidCourse = (price) => {
      return /\d/.test(price) && price !== 'free';
   };

   const getCategoryColor = (category) => {
      switch (category) {
         case 'IT & Software': return 'primary'
         case 'Finance & Accounting': return 'success'
         case 'Personal Development': return 'warning'
         default: return 'secondary'
      }
   };

   if (loading) {
      return (
         <Container className="py-5">
            <div className="text-center">
               <div className="loading-spinner mx-auto mb-3"></div>
               <p>Loading your enrolled courses...</p>
            </div>
         </Container>
      );
   }

   return (
      <Container fluid className="py-4">
         <div className="mb-4 fade-in">
            <h1 className="text-gradient mb-2">My Enrolled Courses</h1>
            <p className="text-muted">Continue your learning journey</p>
            <div className="mb-3">
               <Badge bg="primary" className="me-2">
                  {allEnrolledCourses.length} Enrolled Courses
               </Badge>
               <Badge bg="success" className="me-2">
                  {Math.floor(allEnrolledCourses.length * 0.3)} Completed
               </Badge>
               <Badge bg="warning">
                  {allEnrolledCourses.length - Math.floor(allEnrolledCourses.length * 0.3)} In Progress
               </Badge>
            </div>
         </div>

         {allEnrolledCourses?.length > 0 ? (
            <Row className="g-4">
               {allEnrolledCourses.map((course) => (
                  <Col lg={4} md={6} key={course._id}>
                     <Card className="h-100 border-0 shadow-sm hover-lift course-card">
                        <div className="course-card-header">
                           <h5 className="course-title mb-1">{course.C_title}</h5>
                           <p className="course-educator mb-0">by {course.C_educator}</p>
                        </div>
                        
                        <Card.Body className="course-card-body">
                           <div className="course-meta mb-3">
                              <Badge className={`badge-${getCategoryColor(course.C_categories)}`}>
                                 {course.C_categories}
                              </Badge>
                              <span className={`course-price ${!isPaidCourse(course.C_price) ? 'free' : ''}`}>
                                 {isPaidCourse(course.C_price) ? `₹${course.C_price}` : 'FREE'}
                              </span>
                           </div>
                           
                           <p className="course-description">
                              {course.C_description.length > 100 
                                 ? `${course.C_description.substring(0, 100)}...` 
                                 : course.C_description
                              }
                           </p>
                           
                           <div className="course-stats mb-3">
                              <div className="course-stat">
                                 <BookOpen size={16} />
                                 <span>{course.sections?.length || 0} modules</span>
                              </div>
                              <div className="course-stat">
                                 <Clock size={16} />
                                 <span>Self-paced</span>
                              </div>
                           </div>

                           {/* Progress Bar - Placeholder for now */}
                           <div className="mb-3">
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                 <small className="text-muted">Progress</small>
                                 <small className="text-muted">0%</small>
                              </div>
                              <ProgressBar 
                                 now={0} 
                                 variant="success"
                                 style={{ height: '6px' }}
                                 className="rounded-pill"
                              />
                           </div>
                        </Card.Body>
                        
                        <div className="course-card-footer">
                           <Link 
                              to={`/courseSection/${course._id}/${encodeURIComponent(course.C_title)}`}
                              className="w-100"
                           >
                              <Button className="btn-primary-custom w-100 d-flex align-items-center justify-content-center gap-2">
                                 <Play size={16} />
                                 Continue Learning
                              </Button>
                           </Link>
                        </div>
                     </Card>
                  </Col>
               ))}
            </Row>
         ) : (
            <div className="text-center py-5">
               <div className="mb-4" style={{ fontSize: '4rem', opacity: 0.3 }}>
                  📚
               </div>
               <h4 className="text-muted mb-3">No enrolled courses yet</h4>
               <p className="text-muted mb-4">
                  Start your learning journey by enrolling in a course
               </p>
               <Button 
                  className="btn-primary-custom d-flex align-items-center gap-2 mx-auto"
                  onClick={() => {
                     window.dispatchEvent(new CustomEvent('navigateToSection', { detail: 'home' }));
                  }}
               >
                  <BookOpen size={20} />
                  Browse Courses
               </Button>
            </div>
         )}
      </Container>
   )
}

export default EnrolledCourses