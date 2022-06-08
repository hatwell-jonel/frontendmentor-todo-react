import { useAuth } from "../../AuthContext";
import { Navigate, Route } from "react-router-dom";

// const Protected = ({ children }) => {
//   const { user } = useAuth();
//   if (!user) {
//     return <Navigate to="/" />;
//   }

//   return children;
// };
const PrivateRoute = ({ component: Component, ...rest }) => {
  const { currentUser } = useAuth();
  return (
    <Route
      {...rest}
      render={({ location }) => {
        // allow user to go to the component only if logged in, if not logged in get redirected to the login page
        // We totally block access to the page if the user is not logged in
        // can also write the logic this way
        // if(currentUser) return <Component />
        // else if(!currentUser) return <Navigate to="/" />
        return currentUser ? <Component {...location} /> : <Navigate to="/" />;
      }}
    />
  );
};

export default PrivateRoute;
