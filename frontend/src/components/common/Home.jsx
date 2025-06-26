import React from 'react'
import { Link } from 'react-router-dom'
import { Container, Nav, Button, Navbar } from 'react-bootstrap';
import AllCourses from './AllCourses';

const Home = () => {
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
                  </Nav>
                  <Nav className="d-flex gap-3">
                     <Link to={'/'} className="nav-link">Home</Link>
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
                     <Link to={'#courses'}>
                        <Button className="btn-secondary-custom">
                           Explore Courses
                        </Button>
                     </Link>
                  </div>
               </div>
            </Container>
         </section>

         <section id="courses" className="section-padding" style={{ background: 'var(--neutral-50)' }}>
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

         <section className="section-padding" style={{ background: 'var(--gradient-primary)' }}>
            <Container>
               <div className="text-center text-white slide-up">
                  <h2 className="mb-4">Ready to Start Your Learning Journey?</h2>
                  <p className="lead mb-4 opacity-90">
                     Join our community of learners and unlock your potential today
                  </p>
                  <Link to={'/register'}>
                     <Button className="btn-secondary-custom btn-lg">
                        Get Started Now
                     </Button>
                  </Link>
               </div>
            </Container>
         </section>
      </>
   )
}

export default Home