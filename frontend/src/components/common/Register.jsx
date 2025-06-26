import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { Container, Nav, Navbar } from 'react-bootstrap';
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
   const [data, setData] = useState({
      name: "",
      email: "",
      password: "",
      type: "",
   })

   const handleChange = (e) => {
      const { name, value } = e.target;
      setData({ ...data, [name]: value });
   };

   const handleSubmit = async (e) => {
      e.preventDefault()
      if (!data?.name || !data?.email || !data?.password || !data?.type) {
         return alert("Please fill all fields");
      }
      
      setLoading(true);
      try {
         const response = await axiosInstance.post('/api/user/register', data);
         if (response.data.success) {
            alert(response.data.message)
            navigate('/login')
         } else {
            alert(response.data.message)
         }
      } catch (error) {
         console.log("Error", error);
         alert("Registration failed. Please try again.");
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
                     >
                        <MenuItem value="Student">Student</MenuItem>
                        <MenuItem value="Teacher">Teacher</MenuItem>
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