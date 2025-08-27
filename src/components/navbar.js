"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { GiHamburgerMenu } from "react-icons/gi";
import { BiLogoTelegram } from "react-icons/bi";
import { CiSearch } from "react-icons/ci";
import { FaXTwitter } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import WalletModal from "@/components/connectModal";
import Link from "next/link";
import SideBar from "./sidebar";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const [sideOpen, setSideOpen] = useState(false);
  const [connectedWallet, setConnectedWallet] = useState(null);
  const [walletAddress, setWalletAddress] = useState("");
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [walletData, setWalletData] = useState(null);
  const [showSearchMessage, setShowSearchMessage] = useState(false);
  const pathname = usePathname();

  // Check for existing wallet connection on component mount
  useEffect(() => {
    const storedWallet = localStorage.getItem("walletData");
    if (storedWallet) {
      const parsedWallet = JSON.parse(storedWallet);
      setWalletData(parsedWallet);
      setConnectedWallet(parsedWallet.name);
      setWalletAddress(parsedWallet.address);
    }
  }, []);

  const handleWalletConnected = (wallet) => {
    setWalletData(wallet);
    setConnectedWallet(wallet.name);
    setWalletAddress(wallet.address);
    setIsWalletModalOpen(false);
  };

  const disconnectWallet = () => {
    localStorage.removeItem("walletData");
    setWalletData(null);
    setConnectedWallet(null);
    setWalletAddress("");
  };

  const toggleSidebar = () => {
    setSideOpen(!sideOpen);
  };

  const closeSidebar = () => {
    setSideOpen(false);
  };

  const openWalletModal = () => {
    setIsWalletModalOpen(true);
  };

  const closeWalletModal = () => {
    setIsWalletModalOpen(false);
  };

  const shortenAddress = (address) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const handleSearchInput = (e) => {
    setShowSearchMessage(e.target.value.length > 0);
  };

  return (
    <nav className="w-full fixed top-0 z-[110] flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 bg-black border-b border-[#0c0d0f] text-white">
      <div className="flex items-center gap-4 sm:gap-6">
        <button onClick={toggleSidebar} className="text-xl sm:text-2xl">
          {sideOpen ? <IoClose /> : <GiHamburgerMenu />}
        </button>
        <Link className="flex items-center gap-2" href="/">
          <Image
            src="/Asnipenew.png"
            alt="Autosnipe Logo"
            className="w-8 h-8"
            width={32}
            height={32}
          />
          <h1 className="text-[#00cc33] text-lg sm:text-xl font-semibold">
            <span className="font-bold">A</span>snipe
          </h1>
        </Link>
        <span className="hidden sm:flex items-center gap-2 bg-[#1C1D22] px-3 py-1.5 rounded-md">
          <Image
            src="/sol_icon.De0ynmvl.png"
            alt="Solana"
            className="w-5 h-5"
            width={20}
            height={20}
          />
          <p className="text-sm">Solana</p>
        </span>
      </div>
      <div className="hidden md:flex flex-1 max-w-md mx-4 relative flex-col gap-2">
        <div className="relative">
          <input
            type="text"
            placeholder="Search token name or address"
            className="w-full h-9 bg-transparent border border-gray-600 rounded-lg pl-9 pr-12 py-2 text-sm focus:outline-none focus:border-[#00cc33] focus:bg-[#1C1D22] hover:bg-[#1C1D22] transition-colors"
            onChange={handleSearchInput}
          />
          <CiSearch className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400"
            disabled
          >
            ⌘ + K
          </button>
        </div>
        {showSearchMessage && (
          <div className="text-sm text-red-400 bg-[#0c0d0f] rounded-md px-3 py-2 w-full text-center">
            Please ensure you have at least 3 GBOLA to use the search feature.
          </div>
        )}
      </div>
      <div className="flex items-center gap-4 sm:gap-6">
        <BiLogoTelegram className="hidden sm:block text-xl hover:text-[#00cc33] cursor-pointer transition-colors" />
        <FaXTwitter className="hidden sm:block text-xl hover:text-[#00cc33] cursor-pointer transition-colors" />
        {connectedWallet ? (
          <button
            onClick={disconnectWallet}
            className="bg-green-600 hover:bg-red-800 text-sm px-3 py-1.5 rounded-md transition-colors"
          >
            Connected: {shortenAddress(walletAddress)}
          </button>
        ) : (
          <button
            onClick={openWalletModal}
            className="flex items-center gap-2 bg-[#00cc33] hover:bg-[#00bb33] text-black text-sm sm:text-base font-semibold px-4 py-2 rounded-md transition-colors"
          >
            Connect <span className="hidden sm:inline">& Snipe</span>
          </button>
        )}
      </div>
      <SideBar open={sideOpen} onClose={closeSidebar} currentPath={pathname} />
      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={closeWalletModal}
        onWalletConnected={handleWalletConnected}
      />
    </nav>
  );
};

export default Navbar;