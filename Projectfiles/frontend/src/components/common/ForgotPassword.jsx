import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Nav, Navbar, Alert } from 'react-bootstrap';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LockResetIcon from '@mui/icons-material/LockReset';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import axiosInstance from './AxiosInstance';

const ForgotPassword = () => {
   const navigate = useNavigate();
   const [email, setEmail] = useState('');
   const [loading, setLoading] = useState(false);
   const [success, setSuccess] = useState(false);
   const [error, setError] = useState('');

   const handleSubmit = async (e) => {
      e.preventDefault();
      
      if (!email) {
         setError('Please enter your email address');
         return;
      }

      if (!/\S+@\S+\.\S+/.test(email)) {
         setError('Please enter a valid email address');
         return;
      }

      setLoading(true);
      setError('');

      try {
         const res = await axiosInstance.post('/api/user/forgot-password', { email });
         
         if (res.data.success) {
            setSuccess(true);
            // Auto redirect to login after 3 seconds
            setTimeout(() => {
               navigate('/login');
            }, 3000);
         } else {
            setError(res.data.message || 'Failed to send reset email');
         }
      } catch (error) {
         console.error('Forgot password error:', error);
         setError('Failed to send reset email. Please try again.');
      } finally {
         setLoading(false);
      }
   };

   const handleResendEmail = () => {
      setSuccess(false);
      setEmail('');
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
                  {!success ? (
                     <>
                        <div className="text-center mb-4">
                           <Avatar sx={{ 
                              bgcolor: 'var(--primary-color)', 
                              width: 56, 
                              height: 56,
                              margin: '0 auto 1rem'
                           }}>
                              <LockResetIcon />
                           </Avatar>
                           <Typography component="h1" variant="h4" className="form-title">
                              Forgot Password?
                           </Typography>
                           <Typography variant="body1" color="textSecondary">
                              No worries! Enter your email and we'll send you reset instructions
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
                              id="email"
                              label="Email Address"
                              name="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              autoComplete="email"
                              autoFocus
                              variant="outlined"
                              className="form-input"
                              error={!!error && !email}
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
                                    Sending Reset Link...
                                 </>
                              ) : (
                                 'Send Reset Link'
                              )}
                           </Button>
                           
                           <Grid container justifyContent="center">
                              <Grid item>
                                 <Typography variant="body2">
                                    Remember your password?{' '}
                                    <Link to={'/login'} style={{ 
                                       color: 'var(--primary-color)',
                                       fontWeight: 600,
                                       textDecoration: 'none'
                                    }}>
                                       Back to Login
                                    </Link>
                                 </Typography>
                              </Grid>
                           </Grid>
                        </Box>
                     </>
                  ) : (
                     <div className="text-center">
                        <Avatar sx={{ 
                           bgcolor: 'var(--success-color)', 
                           width: 56, 
                           height: 56,
                           margin: '0 auto 1rem'
                        }}>
                           <CheckCircleIcon />
                        </Avatar>
                        <Typography component="h1" variant="h4" className="form-title mb-3">
                           Check Your Email
                        </Typography>
                        <Typography variant="body1" color="textSecondary" className="mb-4">
                           We've sent password reset instructions to:
                        </Typography>
                        <Typography variant="body1" className="fw-bold mb-4" style={{ color: 'var(--primary-color)' }}>
                           {email}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" className="mb-4">
                           Didn't receive the email? Check your spam folder or try again.
                        </Typography>
                        
                        <Alert variant="success" className="mb-4">
                           Reset link sent successfully! Redirecting to login page in 3 seconds...
                        </Alert>
                        
                        <div className="d-flex flex-column gap-2">
                           <Button
                              fullWidth
                              variant="contained"
                              onClick={handleResendEmail}
                              sx={{ 
                                 py: 1.5,
                                 background: 'var(--gradient-primary)',
                                 '&:hover': {
                                    background: 'var(--gradient-primary)',
                                    transform: 'translateY(-2px)',
                                    boxShadow: 'var(--shadow-lg)'
                                 }
                              }}
                           >
                              Try Another Email
                           </Button>
                           <Link to="/login" className="w-100">
                              <Button
                                 fullWidth
                                 variant="outlined"
                                 sx={{ py: 1.5 }}
                              >
                                 Back to Login
                              </Button>
                           </Link>
                        </div>
                     </div>
                  )}
               </div>
            </Container>
         </div>
      </>
   );
};

export default ForgotPassword;