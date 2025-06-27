import React from 'react'
import { Link } from 'react-router-dom'
import { Container, Nav, Button, Navbar, Row, Col, Card } from 'react-bootstrap';
import { BookOpen, Users, Award, TrendingUp, Star, CheckCircle } from 'lucide-react';
import AllCourses from './AllCourses';

const Home = () => {
   const features = [
      {
         icon: <BookOpen size={40} />,
         title: "Expert-Led Courses",
         description: "Learn from industry professionals with real-world experience"
      },
      {
         icon: <Users size={40} />,
         title: "Interactive Learning",
         description: "Engage with instructors and fellow students in our community"
      },
      {
         icon: <Award size={40} />,
         title: "Certificates",
         description: "Earn recognized certificates upon course completion"
      },
      {
         icon: <TrendingUp size={40} />,
         title: "Track Progress",
         description: "Monitor your learning journey with detailed analytics"
      }
   ];

   const testimonials = [
      {
         name: "Sarah Johnson",
         role: "Software Developer",
         content: "LearnHub transformed my career. The courses are practical and the instructors are amazing!",
         rating: 5
      },
      {
         name: "Michael Chen",
         role: "Data Analyst",
         content: "The best online learning platform I've used. Highly recommend for anyone looking to upskill.",
         rating: 5
      },
      {
         name: "Emily Davis",
         role: "Marketing Manager",
         content: "Great variety of courses and excellent support. The certificates helped me get promoted!",
         rating: 5
      }
   ];

   const stats = [
      { number: "10,000+", label: "Students" },
      { number: "500+", label: "Courses" },
      { number: "100+", label: "Instructors" },
      { number: "95%", label: "Success Rate" }
   ];

   return (
      <>
         <Navbar expand="lg" className="navbar-custom fixed-top">
            <Container>
               <Navbar.Brand className="navbar-brand">
                  <span className="text-gradient">LearnHub</span>
               </Navbar.Brand>
               <Navbar.Toggle aria-controls="navbarScroll" />
               <Navbar.Collapse id="navbarScroll">
                  <Nav className="me-auto">
                     <Nav.Link href="#features">Features</Nav.Link>
                     <Nav.Link href="#courses">Courses</Nav.Link>
                     <Nav.Link href="#about">About</Nav.Link>
                     <Link to="/about" className="nav-link">About Us</Link>
                  </Nav>
                  <Nav className="d-flex gap-3">
                     <Link to={'/login'} className="nav-link">Login</Link>
                     <Link to={'/register'}>
                        <Button className="btn-primary-custom">Get Started</Button>
                     </Link>
                  </Nav>
               </Navbar.Collapse>
            </Container>
         </Navbar>

         <section className="hero-section">
            <Container>
               <Row className="align-items-center min-vh-100">
                  <Col lg={6}>
                     <div className="hero-content fade-in">
                        <h1 className="hero-title">
                           Transform Your Future with 
                           <span className="d-block">Expert-Led Courses</span>
                        </h1>
                        <p className="hero-subtitle">
                           Join thousands of learners advancing their careers through our comprehensive, 
                           industry-relevant courses taught by world-class instructors.
                        </p>
                        <div className="hero-cta">
                           <Link to={'/register'}>
                              <Button className="btn-primary-custom">
                                 Start Learning Today
                              </Button>
                           </Link>
                           <a href={'#courses'}>
                              <Button className="btn-secondary-custom">
                                 Explore Courses
                              </Button>
                           </a>
                        </div>
                        
                        {/* Stats */}
                        <Row className="mt-5 text-white">
                           {stats.map((stat, index) => (
                              <Col xs={6} md={3} key={index} className="text-center">
                                 <h3 className="mb-1">{stat.number}</h3>
                                 <p className="small opacity-75">{stat.label}</p>
                              </Col>
                           ))}
                        </Row>
                     </div>
                  </Col>
                  <Col lg={6} className="d-none d-lg-block">
                     <div className="text-center slide-up">
                        <div 
                           className="glass-effect rounded-3 p-4"
                           style={{ 
                              background: 'rgba(255, 255, 255, 0.1)',
                              backdropFilter: 'blur(20px)',
                              border: '1px solid rgba(255, 255, 255, 0.2)'
                           }}
                        >
                           <h4 className="text-white mb-3">🎓 Start Your Journey</h4>
                           <div className="d-flex flex-column gap-3">
                              <div className="d-flex align-items-center gap-3 text-white">
                                 <CheckCircle size={20} className="text-success" />
                                 <span>Choose from 500+ courses</span>
                              </div>
                              <div className="d-flex align-items-center gap-3 text-white">
                                 <CheckCircle size={20} className="text-success" />
                                 <span>Learn at your own pace</span>
                              </div>
                              <div className="d-flex align-items-center gap-3 text-white">
                                 <CheckCircle size={20} className="text-success" />
                                 <span>Get certified upon completion</span>
                              </div>
                              <div className="d-flex align-items-center gap-3 text-white">
                                 <CheckCircle size={20} className="text-success" />
                                 <span>Join a community of learners</span>
                              </div>
                           </div>
                        </div>
                     </div>
                  </Col>
               </Row>
            </Container>
         </section>

         <section id="features" className="section-padding" style={{ background: 'var(--neutral-50)' }}>
            <Container>
               <div className="text-center mb-5 slide-up">
                  <h2 className="text-gradient mb-3">Why Choose LearnHub?</h2>
                  <p className="lead text-muted">
                     We provide everything you need to succeed in your learning journey
                  </p>
               </div>
               <Row className="g-4">
                  {features.map((feature, index) => (
                     <Col md={6} lg={3} key={index}>
                        <Card className="h-100 border-0 shadow-sm hover-lift text-center">
                           <Card.Body className="p-4">
                              <div className="mb-3" style={{ color: 'var(--primary-color)' }}>
                                 {feature.icon}
                              </div>
                              <h5 className="mb-3">{feature.title}</h5>
                              <p className="text-muted">{feature.description}</p>
                           </Card.Body>
                        </Card>
                     </Col>
                  ))}
               </Row>
            </Container>
         </section>

         <section id="courses" className="section-padding">
            <Container>
               <div className="text-center mb-5 slide-up">
                  <h2 className="text-gradient mb-3">Featured Courses</h2>
                  <p className="lead text-muted">
                     Discover our most popular courses designed to accelerate your learning journey
                  </p>
               </div>
               <AllCourses />
            </Container>
         </section>

         <section className="section-padding" style={{ background: 'var(--neutral-50)' }}>
            <Container>
               <div className="text-center mb-5 slide-up">
                  <h2 className="text-gradient mb-3">What Our Students Say</h2>
                  <p className="lead text-muted">
                     Join thousands of satisfied learners who have transformed their careers
                  </p>
               </div>
               <Row className="g-4">
                  {testimonials.map((testimonial, index) => (
                     <Col md={4} key={index}>
                        <Card className="h-100 border-0 shadow-sm hover-lift">
                           <Card.Body className="p-4">
                              <div className="mb-3">
                                 {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} size={16} fill="var(--warning-color)" color="var(--warning-color)" />
                                 ))}
                              </div>
                              <p className="mb-3">"{testimonial.content}"</p>
                              <div className="d-flex align-items-center">
                                 <div 
                                    className="rounded-circle d-flex align-items-center justify-content-center me-3"
                                    style={{ 
                                       width: '40px', 
                                       height: '40px', 
                                       background: 'var(--gradient-primary)',
                                       color: 'white',
                                       fontSize: '14px',
                                       fontWeight: 'bold'
                                    }}
                                 >
                                    {testimonial.name.charAt(0)}
                                 </div>
                                 <div>
                                    <h6 className="mb-0">{testimonial.name}</h6>
                                    <small className="text-muted">{testimonial.role}</small>
                                 </div>
                              </div>
                           </Card.Body>
                        </Card>
                     </Col>
                  ))}
               </Row>
            </Container>
         </section>

         <section id="about" className="section-padding" style={{ background: 'var(--gradient-primary)' }}>
            <Container>
               <Row className="align-items-center">
                  <Col lg={6}>
                     <div className="text-white slide-up">
                        <h2 className="mb-4">About LearnHub</h2>
                        <p className="lead mb-4">
                           LearnHub is more than just an online learning platform. We're a community of passionate educators and learners committed to making quality education accessible to everyone.
                        </p>
                        <p className="mb-4">
                           Our mission is to bridge the gap between traditional education and the skills needed in today's rapidly evolving job market. We believe that learning should be engaging, practical, and rewarding.
                        </p>
                        <div className="d-flex gap-4 mb-4">
                           <div>
                              <h4 className="mb-1">2020</h4>
                              <p className="small opacity-75">Founded</p>
                           </div>
                           <div>
                              <h4 className="mb-1">50+</h4>
                              <p className="small opacity-75">Countries</p>
                           </div>
                           <div>
                              <h4 className="mb-1">24/7</h4>
                              <p className="small opacity-75">Support</p>
                           </div>
                        </div>
                     </div>
                  </Col>
                  <Col lg={6} className="d-none d-lg-block">
                     <div className="text-center slide-up">
                        <div 
                           className="glass-effect rounded-3 p-5"
                           style={{ 
                              background: 'rgba(255, 255, 255, 0.1)',
                              backdropFilter: 'blur(20px)',
                              border: '1px solid rgba(255, 255, 255, 0.2)'
                           }}
                        >
                           <h4 className="text-white mb-4">Our Values</h4>
                           <div className="text-start">
                              <div className="mb-3">
                                 <h6 className="text-white">🎯 Excellence</h6>
                                 <p className="small text-white opacity-75">We strive for the highest quality in everything we do</p>
                              </div>
                              <div className="mb-3">
                                 <h6 className="text-white">🤝 Community</h6>
                                 <p className="small text-white opacity-75">Learning is better when we support each other</p>
                              </div>
                              <div className="mb-3">
                                 <h6 className="text-white">🚀 Innovation</h6>
                                 <p className="small text-white opacity-75">We embrace new technologies and teaching methods</p>
                              </div>
                              <div>
                                 <h6 className="text-white">🌍 Accessibility</h6>
                                 <p className="small text-white opacity-75">Quality education should be available to everyone</p>
                              </div>
                           </div>
                        </div>
                     </div>
                  </Col>
               </Row>
            </Container>
         </section>

         <section className="section-padding">
            <Container>
               <div className="text-center slide-up">
                  <h2 className="mb-4">Ready to Start Your Learning Journey?</h2>
                  <p className="lead mb-4 text-muted">
                     Join our community of learners and unlock your potential today
                  </p>
                  <div className="d-flex gap-3 justify-content-center flex-wrap">
                     <Link to={'/register'}>
                        <Button className="btn-primary-custom btn-lg">
                           Get Started Now
                        </Button>
                     </Link>
                     <Link to={'/login'}>
                        <Button className="btn-secondary-custom btn-lg">
                           Sign In
                        </Button>
                     </Link>
                  </div>
               </div>
            </Container>
         </section>
      </>
   )
}

export default Home