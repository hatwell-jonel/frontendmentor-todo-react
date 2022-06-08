import React from "react";
import { AuthContextProvider } from "./AuthContext";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Login from "./Pages/Login/Login";
import Signup from "./Pages/Signup/Signup";
import Account from "./Pages/Account/Account";
// import Protected from "./Components/Protected/Protected";
import PrivateRoute from "./Components/Protected/PrivateRoute";
import Header from "./Components/Header/Header";

function App() {
  return (
    // <AuthContextProvider>
    //   <BrowserRouter>
    //     <Header />
    //     <Routes>
    //       <Route exact path="/" element={<Login />} />
    //       <Route exact path="/signup" element={<Signup />} />
    //       {/* <Route
    //         exact
    //         path="/account"
    //         element={
    //           <Protected>
    //             <Account />
    //           </Protected>
    //         }
    //       /> */}
    //     </Routes>
    //   </BrowserRouter>
    // </AuthContextProvider>
    <BrowserRouter>
      <AuthContextProvider>
        <Header />
        <Switch>
          <PrivateRoute exact path="/" component={Account} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={Signup} />
        </Switch>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

// the Account page cannot be accessed by a user who is not logged in,
// if the user trys to go there the router will redirect them to the login page
// this means you can remove all logic related to checking if the user is logged in from your other components

export default App;
