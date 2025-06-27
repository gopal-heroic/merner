import React, { useContext } from 'react'
import { Navbar, Nav, Button, Container, Dropdown } from 'react-bootstrap';
import { UserContext } from '../../App';

const NavBar = ({ setSelectedComponent }) => {
   const user = useContext(UserContext)

   if (!user) {
      return null
   }

   const handleLogout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      user.setUserLoggedIn(false);
      user.setUserData(null);
      window.location.href = "/";
   }

   const handleOptionClick = (component) => {
      if (setSelectedComponent) {
         setSelectedComponent(component);
      }
   };

   // Listen for navigation events from other components
   React.useEffect(() => {
      const handleNavigateToSection = (event) => {
         if (setSelectedComponent) {
            setSelectedComponent(event.detail);
         }
      };

      window.addEventListener('navigateToSection', handleNavigateToSection);
      
      return () => {
         window.removeEventListener('navigateToSection', handleNavigateToSection);
      };
   }, [setSelectedComponent]);

   return (
      <Navbar expand="lg" className="navbar-custom sticky-top">
         <Container>
            <Navbar.Brand className="navbar-brand">
               <span className="text-gradient">LearnHub</span>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll">
               <Nav className="me-auto">
                  <Nav.Link 
                     onClick={() => handleOptionClick('home')}
                     style={{ cursor: 'pointer' }}
                     className="nav-link"
                  >
                     Dashboard
                  </Nav.Link>
                  
                  {user.userData.type === 'Teacher' && (
                     <Nav.Link 
                        onClick={() => handleOptionClick('addcourse')}
                        style={{ cursor: 'pointer' }}
                        className="nav-link"
                     >
                        Create Course
                     </Nav.Link>
                  )}
                  
                  {user.userData.type === 'Admin' && (
                     <>
                        <Nav.Link 
                           onClick={() => handleOptionClick('cousres')}
                           style={{ cursor: 'pointer' }}
                           className="nav-link"
                        >
                           Manage Courses
                        </Nav.Link>
                        <Nav.Link 
                           onClick={() => handleOptionClick('statistics')}
                           style={{ cursor: 'pointer' }}
                           className="nav-link"
                        >
                           📊 Statistics
                        </Nav.Link>
                     </>
                  )}
                  
                  {user.userData.type === 'Student' && (
                     <Nav.Link 
                        onClick={() => handleOptionClick('enrolledcourese')}
                        style={{ cursor: 'pointer' }}
                        className="nav-link"
                     >
                        My Courses
                     </Nav.Link>
                  )}
               </Nav>
               
               <Nav className="d-flex align-items-center">
                  <Dropdown align="end">
                     <Dropdown.Toggle 
                        variant="outline-primary" 
                        id="dropdown-basic"
                        className="d-flex align-items-center gap-2 border-0"
                        style={{ 
                           background: 'var(--neutral-100)',
                           color: 'var(--neutral-700)',
                           fontWeight: 600
                        }}
                     >
                        <div className="d-flex align-items-center gap-2">
                           <div 
                              className="rounded-circle d-flex align-items-center justify-content-center"
                              style={{ 
                                 width: '32px', 
                                 height: '32px', 
                                 background: 'var(--gradient-primary)',
                                 color: 'white',
                                 fontSize: '14px',
                                 fontWeight: 'bold'
                              }}
                           >
                              {user.userData.name.charAt(0).toUpperCase()}
                           </div>
                           <span className="d-none d-md-inline">
                              {user.userData.name}
                           </span>
                        </div>
                     </Dropdown.Toggle>

                     <Dropdown.Menu className="shadow-lg border-0 mt-2">
                        <Dropdown.Header>
                           <div className="text-center">
                              <strong>{user.userData.name}</strong>
                              <div className="text-muted small">{user.userData.email}</div>
                              <div className="mt-1">
                                 <span className="badge-primary">
                                    {user.userData.type}
                                 </span>
                              </div>
                           </div>
                        </Dropdown.Header>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={handleLogout} className="text-danger">
                           <i className="fas fa-sign-out-alt me-2"></i>
                           Sign Out
                        </Dropdown.Item>
                     </Dropdown.Menu>
                  </Dropdown>
               </Nav>
            </Navbar.Collapse>
         </Container>
      </Navbar>
   )
}

export default NavBar