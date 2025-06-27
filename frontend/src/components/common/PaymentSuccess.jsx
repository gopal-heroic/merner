import React from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { Container, Card, Button } from 'react-bootstrap';
import { CheckCircle, Download, ArrowLeft } from 'lucide-react';
import NavBar from './NavBar';

const PaymentSuccess = () => {
   const { paymentId } = useParams();
   const location = useLocation();
   const { payment, courseTitle, courseId } = location.state || {};

   return (
      <>
         <NavBar />
         <Container className="py-5">
            <div className="d-flex justify-content-center align-items-center min-vh-75">
               <Card className="border-0 shadow-lg" style={{ maxWidth: '500px', width: '100%' }}>
                  <Card.Body className="p-5 text-center">
                     <div className="mb-4">
                        <div 
                           className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                           style={{ 
                              width: '80px', 
                              height: '80px', 
                              background: 'var(--success-color)',
                              color: 'white'
                           }}
                        >
                           <CheckCircle size={40} />
                        </div>
                        <h2 className="text-success mb-2">Payment Successful!</h2>
                        <p className="text-muted">Your enrollment has been confirmed</p>
                     </div>

                     <div className="mb-4 p-4 bg-light rounded">
                        <div className="row text-start">
                           <div className="col-6">
                              <small className="text-muted">Amount Paid</small>
                              <div className="fw-bold text-success">₹{payment?.amount || 0}</div>
                           </div>
                           <div className="col-6">
                              <small className="text-muted">Payment ID</small>
                              <div className="fw-bold">{paymentId}</div>
                           </div>
                           <div className="col-12 mt-3">
                              <small className="text-muted">Course</small>
                              <div className="fw-bold">{courseTitle || 'Course'}</div>
                           </div>
                           <div className="col-6 mt-3">
                              <small className="text-muted">Order ID</small>
                              <div className="fw-bold small">{payment?.orderId}</div>
                           </div>
                           <div className="col-6 mt-3">
                              <small className="text-muted">Status</small>
                              <div className="fw-bold text-success text-capitalize">{payment?.status}</div>
                           </div>
                        </div>
                     </div>

                     <div className="d-flex flex-column gap-3">
                        {courseId && (
                           <Link to={`/courseSection/${courseId}/${encodeURIComponent(courseTitle)}`}>
                              <Button className="btn-primary-custom w-100 d-flex align-items-center justify-content-center gap-2">
                                 <Download size={18} />
                                 Start Learning Now
                              </Button>
                           </Link>
                        )}
                        <Link to="/dashboard">
                           <Button variant="outline-primary" className="w-100 d-flex align-items-center justify-content-center gap-2">
                              <ArrowLeft size={18} />
                              Back to Dashboard
                           </Button>
                        </Link>
                     </div>

                     <div className="mt-4 pt-4 border-top">
                        <small className="text-muted">
                           Thank you for choosing LearnHub! A confirmation email has been sent to your registered email address.
                        </small>
                     </div>
                  </Card.Body>
               </Card>
            </div>
         </Container>
      </>
   );
};

export default PaymentSuccess;