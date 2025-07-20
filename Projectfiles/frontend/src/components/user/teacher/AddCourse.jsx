import React, { useState, useContext } from 'react';
import { Button, Form, Col, Row, Alert, Card } from 'react-bootstrap';
import { UserContext } from '../../../App';
import axiosInstance from '../../common/AxiosInstance';
import { PlusCircle, X, Upload, BookOpen } from 'lucide-react';

const AddCourse = () => {
   const user = useContext(UserContext);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState('');
   const [success, setSuccess] = useState('');
   const [addCourse, setAddCourse] = useState({
      userId: user.userData._id,
      C_educator: '',
      C_title: '',
      C_categories: '',
      C_price: '',
      C_description: '',
      sections: [],
   });

   const handleChange = (e) => {
      const { name, value } = e.target;
      setAddCourse({ ...addCourse, [name]: value });
      if (error) setError('');
   };

   const handleCourseTypeChange = (e) => {
      setAddCourse({ ...addCourse, C_categories: e.target.value });
      if (error) setError('');
   };

   const addInputGroup = () => {
      setAddCourse({
         ...addCourse,
         sections: [
            ...addCourse.sections,
            {
               S_title: '',
               S_description: '',
               S_content: null,
            },
         ],
      });
   };

   const handleChangeSection = (index, e) => {
      const updatedSections = [...addCourse.sections];
      const sectionToUpdate = updatedSections[index];

      if (e.target.name.endsWith('S_content')) {
         sectionToUpdate.S_content = e.target.files[0];
      } else {
         sectionToUpdate[e.target.name] = e.target.value;
      }

      setAddCourse({ ...addCourse, sections: updatedSections });
   };

   const removeInputGroup = (index) => {
      const updatedSections = [...addCourse.sections];
      updatedSections.splice(index, 1);
      setAddCourse({
         ...addCourse,
         sections: updatedSections,
      });
   };

   const validateForm = () => {
      if (!addCourse.C_educator || !addCourse.C_title || !addCourse.C_categories || !addCourse.C_description) {
         setError('Please fill in all course details');
         return false;
      }

      if (addCourse.sections.length === 0) {
         setError('Please add at least one section to your course');
         return false;
      }

      for (let i = 0; i < addCourse.sections.length; i++) {
         const section = addCourse.sections[i];
         if (!section.S_title || !section.S_description || !section.S_content) {
            setError(`Please complete all fields for section ${i + 1}`);
            return false;
         }
      }

      return true;
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      
      if (!validateForm()) {
         return;
      }

      setLoading(true);
      setError('');
      setSuccess('');

      const formData = new FormData();
      Object.keys(addCourse).forEach((key) => {
         if (key === 'sections') {
            addCourse[key].forEach((section, index) => {
               if (section.S_content instanceof File) {
                  formData.append(`S_content`, section.S_content);
               }
               formData.append(`S_title`, section.S_title);
               formData.append(`S_description`, section.S_description);
            });
         } else {
            formData.append(key, addCourse[key]);
         }
      });

      try {
         const res = await axiosInstance.post('/api/user/addcourse', formData, {
            headers: {
               Authorization: `Bearer ${localStorage.getItem('token')}`,
               'Content-Type': 'multipart/form-data',
            },
         });

         if (res.status === 201) {
            if (res.data.success) {
               setSuccess('Course created successfully!');
               // Reset form
               setAddCourse({
                  userId: user.userData._id,
                  C_educator: '',
                  C_title: '',
                  C_categories: '',
                  C_price: '',
                  C_description: '',
                  sections: [],
               });
               
               // Trigger navigation back to home after success
               setTimeout(() => {
                  window.dispatchEvent(new CustomEvent('navigateToSection', { detail: 'home' }));
               }, 2000);
            } else {
               setError('Failed to create course');
            }
         } else {
            setError('Unexpected response status: ' + res.status);
         }
      } catch (error) {
         console.error('An error occurred:', error);
         if (error.response?.data?.message) {
            setError(error.response.data.message);
         } else {
            setError('An error occurred while creating the course');
         }
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="container-fluid py-4">
         <div className="mb-4 fade-in">
            <h1 className="text-gradient mb-2">Create New Course</h1>
            <p className="text-muted">Share your knowledge and help others learn</p>
         </div>

         {error && (
            <Alert variant="danger" className="mb-4">
               {error}
            </Alert>
         )}

         {success && (
            <Alert variant="success" className="mb-4">
               {success}
            </Alert>
         )}

         <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
               <Form onSubmit={handleSubmit}>
                  {/* Course Basic Information */}
                  <div className="mb-4">
                     <h4 className="mb-3 d-flex align-items-center gap-2">
                        <BookOpen size={24} />
                        Course Information
                     </h4>
                     
                     <Row className="mb-3">
                        <Form.Group as={Col} md={6} controlId="formGridJobType">
                           <Form.Label className="fw-semibold">Course Category *</Form.Label>
                           <Form.Select 
                              value={addCourse.C_categories} 
                              onChange={handleCourseTypeChange}
                              className="form-control"
                              required
                           >
                              <option value="">Select a category</option>
                              <option value="IT & Software">IT & Software</option>
                              <option value="Finance & Accounting">Finance & Accounting</option>
                              <option value="Personal Development">Personal Development</option>
                           </Form.Select>
                        </Form.Group>
                        
                        <Form.Group as={Col} md={6} controlId="formGridTitle">
                           <Form.Label className="fw-semibold">Course Title *</Form.Label>
                           <Form.Control 
                              name='C_title' 
                              value={addCourse.C_title} 
                              onChange={handleChange} 
                              type="text" 
                              placeholder="Enter an engaging course title" 
                              required 
                              className="form-control"
                           />
                        </Form.Group>
                     </Row>

                     <Row className="mb-3">
                        <Form.Group as={Col} md={6} controlId="formGridEducator">
                           <Form.Label className="fw-semibold">Instructor Name *</Form.Label>
                           <Form.Control 
                              name='C_educator' 
                              value={addCourse.C_educator} 
                              onChange={handleChange} 
                              type="text" 
                              placeholder="Your name as it will appear to students" 
                              required 
                              className="form-control"
                           />
                        </Form.Group>
                        
                        <Form.Group as={Col} md={6} controlId="formGridPrice">
                           <Form.Label className="fw-semibold">Course Price (₹) *</Form.Label>
                           <Form.Control 
                              name='C_price' 
                              value={addCourse.C_price} 
                              onChange={handleChange} 
                              type="number" 
                              placeholder="Enter 0 for free course" 
                              required 
                              className="form-control"
                              min="0"
                           />
                           <Form.Text className="text-muted">
                              Set to 0 to make this course free for all students
                           </Form.Text>
                        </Form.Group>
                     </Row>

                     <Form.Group className="mb-3" controlId="formGridDescription">
                        <Form.Label className="fw-semibold">Course Description *</Form.Label>
                        <Form.Control 
                           name='C_description' 
                           value={addCourse.C_description} 
                           onChange={handleChange} 
                           required 
                           as="textarea" 
                           rows={4}
                           placeholder="Describe what students will learn in this course..."
                           className="form-control"
                        />
                     </Form.Group>
                  </div>

                  <hr className="my-4" />

                  {/* Course Sections */}
                  <div className="mb-4">
                     <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="mb-0">Course Sections</h4>
                        <Button 
                           type="button"
                           variant="outline-primary" 
                           onClick={addInputGroup}
                           className="d-flex align-items-center gap-2"
                        >
                           <PlusCircle size={18} />
                           Add Section
                        </Button>
                     </div>

                     {addCourse.sections.length === 0 && (
                        <div className="text-center py-4 bg-light rounded">
                           <p className="text-muted mb-3">No sections added yet</p>
                           <Button 
                              type="button"
                              variant="primary" 
                              onClick={addInputGroup}
                              className="btn-primary-custom"
                           >
                              Add Your First Section
                           </Button>
                        </div>
                     )}

                     {addCourse.sections.map((section, index) => (
                        <Card key={index} className="mb-3 border">
                           <Card.Header className="bg-light d-flex justify-content-between align-items-center">
                              <h6 className="mb-0">Section {index + 1}</h6>
                              <Button
                                 type="button"
                                 variant="outline-danger"
                                 size="sm"
                                 onClick={() => removeInputGroup(index)}
                                 className="d-flex align-items-center gap-1"
                              >
                                 <X size={16} />
                                 Remove
                              </Button>
                           </Card.Header>
                           <Card.Body>
                              <Row className="mb-3">
                                 <Form.Group as={Col} md={6} controlId={`sectionTitle${index}`}>
                                    <Form.Label className="fw-semibold">Section Title *</Form.Label>
                                    <Form.Control
                                       name="S_title"
                                       value={section.S_title}
                                       onChange={(e) => handleChangeSection(index, e)}
                                       type="text"
                                       placeholder="Enter section title"
                                       required
                                       className="form-control"
                                    />
                                 </Form.Group>
                                 
                                 <Form.Group as={Col} md={6} controlId={`sectionContent${index}`}>
                                    <Form.Label className="fw-semibold">Section Content *</Form.Label>
                                    <Form.Control
                                       name="S_content"
                                       onChange={(e) => handleChangeSection(index, e)}
                                       type="file"
                                       accept="video/*,image/*"
                                       required
                                       className="form-control"
                                    />
                                    <Form.Text className="text-muted">
                                       Upload video or image content for this section
                                    </Form.Text>
                                 </Form.Group>
                              </Row>

                              <Form.Group controlId={`sectionDescription${index}`}>
                                 <Form.Label className="fw-semibold">Section Description *</Form.Label>
                                 <Form.Control
                                    name="S_description"
                                    value={section.S_description}
                                    onChange={(e) => handleChangeSection(index, e)}
                                    required
                                    as="textarea"
                                    rows={3}
                                    placeholder="Describe what this section covers..."
                                    className="form-control"
                                 />
                              </Form.Group>
                           </Card.Body>
                        </Card>
                     ))}
                  </div>

                  <div className="d-flex gap-3 justify-content-end">
                     <Button 
                        variant="outline-secondary" 
                        type="button"
                        onClick={() => {
                           window.dispatchEvent(new CustomEvent('navigateToSection', { detail: 'home' }));
                        }}
                     >
                        Cancel
                     </Button>
                     <Button 
                        variant="primary" 
                        type="submit"
                        disabled={loading}
                        className="btn-primary-custom d-flex align-items-center gap-2"
                     >
                        {loading ? (
                           <>
                              <span className="loading-spinner"></span>
                              Creating Course...
                           </>
                        ) : (
                           <>
                              <Upload size={18} />
                              Create Course
                           </>
                        )}
                     </Button>
                  </div>
               </Form>
            </Card.Body>
         </Card>
      </div>
   );
};

export default AddCourse;