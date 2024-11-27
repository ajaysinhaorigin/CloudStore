"use client";
import { avatarPlaceholderUrl, navItems } from "@/constants";
import { cn } from "@/lib/utils";
import { Files2, LogoBrand } from "@/public/assets";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  fullName: string;
  avatar: string;
  email: string;
}

const Sidebar = ({ fullName, avatar, email }: Props) => {
  const pathname = usePathname();
  return (
    <aside className="sidebar">
      <Link href="/">
        <div className="hidden h-auto lg:flex items-center space-x-3">
          <Image
            src={LogoBrand}
            alt="logo"
            width={52}
            height={52}
            className="h-auto"
          />
          <h1 className="text-[25px] leading-[30px] font-medium text-brand">
            CloudStore
          </h1>
        </div>
        <Image
          src={LogoBrand}
          alt="logo"
          width={52}
          height={52}
          className="lg:hidden"
        />
      </Link>

      <nav className="sidebar-nav">
        <ul className="flex flex-1 flex-col gap-6">
          {navItems.map(({ url, name, icon }, index) => (
            <Link key={index} href={url} className="lg:w-full">
              <li
                className={cn(
                  "sidebar-nav-item",
                  pathname === url && "shad-active"
                )}
              >
                <Image
                  src={icon}
                  alt={name}
                  width={24}
                  height={24}
                  className={cn(
                    "nav-icon",
                    pathname === url && "nav-icon-active"
                  )}
                />
                <span className="hidden lg:block">{name}</span>
              </li>
            </Link>
          ))}
        </ul>
      </nav>
      <Image
        src={Files2}
        alt="Files"
        width={506}
        height={418}
        className="w-full"
      />
      <div className="sidebar-user-info">
        <Image
          src={avatarPlaceholderUrl}
          alt="avatar"
          width={44}
          height={44}
          className="sidebar-user-avatar"
        />
        <div className="hidden lg:block">
          <p className="subtitle-2 capitalize">{fullName || "John Doe"}</p>
          <p className="caption">{email || "V8k4a@example.com"}</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;