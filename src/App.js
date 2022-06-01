import React from "react";
import { AuthContextProvider } from "./AuthContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login/Login";
import Signup from "./Pages/Signup/Signup";
import Account from "./Pages/Account/Account";
import Protected from "./Components/Protected/Protected";
import Header from "./Components/Header/Header";

function App() {
  return (
    <AuthContextProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/signup" element={<Signup />} />
          <Route
            exact
            path="/account"
            element={
              <Protected>
                <Account />
              </Protected>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthContextProvider>
  );
}

export default App;
