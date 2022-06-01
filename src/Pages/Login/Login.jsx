import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { useNavigate } from "react-router-dom";

import { MdEmail, MdLock } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
function Login() {
  const { googleSignIn, user, emailAndPasswordSignIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (user != null) {
      navigate("/account");
    }
  }, [user]);

  return (
    <>
      <div className="authentication">
        <div className="container">
          <form onSubmit={(e) => e.preventDefault()}>
            <label>Log In</label>

            <div className="input-container">
              {/* EMAIL */}
              <div className="input-group">
                <input
                  type="email"
                  placeholder="Email"
                  onChange={handleEmail}
                />
                <MdEmail className="icon email-icon" />
              </div>
              {/* PASSWORD */}
              <div className="input-group">
                <input
                  type="password"
                  placeholder="Password"
                  onChange={handlePassword}
                />
                <MdLock className="icon password-icon" />
              </div>

              <div className="input-group">
                <button
                  type="submit"
                  className="signin-btn"
                  onClick={() => emailAndPasswordSignIn(email, password)}
                >
                  Login
                </button>
              </div>
            </div>

            <p className="or">or</p>
            <div className="login_with">
              <button
                className="login_with-btn google_btn"
                onClick={handleGoogleSignIn}
              >
                <FcGoogle className="icon" />
                Google
              </button>
            </div>
            <span className="user_account">
              Don't have an account yet?{" "}
              <Link to="/signup" className="LINK">
                Sign up
              </Link>
            </span>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
