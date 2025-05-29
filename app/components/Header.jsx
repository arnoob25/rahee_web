import { Globe, User } from "lucide-react";
import Image from "next/image";

export default function Header() {
  return (
    <header className="flex max-w-default items-center justify-between py-5">
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
          <span>Log in</span>
        </div>
      </div>
    </header>
  );
}
