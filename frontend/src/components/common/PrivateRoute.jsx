import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../App";

const PrivateRoute = ({ children }) => {
  const { userLoggedIn } = useContext(UserContext);
  
  // Check if user is logged in
  if (!userLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;