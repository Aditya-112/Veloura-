import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import type { ReactNode } from "react";

import api from "../services/api";

interface User {
  _id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  checkAuth: () => Promise<void>;// asyn function , doesnt return useful value
  login: (email: string, password: string) => Promise<void>;
  logout: ()=> Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = user !== null;

  const checkAuth = async () => {
    try {
        const response = await api.get("/auth/me");

        setUser(response.data.user);

    } catch{
        setUser(null);

    } finally {
        setLoading(false);
    }
};

const login = async(email: string, password:string) =>{
    await api.post("/auth/login",{
        email,
        password,
    });
    await checkAuth();
}
const logout = async () =>{
    await api.post("/auth/logout");
    
    setUser(null);
}

useEffect(() => {
    checkAuth();
},[]);


  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        checkAuth,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};



export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};