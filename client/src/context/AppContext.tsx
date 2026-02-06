import React, {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from "react";
import api from "../api/axios";
import { toast } from "react-hot-toast";

interface UserData {
  id: string;
  name: string;
  email: string;
  isAccountVerified: boolean;
}

interface AppContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  userData: UserData | null;
  setUserData: React.Dispatch<React.SetStateAction<UserData | null>>;
  getUserData: () => Promise<void>;
}

export const AppContent = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider = (props: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  const getAuthState = async () => {
    try {
      const { data } = await api.get("/auth/is-auth");
      if (data.success) {
        setIsLoggedIn(true);
        getUserData();
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const getUserData = async () => {
    try {
      const { data } = await api.get("/user/data");
      if (data.success) {
        setUserData(data.data.user);
        setIsLoggedIn(true);
      }
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        setIsLoggedIn(false);
        setUserData(null);
        return; // Stop execution here
      }

      toast.error(error.response?.data?.message || error.message);
    }
  };

  // automatically fetch user data when the app loads
  useEffect(() => {
    getAuthState();
  }, []);

  const value = {
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData,
  };

  return (
    <AppContent.Provider value={value}>{props.children}</AppContent.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContent);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
};
