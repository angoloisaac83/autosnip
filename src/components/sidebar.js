"use client";
import React from "react";
import { FaRocket } from "react-icons/fa";
import { BsGearFill } from "react-icons/bs";
import { IoWallet } from "react-icons/io5";
import Link from "next/link";

function SideBar({ open }) {
  return (
    <div
      className={`bg-[#080808] text-[#cccccc] fixed bottom-0 left-0 h-[90vh] w-20 sm:w-[80px] transition-transform duration-300 ease-in-out ${
        open ? "translate-x-0" : "-translate-x-full"
      } sm:translate-x-0 flex flex-col items-center py-6 z-50`}
    >
      <ul className="flex flex-col items-center justify-between gap-6 w-full h-full">
        <Link href="/trending">
          <li className="flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-lg hover:text-[#00cc33] hover:bg-[rgba(0,0,0,0.34)] cursor-pointer transition-colors font-semibold text-xs sm:text-[10px]">
            <FaRocket className="text-lg sm:text-xl mb-1" />
            <p>Trending</p>
          </li>
        </Link>
        <Link href="/newpairs">
          <li className="flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-lg hover:text-[#00cc33] hover:bg-[rgba(0,0,0,0.34)] cursor-pointer transition-colors font-semibold text-xs sm:text-[10px]">
            <BsGearFill className="text-lg sm:text-xl mb-1" />
            <p>New Pairs</p>
          </li>
        </Link>
        <Link href="/wallet">
          <li className="flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-lg hover:text-[#00cc33] hover:bg-[rgba(0,0,0,0.34)] cursor-pointer transition-colors font-semibold text-xs sm:text-[10px]">
            <IoWallet className="text-lg sm:text-xl mb-1" />
            <p>Wallet</p>
          </li>
        </Link>
        <Link href="/copytrade">
          <li className="flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-lg hover:text-[#00cc33] hover:bg-[rgba(0,0,0,0.34)] cursor-pointer transition-colors font-semibold text-xs sm:text-[10px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
              className="w-5 h-5 mb-1 stroke-current"
            >
              <path d="M6.68 6.15a1.32 1.32 0 1 0 2.65 0 1.32 1.32 0 0 0-2.65 0"></path>
              <path d="M5.98 8.78c.21-.4.51-.73.86-.95A2.1 2.1 0 0 1 8 7.48c.4 0 .8.12 1.15.35.36.22.65.55.86.95"></path>
              <path d="M16.33 16.3a1.15 1.15 0 0 1-1.15 1.15H4.85a1.15 1.15 0 0 1-1.15-1.14V3.68a1.15 1.15 0 0 1 1.15-1.15h7.46l4.02 4.02v9.76ZM5.98 11.71h8.04m-8.04 2.88h4.6"></path>
            </svg>
            <p>Copy Trade</p>
          </li>
        </Link>
      </ul>
    </div>
  );
}

export default SideBar;