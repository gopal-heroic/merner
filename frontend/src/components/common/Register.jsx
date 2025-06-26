import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { Container, Nav, Navbar, Alert } from 'react-bootstrap';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import axiosInstance from './AxiosInstance';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const Register = () => {
   const navigate = useNavigate()
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState('');
   const [data, setData] = useState({
      name: "",
      email: "",
      password: "",
      type: "",
   })

   const handleChange = (e) => {
      const { name, value } = e.target;
      setData({ ...data, [name]: value });
      // Clear error when user starts typing
      if (error) setError('');
   };

   const validateForm = () => {
      if (!data?.name || !data?.email || !data?.password || !data?.type) {
         setError("Please fill in all fields");
         return false;
      }

      if (data.name.length < 2) {
         setError("Name must be at least 2 characters long");
         return false;
      }

      if (!/\S+@\S+\.\S+/.test(data.email)) {
         setError("Please enter a valid email address");
         return false;
      }

      if (data.password.length < 6) {
         setError("Password must be at least 6 characters long");
         return false;
      }

      return true;
   };

   const handleSubmit = async (e) => {
      e.preventDefault()
      
      if (!validateForm()) {
         return;
      }
      
      setLoading(true);
      setError('');
      
      try {
         const response = await axiosInstance.post('/api/user/register', data);
         if (response.data.success) {
            alert(response.data.message)
            navigate('/login')
         } else {
            setError(response.data.message || 'Registration failed');
         }
      } catch (error) {
         console.log("Error", error);
         if (error.response?.status === 409) {
            setError("An account with this email already exists");
         } else if (error.type === 'network') {
            setError("Network error. Please check your connection.");
         } else {
            setError("Registration failed. Please try again.");
         }
      } finally {
         setLoading(false);
      }
   };

   return (
      <>
         <Navbar expand="lg" className="navbar-custom">
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
                     <Link to={'/register'} className="nav-link">Register</Link>
                  </Nav>
               </Navbar.Collapse>
            </Container>
         </Navbar>

         <div className="hero-section">
            <Container className="d-flex justify-content-center align-items-center min-vh-100">
               <div className="form-container fade-in">
                  <div className="text-center mb-4">
                     <Avatar sx={{ 
                        bgcolor: 'var(--primary-color)', 
                        width: 56, 
                        height: 56,
                        margin: '0 auto 1rem'
                     }}>
                        <PersonAddIcon />
                     </Avatar>
                     <Typography component="h1" variant="h4" className="form-title">
                        Join LearnHub
                     </Typography>
                     <Typography variant="body1" color="textSecondary">
                        Create your account and start learning today
                     </Typography>
                  </div>

                  {error && (
                     <Alert variant="danger" className="mb-3">
                        {error}
                     </Alert>
                  )}

                  <Box component="form" onSubmit={handleSubmit} noValidate>
                     <TextField
                        margin="normal"
                        fullWidth
                        id="name"
                        label="Full Name"
                        name="name"
                        value={data.name}
                        onChange={handleChange}
                        autoComplete="name"
                        autoFocus
                        variant="outlined"
                        error={!!error && !data.name}
                        helperText={data.name && data.name.length < 2 ? "Name must be at least 2 characters" : ""}
                     />
                     <TextField
                        margin="normal"
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        value={data.email}
                        onChange={handleChange}
                        autoComplete="email"
                        variant="outlined"
                        error={!!error && !data.email}
                        helperText={data.email && !/\S+@\S+\.\S+/.test(data.email) ? "Please enter a valid email" : ""}
                     />
                     <TextField
                        margin="normal"
                        fullWidth
                        name="password"
                        value={data.password}
                        onChange={handleChange}
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="new-password"
                        variant="outlined"
                        error={!!error && !data.password}
                        helperText={data.password && data.password.length < 6 ? "Password must be at least 6 characters" : ""}
                     />
                     <TextField
                        margin="normal"
                        fullWidth
                        select
                        label="I am a"
                        name="type"
                        value={data.type}
                        onChange={handleChange}
                        variant="outlined"
                        required
                        error={!!error && !data.type}
                        helperText="Select your role to get personalized experience"
                     >
                        <MenuItem value="Student">Student - I want to learn</MenuItem>
                        <MenuItem value="Teacher">Teacher - I want to teach</MenuItem>
                     </TextField>
                     
                     <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={loading}
                        sx={{ 
                           mt: 3, 
                           mb: 2,
                           py: 1.5,
                           background: 'var(--gradient-primary)',
                           '&:hover': {
                              background: 'var(--gradient-primary)',
                              transform: 'translateY(-2px)',
                              boxShadow: 'var(--shadow-lg)'
                           }
                        }}
                     >
                        {loading ? (
                           <>
                              <span className="loading-spinner me-2"></span>
                              Creating Account...
                           </>
                        ) : (
                           'Create Account'
                        )}
                     </Button>
                     
                     <Grid container justifyContent="center">
                        <Grid item>
                           <Typography variant="body2">
                              Already have an account?{' '}
                              <Link to={'/login'} style={{ 
                                 color: 'var(--primary-color)',
                                 fontWeight: 600,
                                 textDecoration: 'none'
                              }}>
                                 Sign In
                              </Link>
                           </Typography>
                        </Grid>
                     </Grid>
                  </Box>
               </div>
            </Container>
         </div>
      </>
   )
}

export default Register