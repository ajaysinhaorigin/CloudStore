"use client";
import { apiUrls } from "@/tools/apiUrls";
import { createHttpClient } from "@/tools/httpClient";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

interface ProfileContextType {
  profile: any;
  setProfile: Dispatch<SetStateAction<any>>;
}

const ProfileContext = createContext<ProfileContextType | null>(null);

export const ProfileProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [profile, setProfile] = useState({});

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    const httpClient = createHttpClient();

    try {
      const user = await httpClient.get(apiUrls.profile);
      console.log("user", user);
      setProfile(user.data);
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <ProfileContext.Provider
      value={{
        profile,
        setProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

// Create a custom hook to access context
export function useProfileContext() {
  const context = useContext(ProfileContext);
  if (context === null) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
}
