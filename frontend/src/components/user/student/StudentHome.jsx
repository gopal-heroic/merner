import React, { useState, useEffect, useContext } from 'react'
import { Container, Row, Col, Card, Button, ProgressBar, Badge } from 'react-bootstrap'
import { BookOpen, Clock, Award, TrendingUp, Play, Star } from 'lucide-react'
import { UserContext } from '../../../App'
import AllCourses from '../../common/AllCourses'
import axiosInstance from '../../common/AxiosInstance'
import { Link } from 'react-router-dom'

const StudentHome = () => {
   const user = useContext(UserContext)
   const [enrolledCourses, setEnrolledCourses] = useState([])
   const [stats, setStats] = useState({
      totalEnrolled: 0,
      completedCourses: 0,
      inProgress: 0,
      certificates: 0
   })
   const [loading, setLoading] = useState(true)

   const getEnrolledCourses = async () => {
      try {
         const res = await axiosInstance.get('/api/user/getallcoursesuser', {
            headers: {
               "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
         })
         if (res.data.success) {
            setEnrolledCourses(res.data.data.slice(0, 3)) // Show only first 3 for dashboard
            calculateStats(res.data.data)
         }
      } catch (error) {
         console.log(error);
      } finally {
         setLoading(false)
      }
   }

   const calculateStats = (courses) => {
      // For now using placeholder calculations since we don't have completion tracking yet
      const totalEnrolled = courses.length
      const completedCourses = Math.floor(courses.length * 0.3) // 30% completion rate
      const inProgress = courses.length - completedCourses
      const certificates = Math.floor(courses.length * 0.2) // 20% have certificates

      setStats({
         totalEnrolled,
         completedCourses,
         inProgress,
         certificates
      })
   }

   useEffect(() => {
      getEnrolledCourses()
      
      // Listen for enrollment success events
      const handleEnrollmentSuccess = () => {
         getEnrolledCourses();
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
               <p>Loading dashboard...</p>
            </div>
         </Container>
      );
   }

   return (
      <Container fluid className="py-4">
         <div className="mb-5 fade-in">
            <div className="mb-4">
               <h1 className="text-gradient mb-2">Welcome back, {user.userData.name}! 👋</h1>
               <p className="text-muted">Continue your learning journey and achieve your goals</p>
            </div>

            {/* Stats Cards */}
            <Row className="g-4 mb-5">
               <Col md={3}>
                  <Card className="h-100 border-0 shadow-sm hover-lift">
                     <Card.Body className="text-center">
                        <div className="mb-3" style={{ color: 'var(--primary-color)' }}>
                           <BookOpen size={40} />
                        </div>
                        <h3 className="mb-1" style={{ color: 'var(--primary-color)' }}>
                           {stats.totalEnrolled}
                        </h3>
                        <p className="text-muted mb-0">Enrolled Courses</p>
                     </Card.Body>
                  </Card>
               </Col>
               <Col md={3}>
                  <Card className="h-100 border-0 shadow-sm hover-lift">
                     <Card.Body className="text-center">
                        <div className="mb-3" style={{ color: 'var(--success-color)' }}>
                           <Award size={40} />
                        </div>
                        <h3 className="mb-1" style={{ color: 'var(--success-color)' }}>
                           {stats.completedCourses}
                        </h3>
                        <p className="text-muted mb-0">Completed</p>
                     </Card.Body>
                  </Card>
               </Col>
               <Col md={3}>
                  <Card className="h-100 border-0 shadow-sm hover-lift">
                     <Card.Body className="text-center">
                        <div className="mb-3" style={{ color: 'var(--warning-color)' }}>
                           <Clock size={40} />
                        </div>
                        <h3 className="mb-1" style={{ color: 'var(--warning-color)' }}>
                           {stats.inProgress}
                        </h3>
                        <p className="text-muted mb-0">In Progress</p>
                     </Card.Body>
                  </Card>
               </Col>
               <Col md={3}>
                  <Card className="h-100 border-0 shadow-sm hover-lift">
                     <Card.Body className="text-center">
                        <div className="mb-3" style={{ color: 'var(--accent-color)' }}>
                           🏆
                        </div>
                        <h3 className="mb-1" style={{ color: 'var(--accent-color)' }}>
                           {stats.certificates}
                        </h3>
                        <p className="text-muted mb-0">Certificates</p>
                     </Card.Body>
                  </Card>
               </Col>
            </Row>

            {/* Continue Learning Section */}
            {enrolledCourses.length > 0 && (
               <div className="mb-5">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                     <h3>Continue Learning</h3>
                     <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => {
                           // Trigger navigation to enrolled courses
                           window.dispatchEvent(new CustomEvent('navigateToSection', { detail: 'enrolledcourese' }));
                        }}
                     >
                        View All Courses
                     </Button>
                  </div>
                  <Row className="g-4">
                     {enrolledCourses.map((course) => (
                        <Col md={4} key={course._id}>
                           <Card className="h-100 border-0 shadow-sm hover-lift">
                              <div className="course-card-header">
                                 <h5 className="course-title mb-1">{course.C_title}</h5>
                                 <p className="course-educator mb-0">by {course.C_educator}</p>
                              </div>
                              <Card.Body>
                                 <div className="mb-3">
                                    <Badge className={`badge-${getCategoryColor(course.C_categories)}`}>
                                       {course.C_categories}
                                    </Badge>
                                 </div>
                                 <div className="mb-3">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                       <small className="text-muted">Progress</small>
                                       <small className="text-muted">0%</small>
                                    </div>
                                    <ProgressBar now={0} variant="success" style={{ height: '6px' }} />
                                 </div>
                                 <div className="course-stats mb-3">
                                    <div className="course-stat">
                                       <span>📚</span>
                                       <span>{course.sections?.length || 0} modules</span>
                                    </div>
                                 </div>
                                 <Link to={`/courseSection/${course._id}/${encodeURIComponent(course.C_title)}`}>
                                    <Button className="btn-primary-custom w-100 d-flex align-items-center justify-content-center gap-2">
                                       <Play size={16} />
                                       Continue Learning
                                    </Button>
                                 </Link>
                              </Card.Body>
                           </Card>
                        </Col>
                     ))}
                  </Row>
               </div>
            )}

            {/* Recommended Courses Section */}
            <div className="mb-4">
               <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                     <h3>Discover New Courses</h3>
                     <p className="text-muted mb-0">Expand your knowledge with our featured courses</p>
                  </div>
               </div>
               <AllCourses />
            </div>

            {/* Learning Tips */}
            <Row className="g-4 mt-5">
               <Col md={6}>
                  <Card className="h-100 border-0 shadow-sm" style={{ background: 'var(--gradient-primary)', color: 'white' }}>
                     <Card.Body>
                        <div className="d-flex align-items-center mb-3">
                           <TrendingUp size={24} className="me-2" />
                           <h5 className="mb-0">Learning Tip</h5>
                        </div>
                        <p className="mb-0">
                           Set aside 30 minutes daily for consistent learning. Small, regular sessions are more effective than long, infrequent ones.
                        </p>
                     </Card.Body>
                  </Card>
               </Col>
               <Col md={6}>
                  <Card className="h-100 border-0 shadow-sm" style={{ background: 'var(--gradient-secondary)', color: 'white' }}>
                     <Card.Body>
                        <div className="d-flex align-items-center mb-3">
                           <Star size={24} className="me-2" />
                           <h5 className="mb-0">Achievement Unlocked</h5>
                        </div>
                        <p className="mb-0">
                           You're on a 3-day learning streak! Keep it up to unlock more achievements and boost your learning momentum.
                        </p>
                     </Card.Body>
                  </Card>
               </Col>
            </Row>
         </div>
      </Container>
   )
}

export default StudentHome