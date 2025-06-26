import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Accordion, Modal, Container, Row, Col, Button, ProgressBar } from 'react-bootstrap';
import axiosInstance from '../../common/AxiosInstance';
import ReactPlayer from 'react-player';
import { UserContext } from '../../../App';
import NavBar from '../../common/NavBar';
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const CourseContent = () => {
   const user = useContext(UserContext)
   const { courseId, courseTitle } = useParams();
   const [courseContent, setCourseContent] = useState([]);
   const [currentVideo, setCurrentVideo] = useState(null);
   const [playingSectionIndex, setPlayingSectionIndex] = useState(-1);
   const [completedSections, setCompletedSections] = useState([]);
   const [completedModule, setCompletedModule] = useState([]);
   const [showModal, setShowModal] = useState(false);
   const [certificate, setCertificate] = useState(null);
   const [loading, setLoading] = useState(true);

   const completedModuleIds = completedModule.map((item) => item.sectionId);
   const progressPercentage = courseContent.length > 0 ? (completedModule.length / courseContent.length) * 100 : 0;

   const downloadPdfDocument = (rootElementId) => {
      const input = document.getElementById(rootElementId);
      html2canvas(input).then((canvas) => {
         const imgData = canvas.toDataURL('image/png');
         const pdf = new jsPDF();
         pdf.addImage(imgData, 'JPEG', 0, 0);
         pdf.save(`${courseTitle}-certificate.pdf`);
      });
   };

   const getCourseContent = async () => {
      try {
         setLoading(true);
         const res = await axiosInstance.get(`/api/user/coursecontent/${courseId}`, {
            headers: {
               "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
         });
         if (res.data.success) {
            setCourseContent(res.data.courseContent);
            setCompletedModule(res.data.completeModule);
            setCertificate(res.data.certficateData.updatedAt);
         }
      } catch (error) {
         console.log(error);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      getCourseContent();
   }, [courseId]);

   const playVideo = (videoPath, index) => {
      setCurrentVideo(videoPath);
      setPlayingSectionIndex(index);
   };

   const completeModule = async (sectionId) => {
      if (completedModule.length < courseContent.length) {
         if (playingSectionIndex !== -1 && !completedSections.includes(playingSectionIndex)) {
            setCompletedSections([...completedSections, playingSectionIndex]);

            try {
               const res = await axiosInstance.post(`api/user/completemodule`, {
                  courseId,
                  sectionId: sectionId
               }, {
                  headers: {
                     Authorization: `Bearer ${localStorage.getItem('token')}`
                  }
               });
               if (res.data.success) {
                  alert(res.data.message);
                  getCourseContent();
               }
            } catch (error) {
               console.log(error);
            }
         }
      } else {
         setShowModal(true);
      }
   };

   if (loading) {
      return (
         <>
            <NavBar />
            <Container className="py-5">
               <div className="text-center">
                  <div className="loading-spinner mx-auto mb-3"></div>
                  <p>Loading course content...</p>
               </div>
            </Container>
         </>
      );
   }

   return (
      <>
         <NavBar />
         <Container fluid className="py-4">
            <div className="mb-4 fade-in">
               <h1 className="text-center mb-3 text-gradient">{courseTitle}</h1>
               <div className="text-center mb-4">
                  <div className="d-inline-block" style={{ minWidth: '300px' }}>
                     <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="fw-semibold">Progress</span>
                        <span className="text-muted">{completedModule.length}/{courseContent.length} completed</span>
                     </div>
                     <ProgressBar 
                        now={progressPercentage} 
                        variant="success"
                        style={{ height: '8px' }}
                        className="rounded-pill"
                     />
                  </div>
               </div>
            </div>

            <Row className="g-4">
               <Col lg={6}>
                  <div className="course-sections slide-up">
                     <div className="p-3 bg-primary text-white">
                        <h4 className="mb-0">Course Modules</h4>
                     </div>
                     <Accordion defaultActiveKey="0" flush className="accordion-custom">
                        {courseContent.map((section, index) => {
                           const sectionId = index;
                           const isSectionCompleted = completedModuleIds.includes(sectionId);

                           return (
                              <Accordion.Item key={index} eventKey={index.toString()}>
                                 <Accordion.Header>
                                    <div className="d-flex align-items-center gap-3 w-100">
                                       <div 
                                          className={`rounded-circle d-flex align-items-center justify-content-center ${
                                             isSectionCompleted ? 'bg-success' : 'bg-secondary'
                                          }`}
                                          style={{ width: '24px', height: '24px', fontSize: '12px' }}
                                       >
                                          {isSectionCompleted ? '✓' : index + 1}
                                       </div>
                                       <span className="fw-semibold">{section.S_title}</span>
                                    </div>
                                 </Accordion.Header>
                                 <Accordion.Body>
                                    <p className="text-muted mb-3">{section.S_description}</p>
                                    {section.S_content && (
                                       <div className="d-flex gap-2 flex-wrap">
                                          <Button 
                                             variant="primary" 
                                             size="sm"
                                             onClick={() => playVideo(`http://localhost:3000${section.S_content.path}`, index)}
                                             className="btn-primary-custom"
                                          >
                                             ▶ Play Video
                                          </Button>
                                          {!isSectionCompleted && !completedSections.includes(index) && (
                                             <Button
                                                variant="success"
                                                size="sm"
                                                onClick={() => completeModule(sectionId)}
                                                disabled={playingSectionIndex !== index}
                                                className={playingSectionIndex === index ? '' : 'opacity-50'}
                                             >
                                                ✓ Mark Complete
                                             </Button>
                                          )}
                                       </div>
                                    )}
                                 </Accordion.Body>
                              </Accordion.Item>
                           );
                        })}
                     </Accordion>
                     
                     {completedModule.length === courseContent.length && (
                        <div className="p-3 text-center bg-success text-white">
                           <h5 className="mb-2">🎉 Congratulations!</h5>
                           <p className="mb-3">You've completed all modules!</p>
                           <Button 
                              variant="light" 
                              onClick={() => setShowModal(true)}
                              className="fw-semibold"
                           >
                              📜 Download Certificate
                           </Button>
                        </div>
                     )}
                  </div>
               </Col>

               <Col lg={6}>
                  <div className="course-video-player slide-up">
                     {currentVideo ? (
                        <div className="position-relative">
                           <ReactPlayer
                              url={currentVideo}
                              width='100%'
                              height='400px'
                              controls
                              className="rounded"
                           />
                           <div className="mt-3 p-3 bg-light rounded">
                              <h6 className="mb-1">Now Playing:</h6>
                              <p className="text-muted mb-0">
                                 {courseContent[playingSectionIndex]?.S_title}
                              </p>
                           </div>
                        </div>
                     ) : (
                        <div className="text-center py-5">
                           <div className="mb-3" style={{ fontSize: '4rem', opacity: 0.3 }}>
                              🎥
                           </div>
                           <h5 className="text-muted">Select a module to start learning</h5>
                           <p className="text-muted">
                              Choose any module from the left panel to begin watching
                           </p>
                        </div>
                     )}
                  </div>
               </Col>
            </Row>
         </Container>

         <Modal
            size="lg"
            show={showModal}
            onHide={() => setShowModal(false)}
            centered
            className="certificate-modal"
         >
            <Modal.Header closeButton className="border-0">
               <Modal.Title>🎓 Course Completion Certificate</Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-0">
               <div id='certificate-download' className="certificate-container">
                  <div className="text-center mb-4">
                     <div className="text-gradient" style={{ fontSize: '3rem', fontWeight: 'bold' }}>
                        LearnHub
                     </div>
                  </div>
                  
                  <h1 className="certificate-title">Certificate of Completion</h1>
                  
                  <div className="certificate-content">
                     <p style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>
                        This is to certify that
                     </p>
                     <h2 className="certificate-name">{user.userData.name}</h2>
                     <p style={{ fontSize: '1.125rem', margin: '1rem 0' }}>
                        has successfully completed the course
                     </p>
                     <h3 className="certificate-course">{courseTitle}</h3>
                     <p style={{ fontSize: '1rem', margin: '1rem 0' }}>
                        on
                     </p>
                     <p className="certificate-date">
                        {new Date(certificate).toLocaleDateString('en-US', {
                           year: 'numeric',
                           month: 'long',
                           day: 'numeric'
                        })}
                     </p>
                  </div>
                  
                  <div className="mt-4 pt-4" style={{ borderTop: '2px solid var(--neutral-200)' }}>
                     <div className="row">
                        <div className="col-6 text-center">
                           <div style={{ borderTop: '1px solid var(--neutral-400)', width: '80%', margin: '0 auto' }}></div>
                           <small className="text-muted mt-2 d-block">LearnHub Authority</small>
                        </div>
                        <div className="col-6 text-center">
                           <div style={{ borderTop: '1px solid var(--neutral-400)', width: '80%', margin: '0 auto' }}></div>
                           <small className="text-muted mt-2 d-block">Date of Completion</small>
                        </div>
                     </div>
                  </div>
               </div>
               
               <div className="p-4 text-center">
                  <Button 
                     onClick={() => downloadPdfDocument('certificate-download')}
                     className="btn-primary-custom"
                  >
                     📥 Download Certificate
                  </Button>
               </div>
            </Modal.Body>
         </Modal>
      </>
   );
};

export default CourseContent;