import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const initialState = {
    isAuthenticated: false,
    isLoading: false,
    user: null,
  };

  const [userState, setUserState] = useState(initialState);
  // console.log(userState);

  const checkAuth = async () => {
    try {
      setUserState({ ...userState, isLoading: true });
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/auth/check-auth`,
        {
          withCredentials: true,
          headers: {
            "Cache-Control":
              "no-store, no-cache, must-revalidate, proxy-revalidate",
          },
        },
      );
      if (response?.data?.success) {
        setUserState({
          isAuthenticated: true,
          isLoading: false,
          user: response.data.user,
        });
      } else {
        setUserState({
          isAuthenticated: false,
          isLoading: false,
          user: null,
        });
      }
    } catch (error) {
      console.log(error);
      setUserState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
      });
    }
  };

  const loginUser = async (formData) => {
    try {
      setUserState({ ...userState, isLoading: true });
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}//api/auth/login`,
        formData,
        { withCredentials: true },
      );
      if (response.data.success) {
        setUserState({
          isAuthenticated: true,
          isLoading: false,
          user: response.data.user,
        });
        return response.data;
      } else {
        setUserState({
          isAuthenticated: false,
          isLoading: false,
          user: null,
        });
        return response.data;
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setUserState({
          isAuthenticated: false,
          isLoading: false,
          user: null,
        });
        return error.response.data; // Pass custom error from backend
      }
      return error.message;
    }
  };

  // useEffect(() => {
  //   checkAuth();
  // }, []);

  const [state, setState] = useState("default value");
  return (
    <AuthContext.Provider value={{ loginUser, checkAuth, userState }}>
      {children}
    </AuthContext.Provider>
  );
};
