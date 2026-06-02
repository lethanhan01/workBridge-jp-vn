import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { authApi } from "../../api/authApi";
import { socketService } from "../../services/socketService";
import { toast } from "sonner";

export type UserRole = "admin" | "user";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  nationality?: "japan" | "vietnam";
  phong_ban?: string;
  chuc_vu?: string;
  phong_ban_jp?: string;
  chuc_vu_jp?: string;
  vai_tro?: {
    ten_vai_tro: string;
  };
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  isAdmin: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Khởi tạo user từ localStorage khi app load
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (savedUser && token) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      socketService.connect(parsedUser.id);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password });
      const { user, token } = response;
      
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      
      socketService.connect(user.id);
      
      toast.success(response.message || "Đăng nhập thành công");
      return user;
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Đăng nhập thất bại");
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    socketService.disconnect();
  };

  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
