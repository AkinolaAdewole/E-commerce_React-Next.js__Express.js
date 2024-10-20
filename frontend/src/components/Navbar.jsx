"use client";
import Link from "next/link"; // Use Next.js Link for client-side navigation
import Menu from "./Menu"; // Import your Menu component
import Image from "next/image"; // Use Next.js Image for optimized images
import SearchBar from "./SearchBar"; // Import your SearchBar component
import dynamic from "next/dynamic"; // Dynamic import for components

// Dynamically load NavIcons without SSR
const NavIcons = dynamic(() => import("./NavIcons"), { ssr: false });


const Navbar = () => {
  return (
      <div>
            <div className="h-20 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative">
                {/* MOBILE */}
                <div className="h-full flex items-center justify-between md:hidden">
                  <Link href="/" className="text-2xl tracking-wide">
                    AKINOLA
                  </Link>
                  <Menu />
                </div>

                {/* BIGGER SCREENS */}
                <div className="hidden md:flex items-center justify-between gap-8 h-full">
                  {/* LEFT */}
                  <div className="flex items-center gap-12 w-1/3 xl:w-1/2">
                    <Link href="/" className="flex items-center gap-3">
                      <Image src="/logo.png" alt="Akinola Logo" width={24} height={24} />
                      <div className="text-2xl tracking-wide">AKINOLA</div>
                    </Link>
                    <div className="hidden xl:flex gap-4">
                      <Link href="/">Homepage</Link>
                      <Link href="/">Shop</Link>
                      <Link href="/">Deals</Link>
                      <Link href="/">About</Link>
                      <Link href="/">Contact</Link>
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className="flex items-center justify-between gap-8 w-2/3 xl:w-1/2">
                    <SearchBar />
                    <NavIcons />
                  </div>
                </div>
              </div>
      </div>
  );
};

export default Navbar;
