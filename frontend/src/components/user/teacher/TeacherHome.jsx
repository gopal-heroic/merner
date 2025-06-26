import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, Container, Row, Col, Badge, Modal, ProgressBar } from 'react-bootstrap';
import { PlusCircle, BookOpen, Users, TrendingUp, Eye, Trash2, Edit3 } from 'lucide-react';
import axiosInstance from '../../common/AxiosInstance';

const TeacherHome = () => {
   const [allCourses, setAllCourses] = useState([]);
   const [stats, setStats] = useState({
      totalCourses: 0,
      totalStudents: 0,
      totalRevenue: 0,
      avgRating: 0
   });
   const [loading, setLoading] = useState(true);
   const [showModal, setShowModal] = useState(false);
   const [selectedCourse, setSelectedCourse] = useState(null);

   const getAllCoursesUser = async () => {
      try {
         const res = await axiosInstance.get(`api/user/getallcoursesteacher`, {
            headers: {
               Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
         });
         if (res.data.success) {
            setAllCourses(res.data.data);
            calculateStats(res.data.data);
         }
      } catch (error) {
         console.log('An error occurred:', error);
      } finally {
         setLoading(false);
      }
   };

   const calculateStats = (courses) => {
      const totalStudents = courses.reduce((sum, course) => sum + course.enrolled, 0);
      const totalRevenue = courses.reduce((sum, course) => {
         const price = course.C_price === 'free' ? 0 : parseFloat(course.C_price) || 0;
         return sum + (price * course.enrolled);
      }, 0);

      setStats({
         totalCourses: courses.length,
         totalStudents,
         totalRevenue,
         avgRating: 4.5 // Placeholder since we don't have ratings yet
      });
   };

   useEffect(() => {
      getAllCoursesUser();
   }, []);

   const toggleDescription = (courseId) => {
      setAllCourses((prevCourses) =>
         prevCourses.map((course) =>
            course._id === courseId
               ? { ...course, showFullDescription: !course.showFullDescription }
               : course
         )
      );
   };

   const deleteCourse = async (courseId) => {
      const confirmation = window.confirm('Are you sure you want to delete this course? This action cannot be undone.')
      if (!confirmation) {
         return;
      }
      try {
         const res = await axiosInstance.delete(`api/user/deletecourse/${courseId}`, {
            headers: {
               Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
         })
         if (res.data.success) {
            alert(res.data.message)
            getAllCoursesUser()
         } else {
            alert("Failed to delete the course")
         }
      } catch (error) {
         console.log('An error occurred:', error);
      }
   }

   const viewCourseDetails = (course) => {
      setSelectedCourse(course);
      setShowModal(true);
   };

   const isPaidCourse = (price) => {
      return /\d/.test(price) && price !== 'free';
   };

   if (loading) {
      return (
         <Container className="py-5">
            <div className="text-center">
               <div className="loading-spinner mx-auto mb-3"></div>
               <p>Loading your courses...</p>
            </div>
         </Container>
      );
   }

   return (
      <Container fluid className="py-4">
         <div className="mb-5 fade-in">
            <div className="d-flex justify-content-between align-items-center mb-4">
               <div>
                  <h1 className="text-gradient mb-2">Teacher Dashboard</h1>
                  <p className="text-muted">Manage your courses and track your teaching progress</p>
               </div>
               <Button 
                  className="btn-primary-custom d-flex align-items-center gap-2"
                  onClick={() => window.location.hash = '#addcourse'}
               >
                  <PlusCircle size={20} />
                  Create New Course
               </Button>
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
                           {stats.totalCourses}
                        </h3>
                        <p className="text-muted mb-0">Total Courses</p>
                     </Card.Body>
                  </Card>
               </Col>
               <Col md={3}>
                  <Card className="h-100 border-0 shadow-sm hover-lift">
                     <Card.Body className="text-center">
                        <div className="mb-3" style={{ color: 'var(--success-color)' }}>
                           <Users size={40} />
                        </div>
                        <h3 className="mb-1" style={{ color: 'var(--success-color)' }}>
                           {stats.totalStudents}
                        </h3>
                        <p className="text-muted mb-0">Total Students</p>
                     </Card.Body>
                  </Card>
               </Col>
               <Col md={3}>
                  <Card className="h-100 border-0 shadow-sm hover-lift">
                     <Card.Body className="text-center">
                        <div className="mb-3" style={{ color: 'var(--accent-color)' }}>
                           <TrendingUp size={40} />
                        </div>
                        <h3 className="mb-1" style={{ color: 'var(--accent-color)' }}>
                           ₹{stats.totalRevenue.toLocaleString()}
                        </h3>
                        <p className="text-muted mb-0">Total Revenue</p>
                     </Card.Body>
                  </Card>
               </Col>
               <Col md={3}>
                  <Card className="h-100 border-0 shadow-sm hover-lift">
                     <Card.Body className="text-center">
                        <div className="mb-3" style={{ color: 'var(--warning-color)' }}>
                           ⭐
                        </div>
                        <h3 className="mb-1" style={{ color: 'var(--warning-color)' }}>
                           {stats.avgRating}
                        </h3>
                        <p className="text-muted mb-0">Avg Rating</p>
                     </Card.Body>
                  </Card>
               </Col>
            </Row>
         </div>

         {/* Courses Grid */}
         <div className="mb-4">
            <h3 className="mb-4">Your Courses</h3>
            {allCourses?.length > 0 ? (
               <div className="card-container">
                  {allCourses.map((course) => (
                     <Card key={course._id} className="course-card slide-up">
                        <div className="course-card-header">
                           <h4 className="course-title">{course.C_title}</h4>
                           <p className="course-educator">by {course.C_educator}</p>
                        </div>
                        
                        <Card.Body className="course-card-body">
                           <div className="course-meta mb-3">
                              <Badge className={`badge-${course.C_categories === 'IT & Software' ? 'primary' : course.C_categories === 'Finance & Accounting' ? 'success' : 'warning'}`}>
                                 {course.C_categories}
                              </Badge>
                              <span className={`course-price ${!isPaidCourse(course.C_price) ? 'free' : ''}`}>
                                 {isPaidCourse(course.C_price) ? `₹${course.C_price}` : 'FREE'}
                              </span>
                           </div>
                           
                           <p className="course-description">
                              {course.showFullDescription
                                 ? course.C_description
                                 : course.C_description.slice(0, 100)}{' '}
                              {course.C_description.length > 100 && (
                                 <span
                                    className='text-primary'
                                    style={{ cursor: 'pointer', fontWeight: 600 }}
                                    onClick={() => toggleDescription(course._id)}
                                 >
                                    {course.showFullDescription ? ' Read Less' : '... Read More'}
                                 </span>
                              )}
                           </p>
                           
                           <div className="course-stats">
                              <div className="course-stat">
                                 <span>📚</span>
                                 <span>{course.sections.length} modules</span>
                              </div>
                              <div className="course-stat">
                                 <span>👥</span>
                                 <span>{course.enrolled} enrolled</span>
                              </div>
                           </div>

                           {/* Enrollment Progress */}
                           <div className="mt-3">
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                 <small className="text-muted">Enrollment Progress</small>
                                 <small className="text-muted">{course.enrolled}/100</small>
                              </div>
                              <ProgressBar 
                                 now={Math.min((course.enrolled / 100) * 100, 100)} 
                                 variant="success"
                                 style={{ height: '6px' }}
                              />
                           </div>
                        </Card.Body>
                        
                        <div className="course-card-footer">
                           <div className="d-flex gap-2">
                              <Button
                                 variant="outline-primary"
                                 size="sm"
                                 className="flex-fill d-flex align-items-center justify-content-center gap-1"
                                 onClick={() => viewCourseDetails(course)}
                              >
                                 <Eye size={16} />
                                 View
                              </Button>
                              <Button
                                 variant="outline-danger"
                                 size="sm"
                                 className="flex-fill d-flex align-items-center justify-content-center gap-1"
                                 onClick={() => deleteCourse(course._id)}
                              >
                                 <Trash2 size={16} />
                                 Delete
                              </Button>
                           </div>
                        </div>
                     </Card>
                  ))}
               </div>
            ) : (
               <div className="text-center py-5">
                  <div className="mb-4" style={{ fontSize: '4rem', opacity: 0.3 }}>
                     📚
                  </div>
                  <h4 className="text-muted mb-3">No courses created yet</h4>
                  <p className="text-muted mb-4">
                     Start your teaching journey by creating your first course
                  </p>
                  <Button 
                     className="btn-primary-custom d-flex align-items-center gap-2 mx-auto"
                     onClick={() => window.location.hash = '#addcourse'}
                  >
                     <PlusCircle size={20} />
                     Create Your First Course
                  </Button>
               </div>
            )}
         </div>

         {/* Course Details Modal */}
         <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
            <Modal.Header closeButton className="border-0">
               <Modal.Title>Course Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               {selectedCourse && (
                  <div>
                     <div className="mb-4">
                        <h4 className="text-primary">{selectedCourse.C_title}</h4>
                        <p className="text-muted">by {selectedCourse.C_educator}</p>
                     </div>
                     
                     <Row className="mb-4">
                        <Col md={6}>
                           <div className="mb-3">
                              <strong>Category:</strong>
                              <Badge className="ms-2 badge-primary">{selectedCourse.C_categories}</Badge>
                           </div>
                           <div className="mb-3">
                              <strong>Price:</strong>
                              <span className="ms-2 fw-bold text-success">
                                 {isPaidCourse(selectedCourse.C_price) ? `₹${selectedCourse.C_price}` : 'FREE'}
                              </span>
                           </div>
                        </Col>
                        <Col md={6}>
                           <div className="mb-3">
                              <strong>Modules:</strong>
                              <span className="ms-2">{selectedCourse.sections.length}</span>
                           </div>
                           <div className="mb-3">
                              <strong>Enrolled Students:</strong>
                              <span className="ms-2 fw-bold text-primary">{selectedCourse.enrolled}</span>
                           </div>
                        </Col>
                     </Row>
                     
                     <div className="mb-4">
                        <strong>Description:</strong>
                        <p className="mt-2">{selectedCourse.C_description}</p>
                     </div>
                     
                     <div>
                        <strong>Course Modules:</strong>
                        <div className="mt-2">
                           {selectedCourse.sections.map((section, index) => (
                              <div key={index} className="border rounded p-3 mb-2">
                                 <h6 className="mb-1">{section.S_title}</h6>
                                 <p className="text-muted mb-0 small">{section.S_description}</p>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
               )}
            </Modal.Body>
         </Modal>
      </Container>
   );
};

export default TeacherHome;