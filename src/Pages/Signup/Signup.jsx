import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MdEmail, MdLock } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { FaUserAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { useAuth } from "../../AuthContext";

function Signup() {
  const { createUser } = useAuth();
  const [error, setEror] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [conpassword, setConpassword] = useState("");

  const validation = () => {
    if (
      username === "" ||
      email === "" ||
      password === "" ||
      conpassword === ""
    ) {
      setEror("Fields cannot be empthy.");
      timeout();
    } else if (conpassword === "") {
      setEror("Please confirm password.");
      timeout();
    } else if (password !== conpassword) {
      setEror("Password not matched.");
      timeout();
    } else {
      setEror("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (conpassword === "" || !conpassword) return;
    validation();
    // send the user to the login page after creating an account
    createUser(username, email, password);
  };

  const handleUsername = (e) => {
    setUsername(e.target.value);
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleConpassword = (e) => {
    setConpassword(e.target.value);
  };

  // ANIMATION
  const variants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };

  const timeout = () => {
    const validation = setTimeout(() => {
      setEror("");
    }, 3000);
    return validation;
  };

  return (
    <>
      <motion.div
        className="authentication"
        initial="hidden"
        animate="visible"
        variants={variants}
      >
        <div className="container">
          <form onSubmit={handleSubmit}>
            <label>Sign Up</label>

            <div className="input-container">
              {/* NAME */}
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Username"
                  onChange={handleUsername}
                  // required
                />
                <FaUserAlt className="icon user-icon" />
              </div>
              {/* EMAIL */}
              <div className="input-group">
                <input
                  type="email"
                  placeholder="Email"
                  onChange={handleEmail}
                  // required
                />
                <MdEmail className="icon email-icon" />
              </div>
              {/* PASSWORD */}
              <div className="input-group">
                <input
                  type="password"
                  placeholder="Password"
                  onChange={handlePassword}
                  // required
                />
                <MdLock className="icon password-icon" />
              </div>

              <div className="input-group">
                <input
                  type="password"
                  placeholder="Confirm Password"
                  onChange={handleConpassword}
                  // required
                />
                <MdLock className="icon password-icon" />
              </div>

              <div className="input-group">
                {error && <span className="validation">{error}</span>}
              </div>

              <div className="input-group">
                <button type="submit" className="signin-btn">
                  Sign up
                </button>
              </div>
            </div>

            <p className="or">or</p>
            <div className="login_with">
              <button className="login_with-btn google_btn">
                <FcGoogle className="icon" />
                Google
              </button>
            </div>
            <span className="user_account">
              Don't have an account yet?{" "}
              <Link to="/" className="LINK">
                Sign in
              </Link>
            </span>
          </form>
        </div>
      </motion.div>
    </>
  );
}

export default Signup;
