import { useContext, createContext, useEffect, useState } from "react";
import { auth } from "./firebase";
import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  updateProfile,
  deleteUser,
} from "firebase/auth";
import { useHistory } from "react-router-dom";

const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState();
  const history = useHistory();

  // delete user
  const deleteAccount = () => {
    deleteUser(user)
      .then(() => {
        alert("Your account is successfully deleted.");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Refactored login function so it can be used with any login provider

  const login = (provider) => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const userInfo = result.user;
        setUser(userInfo);
      })
      .catch((error) => console.error(error));
  };

  // signin using google account
  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    return login(provider);
  };

  // signin using facebook account
  const facebookSignIn = () => {
    const provider = new FacebookAuthProvider();
    return login(provider);
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
      }).then(() => {
        // redirect the user to the login page when the account is created
        alert("Your account was created! Please login");
        history.push("/");
      });

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
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        googleSignIn,
        facebookSignIn,
        logout,
        createUser,
        emailAndPasswordSignIn,
        deleteAccount,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
