import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import type { ReactNode } from "react";
import { useUser, useClerk, useAuth as useClerkAuth } from "@clerk/react";
import api from "../services/api";

export interface User {
  _id: string;
  clerkUserId?: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  avatar?: string;
  gender?: string;
  createdAt?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  userSyncLoading: boolean;
  isAuthenticated: boolean;
  getToken: () => Promise<string | null>;
  checkAuth: () => Promise<void>;
  login: (email?: string, password?: string) => Promise<void>;
  signup: (name?: string, email?: string, password?: string) => Promise<User | null>;
  logout: () => Promise<void>;
  updateProfile: (data: { name?: string; firstName?: string; lastName?: string; avatar?: string; gender?: string }) => Promise<void>;
  uploadAvatar: (file: File) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { isLoaded, isSignedIn, user: clerkUser } = useUser();
  const { signOut } = useClerk();
  const { getToken } = useClerkAuth();

  const [backendUser, setBackendUser] = useState<User | null>(() => {
    const cached = localStorage.getItem("veloura_user");
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {}
    }
    return null;
  });

  const [syncLoading, setSyncLoading] = useState(false);
  const isSyncingRef = useRef(false);

  const isAuthenticated = Boolean(isLoaded && isSignedIn);
  const loading = !isLoaded; // Auth loading is ONLY true while Clerk is initializing
  const userSyncLoading = syncLoading;

  // Derived user combining Clerk identity with backend user record
  const user: User | null = isSignedIn && clerkUser
    ? {
        _id: backendUser?._id || clerkUser.id,
        clerkUserId: clerkUser.id,
        name:
          backendUser?.name ||
          clerkUser.fullName ||
          `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() ||
          clerkUser.primaryEmailAddress?.emailAddress ||
          "User",
        firstName:
          backendUser?.firstName !== undefined && backendUser?.firstName !== ""
            ? backendUser.firstName
            : (clerkUser.firstName || ""),
        lastName:
          backendUser?.lastName !== undefined
            ? backendUser.lastName
            : (clerkUser.lastName || ""),
        email: clerkUser.primaryEmailAddress?.emailAddress || backendUser?.email || "",
        avatar: backendUser?.avatar || clerkUser.imageUrl || "",
        gender: backendUser?.gender || "",
        createdAt: backendUser?.createdAt ? new Date(clerkUser.createdAt!).toISOString() : undefined,
      }
    : null;

  const checkAuth = async () => {
    if (!isSignedIn) {
      setBackendUser(null);
      localStorage.removeItem("veloura_user");
      isSyncingRef.current = false;
      return;
    }

    if (isSyncingRef.current) {
      if (import.meta.env.DEV) {
        console.log("[AUTH DEBUG] checkAuth already in-flight, skipping duplicate request.");
      }
      return;
    }

    try {
      isSyncingRef.current = true;
      const startTime = performance.now();
      if (import.meta.env.DEV) {
        console.log(`[AUTH DEBUG] AuthContext checkAuth sync start. isLoaded: ${isLoaded}, isSignedIn: ${isSignedIn}`);
      }
      setSyncLoading(true);

      const tokenStart = performance.now();
      const token = await getToken();
      if (import.meta.env.DEV) {
        console.log(`[AUTH DEBUG] getToken duration: ${(performance.now() - tokenStart).toFixed(2)} ms`);
      }

      const apiStart = performance.now();
      const response = await api.get("/auth/me", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (import.meta.env.DEV) {
        console.log(`[AUTH DEBUG] /auth/me request duration: ${(performance.now() - apiStart).toFixed(2)} ms`);
        console.log(`[AUTH DEBUG] Total checkAuth duration: ${(performance.now() - startTime).toFixed(2)} ms`);
      }

      if (response.data?.user) {
        setBackendUser(response.data.user);
        localStorage.setItem("veloura_user", JSON.stringify(response.data.user));
      }
    } catch (error) {
      console.error("Auth sync warning:", error);
    } finally {
      setSyncLoading(false);
      isSyncingRef.current = false;
    }
  };

  useEffect(() => {
    if (isLoaded) {
      if (import.meta.env.DEV) {
        console.log(`[AUTH DEBUG] Clerk loaded (isLoaded: true). isSignedIn: ${isSignedIn}`);
      }
      if (isSignedIn && clerkUser) {
        checkAuth();
      } else {
        setBackendUser(null);
        localStorage.removeItem("veloura_user");
        setSyncLoading(false);
      }
    }
  }, [isLoaded, isSignedIn, clerkUser?.id]);

  const login = async () => {
    await checkAuth();
  };

  const signup = async (): Promise<User | null> => {
    await checkAuth();
    return user;
  };

  const logout = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error("Clerk signOut error:", err);
    }
    localStorage.removeItem("veloura_user");
    setBackendUser(null);
  };

  const updateProfile = async (data: { name?: string; firstName?: string; lastName?: string; avatar?: string; gender?: string }) => {
    try {
      const token = await getToken();
      const res = await api.put("/auth/profile", data, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.data?.user) {
        setBackendUser(res.data.user);
        localStorage.setItem("veloura_user", JSON.stringify(res.data.user));
      }
    } catch (err) {
      console.error("Update profile error:", err);
      throw err;
    }
  };

  const uploadAvatar = async (file: File) => {
    const token = await getToken();
    const formData = new FormData();
    formData.append("image", file);
    const res = await api.post("/auth/avatar", formData, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (res.data?.user) {
      setBackendUser(res.data.user);
      localStorage.setItem("veloura_user", JSON.stringify(res.data.user));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        userSyncLoading,
        isAuthenticated,
        getToken,
        checkAuth,
        login,
        signup,
        logout,
        updateProfile,
        uploadAvatar,
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