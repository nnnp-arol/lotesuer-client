import { create } from "zustand";

interface UserStore {
  user: any;
  token: string | undefined;
  setToken: (value: string) => void;
  setUser: (value: any) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: "",
  token: "",
  setToken: (value: any) =>
    set((state) => ({
      token: value,
    })),
  setUser: (value: any) =>
    set((state) => ({
      user: value,
    })),
}));
