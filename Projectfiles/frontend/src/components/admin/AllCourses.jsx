import React, { useState, useEffect } from 'react'
import { Button, styled, TableRow, TableHead, TableContainer, Paper, Table, TableBody, TableCell, tableCellClasses, Box, Typography, Chip, Avatar } from '@mui/material'
import { Delete, Visibility, People, VideoLibrary } from '@mui/icons-material'
import axiosInstance from '../common/AxiosInstance'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
   [`&.${tableCellClasses.head}`]: {
      backgroundColor: '#1e293b',
      color: theme.palette.common.white,
      fontWeight: 600,
   },
   [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
   },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
   '&:nth-of-type(odd)': {
      backgroundColor: '#f8fafc',
   },
   '&:hover': {
      backgroundColor: '#e2e8f0',
   },
   '&:last-child td, &:last-child th': {
      border: 0,
   },
}));

const AllCourses = () => {
   const [allCourses, setAllCourses] = useState([])
   const [loading, setLoading] = useState(true)

   const allCoursesList = async () => {
      try {
         const res = await axiosInstance.get('/api/admin/getallcourses', {
            headers: {
               "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
         })
         if (res.data.success) {
            setAllCourses(res.data.data)
         }
         else {
            alert(res.data.message)
         }
      } catch (error) {
         console.log(error);
      } finally {
         setLoading(false)
      }
   }

   useEffect(() => {
      allCoursesList()
      
      // Listen for enrollment success events
      const handleEnrollmentSuccess = () => {
         allCoursesList();
      };
      
      window.addEventListener('enrollmentSuccess', handleEnrollmentSuccess);
      
      return () => {
         window.removeEventListener('enrollmentSuccess', handleEnrollmentSuccess);
      };
   }, [])

   const deleteCourse = async (courseId) => {
      const confirmation = window.confirm('Are you sure you want to delete this course? This action cannot be undone.')
      if (!confirmation) {
         return;
      }
      try {
         const res = await axiosInstance.delete(`/api/admin/deletecourse/${courseId}`, {
            headers: {
               Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
         })
         if (res.data.success) {
            alert(res.data.message)
            allCoursesList()
         } else {
            alert("Failed to delete the course")
         }
      } catch (error) {
         console.log('An error occurred:', error);
      }
   }

   const getCategoryColor = (category) => {
      switch (category) {
         case 'IT & Software': return 'primary'
         case 'Finance & Accounting': return 'success'
         case 'Personal Development': return 'warning'
         default: return 'default'
      }
   }

   const isPaidCourse = (price) => {
      return /\d/.test(price) && price !== 'free'
   }

   if (loading) {
      return (
         <div className="text-center py-5">
            <div className="loading-spinner mx-auto mb-3"></div>
            <p>Loading courses...</p>
         </div>
      )
   }

   return (
      <Paper sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: 3 }}>
         <Box sx={{ p: 3, background: '#1e293b', color: 'white' }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
               Course Management
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
               Manage all platform courses ({allCourses.length} total)
            </Typography>
         </Box>
         <TableContainer>
            <Table sx={{ minWidth: 700 }} aria-label="courses table">
               <TableHead>
                  <TableRow>
                     <StyledTableCell>Course</StyledTableCell>
                     <StyledTableCell align="center">Category</StyledTableCell>
                     <StyledTableCell align="center">Price</StyledTableCell>
                     <StyledTableCell align="center">Content</StyledTableCell>
                     <StyledTableCell align="center">Enrolled</StyledTableCell>
                     <StyledTableCell align="center">Created</StyledTableCell>
                     <StyledTableCell align="center">Actions</StyledTableCell>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {allCourses.length > 0 ? (
                     allCourses.map((course) => (
                        <StyledTableRow key={course._id}>
                           <StyledTableCell component="th" scope="row">
                              <Box>
                                 <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                    {course.C_title}
                                 </Typography>
                                 <Typography variant="caption" color="textSecondary">
                                    by {course.C_educator}
                                 </Typography>
                                 <br />
                                 <Typography variant="caption" color="textSecondary">
                                    ID: {course._id.slice(-6)}
                                 </Typography>
                              </Box>
                           </StyledTableCell>
                           <StyledTableCell align="center">
                              <Chip 
                                 label={course.C_categories} 
                                 color={getCategoryColor(course.C_categories)}
                                 size="small"
                                 sx={{ fontWeight: 'bold' }}
                              />
                           </StyledTableCell>
                           <StyledTableCell align="center">
                              <Chip 
                                 label={isPaidCourse(course.C_price) ? `₹${course.C_price}` : 'FREE'}
                                 color={isPaidCourse(course.C_price) ? 'success' : 'warning'}
                                 size="small"
                                 sx={{ fontWeight: 'bold' }}
                              />
                           </StyledTableCell>
                           <StyledTableCell align="center">
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                 <VideoLibrary sx={{ fontSize: 16, color: '#64748b' }} />
                                 <Typography variant="body2">
                                    {course.sections.length} modules
                                 </Typography>
                              </Box>
                           </StyledTableCell>
                           <StyledTableCell align="center">
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                 <People sx={{ fontSize: 16, color: '#64748b' }} />
                                 <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#10b981' }}>
                                    {course.enrolled || 0}
                                 </Typography>
                              </Box>
                           </StyledTableCell>
                           <StyledTableCell align="center">
                              <Typography variant="body2">
                                 {new Date(course.createdAt).toLocaleDateString()}
                              </Typography>
                           </StyledTableCell>
                           <StyledTableCell align="center">
                              <Button 
                                 onClick={() => deleteCourse(course._id)} 
                                 size='small' 
                                 color="error"
                                 variant="outlined"
                                 startIcon={<Delete />}
                              >
                                 Delete
                              </Button>
                           </StyledTableCell>
                        </StyledTableRow>
                     ))
                  ) : (
                     <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                           <Typography color="textSecondary">No courses found</Typography>
                        </TableCell>
                     </TableRow>
                  )}
               </TableBody>
            </Table>
         </TableContainer>
      </Paper>
   )
}

export default AllCourses