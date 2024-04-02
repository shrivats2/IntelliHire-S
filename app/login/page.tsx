import { Metadata } from "next";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { UserAuthForm } from "./_components/use-auth-form";
import { ChevronLeft, Command } from "lucide-react";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
};

export default function LoginPage() {
  return (
    <>
      {/* <div className="main">
        <div className="gradient"></div>
      </div> */}
      <div className="apply-grid dark:dar-grid">
        <div className="container flex h-screen w-screen flex-col items-center justify-center">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px] rounded-lg p-8 backdrop-blur-[3px] shadow-[0_0px_10px_5px_rgb(35,189,101,30%)]">
            <div className="flex flex-col space-y-2 text-center">
              <Command className="mx-auto h-6 w-6" />
              <h1 className="text-2xl font-semibold tracking-tight">
                Welcome back
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your email to sign in to your account
              </p>
            </div>
            <UserAuthForm />
            <p className="px-8 text-center text-sm text-muted-foreground">
              <Link
                href="/signup"
                className="hover:text-brand underline underline-offset-4"
              >
                Don&apos;t have an account? Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
