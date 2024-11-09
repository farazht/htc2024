"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const PagesData = [
  {
    name: "Home",
    link: "/",
  },
  {
    name: "Policies",
    link: "/policies",
  },
  {
    name: "Forums",
    link: "/forums",
  },
  {
    name: "Profile",
    link: "/profile",
  },
  {
    name: "Representitives",
    link: "/representitives",
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
                className={`${
                  page.link === pathname || pathname.includes(page.link + "/")
                    ? "text-black"
                    : ""
                }  hover:text-black hover:scale-105 transition-all duration-300 p-2 lg:pr-2 md:pr-5 font-medium`}
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
  const [dropdowns, setDropdowns] = useState<{ [key: string]: boolean }>({});
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

  const toggleDropdown = (page: string) => {
    setDropdowns((prev) => ({
      ...prev,
      [page]: !prev[page],
    }));
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
          className="fill-black transition-all duration-300"
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
        <div className="fixed inset-0 bg-white bg-opacity-50 z-50 ">
          <div
            ref={sidebarRef}
            className={`overflow-y-auto no-scrollbar overflow-x-hidden fixed top-0 right-0 py-14 bg-white md:w-80 sm:w-64 w-64 h-full shadow-md z-50 shadow-black ${
              isSliding ? "slide-out" : "slide-in"
            }`}
          >
            <button className="w-full mb-5" onClick={toggleSidebar}>
              <Link href={"/"}>
                <div className="flex flex-col gap-3 items-center transition-colors duration-300">
                  <div className="flex flex-col justify-center items-center">
                    <span className="text-4xl ">Billboard</span>
                  </div>
                </div>
              </Link>{" "}
            </button>

            <div className="flex flex-col">
              {PagesData.map((page) => {
                const isOpen = dropdowns[page.name];
                return (
                  <div key={page.name} className="group relative text-lg">
                    <div className="flex flex-row justify-between">
                      <button
                        className="flex-1 min-w-40"
                        onClick={toggleSidebar}
                      >
                        <Link href={page.link}>
                          <div
                            className={`${
                              page.link === pathname ||
                              pathname.includes(page.link + "/")
                                ? "text-black"
                                : ""
                            }  hover:text-black text-start hover:scale-105 transition-all duration-300 p-5 pl-14 py-3 font-medium`}
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
    <div className="bg-white w-full fixed border-b-2 border-black z-40">
      <div className="p-5 px-10 m-auto max-w-7xl flex flex-row text-black justify-between">
        <div className="lg:hidden md:hidden sm:flex flex"></div>
        <Link href={"/"}>
          <div className="flex flex-row gap-3 items-center flex-end">
            <div className="flex flex-col justify-center items-center">
              <span className="text-xl font-bold self-center">BillBoard</span>
            </div>
          </div>
        </Link>{" "}
        <NavbarLinksDesktop />
        <NavbarLinksPhone />
      </div>
    </div>
  );
};
