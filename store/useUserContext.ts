import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthStore {
  user: {
    name: string;
    role: string;
    access_token: String;
  };
  login: (userData: any) => void;
  logout: () => void;
}

const useAuthStore = create(
  persist<AuthStore>(
    (set, get) => ({
      user: {
        name: "",
        role: "",
        access_token: "",
      },
      login: (userData: any) => set({ user: userData }),
      logout: () => set({ user: { name: "", role: "", access_token: "" } }),
    }),
    {
      name: "user",
    }
  )
);

export default useAuthStore;
