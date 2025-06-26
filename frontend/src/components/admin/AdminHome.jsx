import React, { useState, useEffect } from 'react'
import { Button, styled, TableRow, TableHead, TableContainer, Paper, Table, TableBody, TableCell, tableCellClasses, Container, Typography, Box } from '@mui/material'
import axiosInstance from '../common/AxiosInstance'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
   [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
   },
   [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
   },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
   '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
   },
   // hide last border
   '&:last-child td, &:last-child th': {
      border: 0,
   },
}));

const AdminHome = () => {
   const [allUsers, setAllUsers] = useState([])

   const allUsersList = async () => {
      try {
         const res = await axiosInstance.get('api/admin/getallusers', {
            headers: {
               "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
         })
         if (res.data.success) {
            setAllUsers(res.data.data)
         }
         else {
            alert(res.data.message)
         }
      } catch (error) {
         console.log(error);
      }
   }

   useEffect(() => {
      allUsersList()
   }, [])

   const deleteUser = async (userId) => {
      const confirmation = confirm('Are you sure you want to delete this user?')
      if (!confirmation) {
         return;
      }
      try {
         const res = await axiosInstance.delete(`api/user/deleteuser/${userId}`, {
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

   return (
      <Container maxWidth="lg" sx={{ marginTop: 4 }}>
         <Typography variant="h5" gutterBottom align="center">
            User Management
         </Typography>
         <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
               <TableHead>
                  <TableRow>
                     <StyledTableCell>User ID</StyledTableCell>
                     <StyledTableCell align="left">User Name</StyledTableCell>
                     <StyledTableCell align="left">Email</StyledTableCell>
                     <StyledTableCell align="left">Type</StyledTableCell>
                     <StyledTableCell align="left">Action</StyledTableCell>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {allUsers.length > 0 ? (
                     allUsers.map((user) => (
                        <StyledTableRow key={user._id}>
                           <StyledTableCell component="th" scope="row">
                              {user._id}
                           </StyledTableCell>
                           <StyledTableCell>{user.name}</StyledTableCell>
                           <StyledTableCell>{user.email}</StyledTableCell>
                           <StyledTableCell>{user.type}</StyledTableCell>
                           <StyledTableCell>
                              <Button onClick={() => deleteUser(user._id)} size='small' color="error">
                                 Delete
                              </Button>
                              {/* <Button size='small' color="info">Update</Button> */}
                           </StyledTableCell>
                        </StyledTableRow>
                     ))
                  ) : (
                     <TableRow>
                        <TableCell colSpan={5} align="center">
                           <Typography>No users found</Typography>
                        </TableCell>
                     </TableRow>
                  )}
               </TableBody>
            </Table>
         </TableContainer>
      </Container>
   )
}

export default AdminHome