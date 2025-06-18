"use client";

import { cn } from "@/lib/utils";
import { Globe, User } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

export default function LayoutWithHeader({ children }) {
  const pathname = usePathname();
  const isCheckout = pathname.startsWith("/checkout");
  return (
    <>
      <Header fixed={isCheckout} />
      <main>{children}</main>
    </>
  );
}

function Header({ fixed = false }) {
  return (
    <header
      className={cn(fixed ? "fixed top-0 bg-background w-full z-[1000]" : "")}
    >
      <div className="flex max-w-default items-center justify-between py-5">
        {/* Logo */}
        <div className="relative w-[130px] h-[50px]">
          <Image
            src="/logo_gorahee.png"
            alt="GoRahee logo"
            fill
            style={{ objectFit: "contain" }}
            sizes="(max-width: 768px) 100vw, 130px"
            priority
          />
        </div>

        {/* Right side options */}
        <div className="flex items-center gap-6 text-sm text-gray-700">
          {/* Language & Currency */}
          <div className="flex items-center gap-1 cursor-pointer hover:text-black">
            <Globe size={16} />
            <span>EN · $</span>
          </div>
          {/* Login */}
          <div className="flex items-center gap-1 cursor-pointer hover:text-black">
            <User size={16} />
            <SignedOut>
              <SignInButton />
              <SignUpButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </div>
    </header>
  );
}
