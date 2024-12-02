import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { ProfileProvider } from "@/context/ProfileContext";
import { Toaster } from "@/components/ui/toaster";
import Sidebar from "@/components/Sidebar";
import MobileNavigation from "@/components/MobileNavigation";
import Header from "@/components/Header";

export const dynamic = "force-dynamic";

const Layout = async ({ children }: { children: ReactNode }) => {
//   const accessToken = (await cookies()).get("accessToken") as any;
//   if (!accessToken && !accessToken?.value) return redirect("/sign-in");
  return (
    <ProfileProvider>
      <main className="flex h-screen">
        Hello world
        <Sidebar />
        {/* <section className="flex h-full flex-1 flex-col">
      <MobileNavigation {...currentUser} />
      <Header userId={currentUser.$id} accountId={currentUser.accountId} />
      <div className="main-content">{children}</div>
      </section>
      <Toaster /> */}
      </main>
    </ProfileProvider>
  );
};

export default Layout;
