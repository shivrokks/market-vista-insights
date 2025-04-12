import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI, User } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Check if user is logged in on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const userData = await authAPI.getCurrentUser();
        setUser(userData);
        if (userData.id) {
          localStorage.setItem("userId", userData.id.toString());
        }
      } catch (error) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userId");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const userData = await authAPI.login(email, password);

      if (userData.token) {
        localStorage.setItem("authToken", userData.token);
      }
      if (userData.id) {
        localStorage.setItem("userId", userData.id.toString());
      }

      setUser(userData);
      toast({
        title: "Login successful",
        description: `Welcome back, ${userData.name}!`,
      });

    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid credentials",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      const userData = await authAPI.register(name, email, password);

      if (userData.token) {
        localStorage.setItem("authToken", userData.token);
      }
      if (userData.id) {
        localStorage.setItem("userId", userData.id.toString());
      }

      setUser(userData);
      toast({
        title: "Registration successful",
        description: `Welcome, ${userData.name}!`,
      });

    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Could not create account",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    authAPI.logout();
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    setUser(null);
    toast({
      title: "Logged out",
      description: "You've been successfully logged out",
    });
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
