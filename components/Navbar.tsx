"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from 'next/image'
import { usePathname } from "next/navigation";
import Logo from './Logo.png';

const PagesData = [
  {
    name: "Home",
    link: "/",
  },
  {
    name: "Policies",
    link: "/protected/policies",
  },
  {
    name: "Forums",
    link: "/protected/forums",
  },
  {
    name: "Profile",
    link: "/protected/profile",
  },
  {
    name: "Representatives",
    link: "/protected/representatives",
  },
];

const NavbarLinksDesktop = () => {
  const pathname = usePathname();

  return (
    <div className="flex-row items-center justify-between lg:gap-10 md:gap-3 lg:flex md:flex sm:hidden hidden">
      {PagesData.map((page) => {
        return (
          <div key={page.name} className="group relative">
            <Link href={page.link}>
              <div
                className={`text-foreground hover:scale-105 transition-all duration-300 p-2 lg:pr-2 md:pr-5 font-medium`}
              >
                {page.name}
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

const NavbarLinksPhone = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSliding, setIsSliding] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const toggleSidebar = () => {
    if (sidebarOpen) {
      setIsSliding(true);
      setTimeout(() => {
        setSidebarOpen(false);
        setIsSliding(false);
      }, 400);
    } else {
      setSidebarOpen(true);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      sidebarRef.current &&
      !sidebarRef.current.contains(event.target as Node)
    ) {
      toggleSidebar();
    }
  };

  useEffect(() => {
    if (sidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarOpen]);

  return (
    <div className="items-center lg:hidden md:hidden sm:flex flex">
      <button onClick={toggleSidebar}>
        <svg
          className="fill-foreground transition-all duration-300"
          width="40"
          height="40"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="100" height="100" rx="8" fill="transparent" />
          <rect x="15" y="25" width="70" height="10" rx="5" />
          <rect x="15" y="45" width="70" height="10" rx="5" />
          <rect x="15" y="65" width="70" height="10" rx="5" />
        </svg>
      </button>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-background bg-opacity-50 z-50 ">
          <div
            ref={sidebarRef}
            className={`overflow-y-auto no-scrollbar overflow-x-hidden fixed top-0 right-0 py-14 bg-background md:w-80 sm:w-64 w-64 h-full shadow-md z-50 shadow-foreground ${
              isSliding ? "slide-out" : "slide-in"
            }`}
          >
            <button className="w-full mb-5" onClick={toggleSidebar}>
              <Link href={"/"}>
                <div className="flex flex-col gap-3 items-center transition-colors duration-300">
                  <div className="flex flex-col justify-center items-center">
                    <span className="text-4xl ">BillBoard</span>
                  </div>
                </div>
              </Link>{" "}
            </button>

            <div className="flex flex-col">
              {PagesData.map((page) => {
                return (
                  <div key={page.name} className="group relative text-lg">
                    <div className="flex flex-row justify-between">
                      <button
                        className="flex-1 min-w-40"
                        onClick={toggleSidebar}
                      >
                        <Link href={page.link}>
                          <div
                            className={`text-foreground text-start hover:scale-105 transition-all duration-300 p-5 pl-14 py-3 font-medium`}
                          >
                            {page.name}
                          </div>
                        </Link>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const Navbar = () => {
  return (
    <div className="bg-background w-full fixed border-b-2 border-foreground z-40">
      <div className="p-5 px-10 m-auto max-w-7xl flex items-center justify-between text-foreground">
        <Link href="/" className="flex items-center space-x-2">
        <Image 
            src={Logo}
            width={32} 
            height={32} 
            className="w-8 h-8" 
            alt="Logo" 
          />
          <span className="text-xl font-bold">BillBoard</span>
        </Link>
        <NavbarLinksDesktop />
        <NavbarLinksPhone />
      </div>
    </div>
  )
}