"use client";

import Image from "next/image";
import { Button } from "./ui/button";
import { Logout } from "@/public/assets";
import Search from "./Search";
import FileUploader from "./FileUploader";
import { signOutUser } from "@/lib/actions/user.actions";
import { useProfileContext } from "@/context/ProfileContext";

interface Props {
  userId: string;
  accountId: string;
}

const Header = () => {
  const {
    profile: { fullName, avatar, email, $id: userId },
  } = useProfileContext();
  console.log("profile", fullName, avatar, email);

  return (
    <header className="header">
      <Search />
      <div className="header-wrapper">
        <FileUploader ownerId={userId} accountId={"123"} />
        <form
          // action={async () => {
          //   "use server";

          //   await signOutUser();
          // }}
        >
          <Button type="submit" className="sign-out-button">
            <Image
              src={Logout}
              alt="sign out"
              width={24}
              height={24}
              className="w-6"
            />
          </Button>
        </form>
      </div>
    </header>
  );
};

export default Header;
