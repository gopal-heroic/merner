import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { Container, Nav, Navbar } from 'react-bootstrap';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import axiosInstance from './AxiosInstance';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const Login = () => {
   const navigate = useNavigate()
   const [data, setData] = useState({
      email: "",
      password: "",
   })
   const [loading, setLoading] = useState(false);

   const handleChange = (e) => {
      const { name, value } = e.target;
      setData({ ...data, [name]: value });
   };

   const handleSubmit = async (e) => {
      e.preventDefault();

      if (!data?.email || !data?.password) {
         return alert("Please fill all fields");
      }
      
      setLoading(true);
      try {
         const res = await axiosInstance.post('/api/user/login', data);
         if (res.data.success) {
            alert(res.data.message)
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.userData));
            navigate('/dashboard')
            setTimeout(() => {
               window.location.reload()
            }, 1000)
         } else {
            alert(res.data.message)
         }
      } catch (err) {
         if (err.response && err.response.status === 401) {
            alert("User doesn't exist");
         }
         navigate("/login");
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

         <div className='hero-section'>
            <Container className="d-flex justify-content-center align-items-center min-vh-100">
               <div className="form-container fade-in">
                  <div className="text-center mb-4">
                     <Avatar sx={{ 
                        bgcolor: 'var(--primary-color)', 
                        width: 56, 
                        height: 56,
                        margin: '0 auto 1rem'
                     }}>
                        <LockOutlinedIcon />
                     </Avatar>
                     <Typography component="h1" variant="h4" className="form-title">
                        Welcome Back
                     </Typography>
                     <Typography variant="body1" color="textSecondary">
                        Sign in to continue your learning journey
                     </Typography>
                  </div>

                  <Box component="form" onSubmit={handleSubmit} noValidate>
                     <TextField
                        margin="normal"
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        value={data.email}
                        onChange={handleChange}
                        autoComplete="email"
                        autoFocus
                        variant="outlined"
                        className="form-input"
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
                        autoComplete="current-password"
                        variant="outlined"
                        className="form-input"
                     />
                     
                     <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={loading}
                        className="form-button mt-4 mb-3"
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
                              Signing In...
                           </>
                        ) : (
                           'Sign In'
                        )}
                     </Button>
                     
                     <Grid container justifyContent="center">
                        <Grid item>
                           <Typography variant="body2">
                              Don't have an account?{' '}
                              <Link to={'/register'} style={{ 
                                 color: 'var(--primary-color)',
                                 fontWeight: 600,
                                 textDecoration: 'none'
                              }}>
                                 Sign Up
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

export default Login