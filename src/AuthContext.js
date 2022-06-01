import { useContext, createContext, useEffect, useState } from "react";
import { auth } from "./firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { useHistory } from "react-router-dom";
const AuthContext = createContext();
const provider = new GoogleAuthProvider();

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState();

  // signin using google account
  const googleSignIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const userInfo = result.user;
        setUser(userInfo);
      })
      .catch((error) => console.error(error));
  };

  // register user with email and password
  const createUser = async (username, email, password) => {
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(user, {
        displayName: username,
      }).then(alert("Your Account is now registered. Please Sign In."));

      if (user) {
        signOut(auth);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Sign in with email and password
  const emailAndPasswordSignIn = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // signout the current account
  const logout = () => {
    signOut(auth);
  };

  useEffect(() => {
    const unsubcribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => {
      unsubcribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ googleSignIn, logout, createUser, emailAndPasswordSignIn, user }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
