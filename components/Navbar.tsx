"use client";

import { useEffect, useState } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { buttonVariants } from "./ui/button";
import { LogIn, Menu } from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import { LogoIcon } from "../app/(home)/_components/Icons";
import { ProfileDropdownMenu } from "./userProfileDropdown";
import useAuthStore from "@/store/useUserContext";

interface RouteProps {
  href: string;
  label: string;
}

const routeList: RouteProps[] = [
  {
    href: "/#features",
    label: "Features",
  },
  {
    href: "/#testimonials",
    label: "Testimonials",
  },
  {
    href: "/#pricing",
    label: "Pricing",
  },
  {
    href: "/#faq",
    label: "FAQ",
  },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const user = useAuthStore((state) => state.user);
  const isuserAuth = user.access_token !== "" ? true : false;

  return (
    <header className="sticky border-b-[1px] top-0 z-40 w-full bg-white dark:border-b-slate-700 dark:bg-background">
      <NavigationMenu className="mx-auto">
        <NavigationMenuList className="container h-14 px-4 w-screen flex justify-between ">
          <NavigationMenuItem className="font-bold flex">
            <a href="/" className="ml-2 font-bold text-xl flex">
              <LogoIcon />
              IntelliHire
            </a>
          </NavigationMenuItem>

          {/* mobile */}
          <span className="flex md:hidden">
            <ModeToggle />

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger className="px-2" asChild>
                <>
                  <Menu
                    className="flex md:hidden h-5 w-5 self-center"
                    onClick={() => setIsOpen(true)}
                  />
                  <span className="sr-only">Menu Icon</span>
                </>
                {/* </Menu> */}
              </SheetTrigger>

              <SheetContent side={"left"}>
                <SheetHeader>
                  <SheetTitle className="font-bold text-xl">
                    Shadcn/React
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col justify-center items-center gap-2 mt-4">
                  {routeList.map(({ href, label }: RouteProps) => (
                    <a
                      key={label}
                      href={href}
                      onClick={() => setIsOpen(false)}
                      className={buttonVariants({ variant: "ghost" })}
                    >
                      {label}
                    </a>
                  ))}
                  {isuserAuth == false ? (
                    <a
                      href="https://github.com/leoMirandaa/shadcn-landing-page.git"
                      target="_blank"
                      className={`w-[110px] border ${buttonVariants({
                        variant: "secondary",
                      })} bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 text-white`}
                    >
                      <LogIn className="mr-2 w-5 h-5" />
                      Sign-In
                    </a>
                  ) : (
                    <ProfileDropdownMenu setIsOpen={setIsOpen} />
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </span>

          {/* desktop */}
          <nav className="hidden md:flex gap-2">
            {routeList.map((route: RouteProps, i) => (
              <a
                href={route.href}
                key={i}
                className={`text-[17px] ${buttonVariants({
                  variant: "ghost",
                })}`}
              >
                {route.label}
              </a>
            ))}
          </nav>

          {isuserAuth == false ? (
            <div className="hidden md:flex gap-2">
              <a
                href="/login"
                className={`border ${buttonVariants({
                  variant: "secondary",
                })} bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 text-white`}
              >
                <LogIn className="mr-2 w-5 h-5" />
                Sign-In
              </a>

              <ModeToggle />
            </div>
          ) : (
            <div className="hidden lg:flex md:flex lg:gap-[10px] md:gap-[10px]">
              <ModeToggle />
              <ProfileDropdownMenu setIsOpen={setIsOpen} />
            </div>
          )}
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
};
