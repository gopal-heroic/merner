import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Users, Target, Award, Globe, Heart, Lightbulb } from 'lucide-react';
import NavBar from './NavBar';

const About = () => {
  const values = [
    {
      icon: <Target size={40} />,
      title: "Excellence",
      description: "We strive for the highest quality in everything we do, from course content to student support."
    },
    {
      icon: <Users size={40} />,
      title: "Community",
      description: "Learning is better when we support each other. We foster a collaborative learning environment."
    },
    {
      icon: <Lightbulb size={40} />,
      title: "Innovation",
      description: "We embrace new technologies and teaching methods to enhance the learning experience."
    },
    {
      icon: <Globe size={40} />,
      title: "Accessibility",
      description: "Quality education should be available to everyone, regardless of location or background."
    },
    {
      icon: <Heart size={40} />,
      title: "Passion",
      description: "We're passionate about education and committed to helping our students succeed."
    },
    {
      icon: <Award size={40} />,
      title: "Recognition",
      description: "We provide recognized certifications that add value to your professional journey."
    }
  ];

  const team = [
    {
      name: "Dr. Sarah Johnson",
      role: "Founder & CEO",
      description: "Former Stanford professor with 15+ years in educational technology.",
      image: "SJ"
    },
    {
      name: "Michael Chen",
      role: "CTO",
      description: "Tech veteran with expertise in scalable learning platforms.",
      image: "MC"
    },
    {
      name: "Emily Rodriguez",
      role: "Head of Content",
      description: "Curriculum designer with experience at top educational institutions.",
      image: "ER"
    },
    {
      name: "David Kim",
      role: "Head of Community",
      description: "Community builder focused on creating engaging learning experiences.",
      image: "DK"
    }
  ];

  const stats = [
    { number: "10,000+", label: "Active Students", description: "Learners from around the world" },
    { number: "500+", label: "Expert Courses", description: "Across various disciplines" },
    { number: "100+", label: "Industry Experts", description: "Teaching on our platform" },
    { number: "95%", label: "Success Rate", description: "Course completion rate" },
    { number: "50+", label: "Countries", description: "Where our students are located" },
    { number: "24/7", label: "Support", description: "Always here to help you" }
  ];

  return (
    <>
      <NavBar />
      <Container className="py-5 mt-5">
        {/* Hero Section */}
        <div className="text-center mb-5 fade-in">
          <h1 className="text-gradient mb-4">About LearnHub</h1>
          <p className="lead text-muted mb-4">
            Empowering learners worldwide through innovative online education
          </p>
        </div>

        {/* Mission Section */}
        <Row className="align-items-center mb-5">
          <Col lg={6}>
            <div className="slide-up">
              <h2 className="mb-4">Our Mission</h2>
              <p className="lead mb-4">
                To democratize access to quality education and empower individuals to achieve their personal and professional goals through innovative online learning experiences.
              </p>
              <p className="mb-4">
                Founded in 2020, LearnHub emerged from a simple belief: that everyone deserves access to world-class education, regardless of their location, background, or circumstances. We've built a platform that connects passionate educators with eager learners, creating a global community of knowledge sharing and growth.
              </p>
              <p className="mb-4">
                Our courses are designed by industry experts and delivered through cutting-edge technology, ensuring that our students receive practical, relevant skills that directly translate to career advancement and personal fulfillment.
              </p>
            </div>
          </Col>
          <Col lg={6}>
            <div className="slide-up">
              <Card className="border-0 shadow-lg">
                <Card.Body className="p-5 text-center" style={{ background: 'var(--gradient-primary)', color: 'white' }}>
                  <h3 className="mb-4">Our Impact</h3>
                  <Row>
                    <Col xs={6} className="mb-3">
                      <h2 className="mb-1">2020</h2>
                      <p className="mb-0 opacity-75">Founded</p>
                    </Col>
                    <Col xs={6} className="mb-3">
                      <h2 className="mb-1">4+</h2>
                      <p className="mb-0 opacity-75">Years Strong</p>
                    </Col>
                    <Col xs={6}>
                      <h2 className="mb-1">1M+</h2>
                      <p className="mb-0 opacity-75">Lives Changed</p>
                    </Col>
                    <Col xs={6}>
                      <h2 className="mb-1">99%</h2>
                      <p className="mb-0 opacity-75">Satisfaction</p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>

        {/* Values Section */}
        <div className="mb-5">
          <div className="text-center mb-5 slide-up">
            <h2 className="text-gradient mb-3">Our Values</h2>
            <p className="lead text-muted">
              The principles that guide everything we do
            </p>
          </div>
          <Row className="g-4">
            {values.map((value, index) => (
              <Col md={6} lg={4} key={index}>
                <Card className="h-100 border-0 shadow-sm hover-lift">
                  <Card.Body className="p-4 text-center">
                    <div className="mb-3" style={{ color: 'var(--primary-color)' }}>
                      {value.icon}
                    </div>
                    <h5 className="mb-3">{value.title}</h5>
                    <p className="text-muted">{value.description}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Stats Section */}
        <div className="mb-5">
          <div className="text-center mb-5 slide-up">
            <h2 className="text-gradient mb-3">LearnHub by the Numbers</h2>
            <p className="lead text-muted">
              Our growth reflects the trust our community places in us
            </p>
          </div>
          <Row className="g-4">
            {stats.map((stat, index) => (
              <Col md={6} lg={4} key={index}>
                <Card className="h-100 border-0 shadow-sm text-center hover-lift">
                  <Card.Body className="p-4">
                    <h2 className="text-primary mb-2">{stat.number}</h2>
                    <h5 className="mb-2">{stat.label}</h5>
                    <p className="text-muted mb-0">{stat.description}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Team Section */}
        <div className="mb-5">
          <div className="text-center mb-5 slide-up">
            <h2 className="text-gradient mb-3">Meet Our Team</h2>
            <p className="lead text-muted">
              The passionate individuals behind LearnHub's success
            </p>
          </div>
          <Row className="g-4">
            {team.map((member, index) => (
              <Col md={6} lg={3} key={index}>
                <Card className="h-100 border-0 shadow-sm hover-lift text-center">
                  <Card.Body className="p-4">
                    <div 
                      className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                      style={{ 
                        width: '80px', 
                        height: '80px', 
                        background: 'var(--gradient-primary)',
                        color: 'white',
                        fontSize: '24px',
                        fontWeight: 'bold'
                      }}
                    >
                      {member.image}
                    </div>
                    <h5 className="mb-2">{member.name}</h5>
                    <p className="text-primary mb-2 fw-semibold">{member.role}</p>
                    <p className="text-muted small">{member.description}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* CTA Section */}
        <div className="text-center slide-up">
          <Card className="border-0 shadow-lg">
            <Card.Body className="p-5" style={{ background: 'var(--gradient-secondary)', color: 'white' }}>
              <h2 className="mb-4">Join Our Learning Community</h2>
              <p className="lead mb-4 opacity-90">
                Ready to start your learning journey with us? Join thousands of students who are already transforming their careers.
              </p>
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <Link to="/register">
                  <Button className="btn-secondary-custom btn-lg">
                    Get Started Today
                  </Button>
                </Link>
                <Link to="/">
                  <Button variant="outline-light" size="lg">
                    Explore Courses
                  </Button>
                </Link>
              </div>
            </Card.Body>
          </Card>
        </div>
      </Container>
    </>
  );
};

export default About;