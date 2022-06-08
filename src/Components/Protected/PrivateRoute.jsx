import { useAuth } from "../../AuthContext";
import { Redirect, Route } from "react-router-dom";

// const Protected = ({ children }) => {
//   const { user } = useAuth();
//   if (!user) {
//     return <Navigate to="/" />;
//   }

//   return children;
// };
export default function PrivateRoute({ component: Component, ...rest }) {
  const { user } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) => {
        //  this means if(user != null) return <Component /> else return <Redirect />
        return user ? <Component {...props} /> : <Redirect to="/login" />;
      }}
    ></Route>
  );
}
