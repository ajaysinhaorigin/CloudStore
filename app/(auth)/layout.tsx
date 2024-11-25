import { ReactNode } from "react";
import Image from "next/image";
import { CircularLogo, Files, Logo } from "@/public/assets";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-screen">
      <section className="justify-center hidden w-1/2 items-center bg-brand p-10 lg:flex xl:w-2/5">
        <div className="flex max-h-[800px] max-w-[430px] flex-col justify-center space-y-12">
          <div className="flex items-center space-x-3">
            <Image
              src={Logo}
              alt="logo"
              width={82}
              height={82}
              className="h-auto"
            />
            <h1 className="text-[37px] leading-[56px] font-medium text-white">
              CloudStore
            </h1>
          </div>

          <div className="space-y-5 text-white">
            <h1 className="h1">Manage your files the best way</h1>
            <p className="body-1">
              This is a place where you can store all your documents
            </p>
          </div>
          <Image
            src={Files}
            alt="Files"
            width={342}
            height={342}
            className="transition-all hover:rotate-2 hover:scale-105"
          />
        </div>
      </section>

      <section className="flex flex-1 flex-col items-center bg-white p-4 py-10 lg:justify-center lg:p-10 lg:py-0">
        <div className="mb-16 lg:hidden  flex items-center space-x-3">
          <Image
            src={CircularLogo}
            alt="logo"
            width={68}
            height={68}
            className="h-auto"
          />
          <h1 className="text-[28px] leading-[42px] font-medium text-brand">
            CloudStore
          </h1>
        </div>
        {children}
      </section>
    </div>
  );
};

export default Layout;
