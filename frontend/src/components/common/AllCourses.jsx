import React, { useState, useEffect, useContext } from 'react';
import axiosInstance from './AxiosInstance';
import { Button, Modal, Form, Badge } from 'react-bootstrap';
import { UserContext } from '../../App';
import { Link, useNavigate } from 'react-router-dom';
import {
   MDBCol,
   MDBInput,
   MDBRow,
} from "mdb-react-ui-kit";

const AllCourses = () => {
   const navigate = useNavigate()
   const user = useContext(UserContext)
   const [allCourses, setAllCourses] = useState([]);
   const [filterTitle, setFilterTitle] = useState('');
   const [filterType, setFilterType] = useState('');
   const [loading, setLoading] = useState(true);
   const [enrolledIds, setEnrolledIds] = useState(new Set());

   const [showModal, setShowModal] = useState([]);
   const [cardDetails, setCardDetails] = useState({
      cardholdername: '',
      cardnumber: '',
      cvvcode: '',
      expmonthyear: '',
   })

   const handleChange = (e) => {
      setCardDetails({ ...cardDetails, [e.target.name]: e.target.value })
   }

   const handleShow = (courseIndex, coursePrice, courseId, courseTitle) => {
      if (coursePrice == 'free') {
         handleSubmit(courseId, courseTitle)
         return
      } else {
         const updatedShowModal = [...showModal];
         updatedShowModal[courseIndex] = true;
         setShowModal(updatedShowModal);
      }
   };

   const handleClose = (courseIndex) => {
      const updatedShowModal = [...showModal];
      updatedShowModal[courseIndex] = false;
      setShowModal(updatedShowModal);
   };

   const getAllCoursesUser = async () => {
      try {
         setLoading(true);
         const res = await axiosInstance.get('/api/user/getallcourses');
         if (res.data.success) {
            setAllCourses(res.data.data);
            // Initialize showModal array with correct length
            setShowModal(Array(res.data.data.length).fill(false));
         }
      } catch (error) {
         console.log('An error occurred:', error);
      } finally {
         setLoading(false);
      }
   };

   // Get user's enrolled courses to track enrollment status
   const getUserEnrolledCourses = async () => {
      if (!user.userLoggedIn) return;
      
      try {
         const res = await axiosInstance.get('/api/user/getallcoursesuser', {
            headers: {
               Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
         });
         if (res.data.success) {
            const enrolledCourseIds = new Set(res.data.data.map(course => course._id));
            setEnrolledIds(enrolledCourseIds);
         }
      } catch (error) {
         console.log('Error fetching enrolled courses:', error);
      }
   };

   useEffect(() => {
      getAllCoursesUser();
      getUserEnrolledCourses();
   }, [user.userLoggedIn]);

   const isPaidCourse = (course) => {
      return /\d/.test(course.C_price);
   };

   const handleSubmit = async (courseId, courseTitle) => {
      try {
         // Prepare the enrollment data
         const enrollmentData = {
            ...cardDetails
         };

         const res = await axiosInstance.post(`/api/user/enrolledcourse/${courseId}`, enrollmentData, {
            headers: {
               Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
         })
         
         if (res.data.success) {
            alert(res.data.message);
            
            // Add courseId to enrolledIds state
            setEnrolledIds(prev => new Set([...prev, courseId]));
            
            // Re-fetch the course list to update enrollment counts
            getAllCoursesUser();
            
            // Dispatch global event for other components to listen
            window.dispatchEvent(new Event('enrollmentSuccess'));
            
            // Navigate to course content
            navigate(`/courseSection/${courseId}/${encodeURIComponent(courseTitle)}`);
         } else {
            if (res.data.message.includes("already enrolled")) {
               alert(res.data.message);
               navigate(`/courseSection/${courseId}/${encodeURIComponent(courseTitle)}`);
            } else {
               alert(res.data.message);
            }
         }
      } catch (error) {
         console.log('An error occurred:', error);
         if (error.response?.status === 409) {
            alert("You are already enrolled in this course");
            navigate(`/courseSection/${courseId}/${encodeURIComponent(courseTitle)}`);
         } else {
            alert("Failed to enroll in course. Please try again.");
         }
      }
   }

   const handlePaymentSubmit = async (courseId, courseTitle, courseIndex) => {
      try {
         // First call fake payment endpoint
         const paymentRes = await axiosInstance.get(`/api/user/fake-payment/${courseId}`, {
            headers: {
               Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
         });

         if (paymentRes.data.success) {
            // Navigate to payment success page
            navigate(`/payment-success/${paymentRes.data.payment.paymentId}`, {
               state: {
                  payment: paymentRes.data.payment,
                  courseTitle,
                  courseId
               }
            });
            
            // Close modal
            handleClose(courseIndex);
            
            // Then proceed with enrollment
            await handleSubmit(courseId, courseTitle);
         }
      } catch (error) {
         console.log('Payment error:', error);
         alert("Payment processing failed. Please try again.");
      }
   };

   const filteredCourses = allCourses
      .filter(course =>
         filterTitle === '' ||
         course.C_title?.toLowerCase().includes(filterTitle?.toLowerCase())
      )
      .filter(course => {
         if (filterType === 'Free') {
            return !isPaidCourse(course);
         } else if (filterType === 'Paid') {
            return isPaidCourse(course);
         } else {
            return true;
         }
      });

   if (loading) {
      return (
         <div className="text-center py-5">
            <div className="loading-spinner mx-auto mb-3"></div>
            <p>Loading courses...</p>
         </div>
      );
   }

   return (
      <>
         <div className="filter-section fade-in">
            <div className="filter-controls">
               <div className="flex-grow-1">
                  <input
                     type="text"
                     placeholder="Search courses..."
                     value={filterTitle}
                     onChange={(e) => setFilterTitle(e.target.value)}
                     className="filter-input"
                  />
               </div>
               <select 
                  value={filterType} 
                  onChange={(e) => setFilterType(e.target.value)}
                  className="filter-select"
               >
                  <option value="">All Courses</option>
                  <option value="Paid">Paid Courses</option>
                  <option value="Free">Free Courses</option>
               </select>
            </div>
         </div>

         <div className='card-container'>
            {filteredCourses?.length > 0 ? (
               filteredCourses.map((course, index) => {
                  const isEnrolled = enrolledIds.has(course._id);
                  
                  return (
                     <div key={course._id} className='course-card slide-up hover-lift'>
                        <div className="course-card-header">
                           <h3 className="course-title">{course.C_title}</h3>
                           <p className="course-educator">by {course.C_educator}</p>
                        </div>
                        
                        <div className="course-card-body">
                           <div className="course-meta">
                              <Badge className={`badge-${isPaidCourse(course) ? 'success' : 'warning'}`}>
                                 {course.C_categories}
                              </Badge>
                              <span className={`course-price ${!isPaidCourse(course) ? 'free' : ''}`}>
                                 {isPaidCourse(course) ? `₹${course.C_price}` : 'FREE'}
                              </span>
                           </div>
                           
                           <p className="course-description">
                              {course.C_description}
                           </p>
                           
                           <div className="course-stats">
                              <div className="course-stat">
                                 <span>📚</span>
                                 <span>{course.sections.length} modules</span>
                              </div>
                              <div className="course-stat">
                                 <span>👥</span>
                                 <span>{course.enrolled || 0} enrolled</span>
                              </div>
                           </div>
                        </div>
                        
                        <div className="course-card-footer">
                           {user.userLoggedIn === true ? (
                              isEnrolled ? (
                                 <Link to={`/courseSection/${course._id}/${encodeURIComponent(course.C_title)}`} className="w-100">
                                    <Button className="btn-primary-custom w-100" variant="success">
                                       Continue Learning
                                    </Button>
                                 </Link>
                              ) : (
                                 <Button
                                    className="btn-primary-custom w-100"
                                    onClick={() => handleShow(index, course.C_price, course._id, course.C_title)}
                                 >
                                    {isPaidCourse(course) ? 'Enroll Now' : 'Start Learning'}
                                 </Button>
                              )
                           ) : (
                              <Link to={'/login'} className="w-100">
                                 <Button className="btn-primary-custom w-100">
                                    Sign In to Enroll
                                 </Button>
                              </Link>
                           )}
                           
                           <Modal show={showModal[index]} onHide={() => handleClose(index)} centered>
                              <Modal.Header closeButton className="border-0">
                                 <Modal.Title>Complete Your Enrollment</Modal.Title>
                              </Modal.Header>
                              <Modal.Body className="p-4">
                                 <div className="text-center mb-4">
                                    <h5>{course.C_title}</h5>
                                    <p className="text-muted">by {course.C_educator}</p>
                                    <div className="course-price mb-3">₹{course.C_price}</div>
                                 </div>
                                 
                                 <Form onSubmit={(e) => {
                                    e.preventDefault()
                                    handlePaymentSubmit(course._id, course.C_title, index)
                                 }}>
                                    <MDBInput 
                                       className='mb-3' 
                                       label="Card Holder Name" 
                                       name='cardholdername' 
                                       value={cardDetails.cardholdername} 
                                       onChange={handleChange} 
                                       type="text" 
                                       size="md"
                                       placeholder="John Doe" 
                                       required 
                                    />
                                    <MDBInput 
                                       className='mb-3' 
                                       name='cardnumber' 
                                       value={cardDetails.cardnumber} 
                                       onChange={handleChange} 
                                       label="Card Number" 
                                       type="text" 
                                       size="md"
                                       placeholder="1234 5678 9012 3457" 
                                       required 
                                    />
                                    <MDBRow className="mb-4">
                                       <MDBCol md="6">
                                          <MDBInput 
                                             name='expmonthyear' 
                                             value={cardDetails.expmonthyear} 
                                             onChange={handleChange} 
                                             label="Expiration" 
                                             type="text" 
                                             size="md"
                                             placeholder="MM/YYYY" 
                                             required 
                                          />
                                       </MDBCol>
                                       <MDBCol md="6">
                                          <MDBInput 
                                             name='cvvcode' 
                                             value={cardDetails.cvvcode} 
                                             onChange={handleChange} 
                                             label="CVV" 
                                             type="text" 
                                             size="md" 
                                             placeholder="123" 
                                             required 
                                          />
                                       </MDBCol>
                                    </MDBRow>
                                    <div className="d-flex gap-2">
                                       <Button 
                                          variant="outline-secondary" 
                                          onClick={() => handleClose(index)}
                                          className="flex-fill"
                                       >
                                          Cancel
                                       </Button>
                                       <Button 
                                          type='submit'
                                          className="btn-primary-custom flex-fill"
                                       >
                                          Complete Payment
                                       </Button>
                                    </div>
                                 </Form>
                              </Modal.Body>
                           </Modal>
                        </div>
                     </div>
                  )
               })
            ) : (
               <div className="text-center py-5 w-100">
                  <h4 className="text-muted">No courses found</h4>
                  <p>Try adjusting your search criteria</p>
               </div>
            )}
         </div>
      </>
   );
};

export default AllCourses;