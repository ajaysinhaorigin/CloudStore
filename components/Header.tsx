"use client";

import Image from "next/image";
import { Button } from "./ui/button";
import { Logout } from "@/public/assets";
import Search from "./Search";
import FileUploader from "./FileUploader";
import { useProfileContext } from "@/context/ProfileContext";
import { createHttpClient } from "@/tools/httpClient";
import { apiUrls } from "@/tools/apiUrls";
import { localStorageService } from "@/services/LocalStorage.service";
import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();
  const {
    profile: { fullName, avatar, email, $id: userId },
  } = useProfileContext();
  console.log("Header --fullName", fullName);

  const onLogout = async () => {
    const httpClient = createHttpClient();

    try {
      const response = await httpClient.post(apiUrls.logout, {});
      if (response && response.status === 200) {
        localStorageService.clearLocalStorage();

        router.push("/sign-in");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <header className="header">
      <Search />
      <div className="header-wrapper">
        <FileUploader ownerId={userId} accountId={"123"} />
        <Button type="submit" className="sign-out-button" onClick={onLogout}>
          <Image
            src={Logout}
            alt="sign out"
            width={24}
            height={24}
            className="w-6"
          />
        </Button>
      </div>
    </header>
  );
};

export default Header;
