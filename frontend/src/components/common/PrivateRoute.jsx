import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../App"; // adjust path if needed

const PrivateRoute = ({ children }) => {
  const { userLoggedIn } = useContext(UserContext);

  return userLoggedIn ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
