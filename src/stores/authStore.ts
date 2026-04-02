import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserRole = "customer" | "admin" | "staff";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => boolean;
  signup: (name: string, email: string, password: string, role: UserRole) => boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (email, _password, role) => {
        const user: User = {
          id: crypto.randomUUID(),
          name: email.split("@")[0],
          email,
          role,
          avatar: email.split("@")[0].substring(0, 2).toUpperCase(),
        };
        set({ user, isAuthenticated: true });
        return true;
      },
      signup: (name, email, _password, role) => {
        const user: User = {
          id: crypto.randomUUID(),
          name,
          email,
          role,
          avatar: name.substring(0, 2).toUpperCase(),
        };
        set({ user, isAuthenticated: true });
        return true;
      },
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: "brew-haven-auth" }
  )
);
