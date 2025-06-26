import React, { useState, useEffect } from 'react'
import { Button, styled, TableRow, TableHead, TableContainer, Paper, Table, TableBody, TableCell, tableCellClasses, Container, Typography, Box, Card, CardContent, Grid, Chip, Avatar } from '@mui/material'
import { PeopleAlt, School, TrendingUp, Delete, Visibility } from '@mui/icons-material'
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
      cursor: 'pointer',
   },
   '&:last-child td, &:last-child th': {
      border: 0,
   },
}));

const StatsCard = styled(Card)(({ theme }) => ({
   background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
   color: 'white',
   height: '100%',
   transition: 'transform 0.3s ease',
   '&:hover': {
      transform: 'translateY(-4px)',
   },
}));

const AdminHome = () => {
   const [allUsers, setAllUsers] = useState([])
   const [allCourses, setAllCourses] = useState([])
   const [stats, setStats] = useState({
      totalUsers: 0,
      totalCourses: 0,
      totalStudents: 0,
      totalTeachers: 0,
      totalEnrollments: 0
   })
   const [loading, setLoading] = useState(true)

   const allUsersList = async () => {
      try {
         const res = await axiosInstance.get('api/admin/getallusers', {
            headers: {
               "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
         })
         if (res.data.success) {
            setAllUsers(res.data.data)
            calculateStats(res.data.data, allCourses)
         }
         else {
            alert(res.data.message)
         }
      } catch (error) {
         console.log(error);
      }
   }

   const allCoursesList = async () => {
      try {
         const res = await axiosInstance.get('api/admin/getallcourses', {
            headers: {
               "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
         })
         if (res.data.success) {
            setAllCourses(res.data.data)
            calculateStats(allUsers, res.data.data)
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

   const calculateStats = (users, courses) => {
      const students = users.filter(user => user.type === 'Student').length
      const teachers = users.filter(user => user.type === 'Teacher').length
      const totalEnrollments = courses.reduce((sum, course) => sum + course.enrolled, 0)

      setStats({
         totalUsers: users.length,
         totalCourses: courses.length,
         totalStudents: students,
         totalTeachers: teachers,
         totalEnrollments
      })
   }

   useEffect(() => {
      allUsersList()
      allCoursesList()
   }, [])

   const deleteUser = async (userId) => {
      const confirmation = window.confirm('Are you sure you want to delete this user? This action cannot be undone.')
      if (!confirmation) {
         return;
      }
      try {
         const res = await axiosInstance.delete(`api/admin/deleteuser/${userId}`, {
            headers: {
               Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
         })
         if (res.data.success) {
            alert(res.data.message)
            allUsersList()
         } else {
            alert("Failed to delete the user")
         }
      } catch (error) {
         console.log('An error occurred:', error);
      }
   }

   const getUserTypeColor = (type) => {
      switch (type) {
         case 'Admin': return 'error'
         case 'Teacher': return 'primary'
         case 'Student': return 'success'
         default: return 'default'
      }
   }

   if (loading) {
      return (
         <Container maxWidth="lg" sx={{ marginTop: 4 }}>
            <div className="text-center py-5">
               <div className="loading-spinner mx-auto mb-3"></div>
               <p>Loading dashboard...</p>
            </div>
         </Container>
      )
   }

   return (
      <Container maxWidth="lg" sx={{ marginTop: 4 }}>
         <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold', color: '#1e293b' }}>
            Admin Dashboard
         </Typography>

         {/* Stats Cards */}
         <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
               <StatsCard>
                  <CardContent sx={{ textAlign: 'center' }}>
                     <PeopleAlt sx={{ fontSize: 40, mb: 1 }} />
                     <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                        {stats.totalUsers}
                     </Typography>
                     <Typography variant="body2">
                        Total Users
                     </Typography>
                  </CardContent>
               </StatsCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
               <StatsCard sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                     <School sx={{ fontSize: 40, mb: 1 }} />
                     <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                        {stats.totalCourses}
                     </Typography>
                     <Typography variant="body2">
                        Total Courses
                     </Typography>
                  </CardContent>
               </StatsCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
               <StatsCard sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                     <TrendingUp sx={{ fontSize: 40, mb: 1 }} />
                     <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                        {stats.totalEnrollments}
                     </Typography>
                     <Typography variant="body2">
                        Total Enrollments
                     </Typography>
                  </CardContent>
               </StatsCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
               <StatsCard sx={{ background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', color: '#1e293b' }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                     <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                           {stats.totalTeachers}
                        </Typography>
                        <Typography variant="body2" sx={{ alignSelf: 'end' }}>
                           Teachers
                        </Typography>
                     </Box>
                     <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                           {stats.totalStudents}
                        </Typography>
                        <Typography variant="body2" sx={{ alignSelf: 'end' }}>
                           Students
                        </Typography>
                     </Box>
                  </CardContent>
               </StatsCard>
            </Grid>
         </Grid>

         {/* Users Table */}
         <Paper sx={{ mb: 4, borderRadius: 2, overflow: 'hidden', boxShadow: 3 }}>
            <Box sx={{ p: 3, background: '#1e293b', color: 'white' }}>
               <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  User Management
               </Typography>
               <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
                  Manage all platform users
               </Typography>
            </Box>
            <TableContainer>
               <Table sx={{ minWidth: 700 }} aria-label="users table">
                  <TableHead>
                     <TableRow>
                        <StyledTableCell>User</StyledTableCell>
                        <StyledTableCell align="left">Email</StyledTableCell>
                        <StyledTableCell align="center">Type</StyledTableCell>
                        <StyledTableCell align="center">Joined</StyledTableCell>
                        <StyledTableCell align="center">Actions</StyledTableCell>
                     </TableRow>
                  </TableHead>
                  <TableBody>
                     {allUsers.length > 0 ? (
                        allUsers.map((user) => (
                           <StyledTableRow key={user._id}>
                              <StyledTableCell component="th" scope="row">
                                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Avatar sx={{ bgcolor: '#667eea', width: 32, height: 32 }}>
                                       {user.name.charAt(0).toUpperCase()}
                                    </Avatar>
                                    <Box>
                                       <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                          {user.name}
                                       </Typography>
                                       <Typography variant="caption" color="textSecondary">
                                          ID: {user._id.slice(-6)}
                                       </Typography>
                                    </Box>
                                 </Box>
                              </StyledTableCell>
                              <StyledTableCell>{user.email}</StyledTableCell>
                              <StyledTableCell align="center">
                                 <Chip 
                                    label={user.type} 
                                    color={getUserTypeColor(user.type)}
                                    size="small"
                                    sx={{ fontWeight: 'bold' }}
                                 />
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                 {new Date(user.createdAt).toLocaleDateString()}
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                 <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                    <Button 
                                       onClick={() => deleteUser(user._id)} 
                                       size='small' 
                                       color="error"
                                       variant="outlined"
                                       startIcon={<Delete />}
                                       sx={{ minWidth: 'auto' }}
                                    >
                                       Delete
                                    </Button>
                                 </Box>
                              </StyledTableCell>
                           </StyledTableRow>
                        ))
                     ) : (
                        <TableRow>
                           <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                              <Typography color="textSecondary">No users found</Typography>
                           </TableCell>
                        </TableRow>
                     )}
                  </TableBody>
               </Table>
            </TableContainer>
         </Paper>
      </Container>
   )
}

export default AdminHome