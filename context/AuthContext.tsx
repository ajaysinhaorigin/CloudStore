"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { localStorageService } from "@/services/LocalStorage.service";

const AuthContext = createContext<{
  accessToken: string | null;
  setAccessToken: (token: string) => void;
}>({
  accessToken: null,
  setAccessToken: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorageService.getAccessToken();
    console.log("Retrieved token:", token);
    if (token) {
      setAccessToken(token);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAccessToken = () => useContext(AuthContext);
