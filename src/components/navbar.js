"use client"
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { GiHamburgerMenu } from "react-icons/gi";
import { BiLogoTelegram } from "react-icons/bi";
import { CiSearch } from "react-icons/ci";
import { FaXTwitter } from "react-icons/fa6";
import WalletModal from '@/components/connectModal';
import Link from "next/link";
import SideBar from "./sidebar";

const Navbar = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [sideOpen, setSideOpen] = useState(false);
    const [connectedWallet, setConnectedWallet] = useState(null);
    const [walletAddress, setWalletAddress] = useState('');
    const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
    const [walletData, setWalletData] = useState(null);

    // Check for existing wallet connection on component mount
    useEffect(() => {
        const storedWallet = localStorage.getItem('walletData');
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
        localStorage.removeItem('walletData');
        setWalletData(null);
        setConnectedWallet(null);
        setWalletAddress('');
    };

    const sidebarOpen = () => {
        setSideOpen(!sideOpen);
    };

    const openWalletModal = () => {
        setIsWalletModalOpen(true);
    };

    const closeWalletModal = () => {
        setIsWalletModalOpen(false);
    };

    const shortenAddress = (address) => {
        if (!address) return '';
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    };

    return (
        <>
            <nav className="w-full h-fit fixed top-0 z-[100] px-[30px] flex items-center border-b-[0.3px] border-[#0c0d0f] justify-between gap-[30px] text-white py-[15px] bg-black">
                <span className="w-fit flex items-center gap-[30px]">
                    <GiHamburgerMenu onClick={sidebarOpen} className="cursor-pointer text-xl" />
                    <Link className="flex gap-1 items-center" href={"/"}>
                        <Image
                            src="/Asnipenew.png"
                            alt="Logo"
                            className="w-[30px]"
                            width={10}
                            height={10}
                        />
                        <h1 className="text-[#00cc33] text-lg"><span className="font-bold">A</span>snipe</h1>
                    </Link>
                    <span className="flex bg-[#1C1D22] max-[500px]:hidden px-[15px] rounded-md py-[6px] items-center justify-center gap-[10px]">
                        <Image
                            src="/sol_icon.De0ynmvl.png" 
                            alt="Solana"
                            className="w-[18px]"
                            width={150}
                            height={30}
                        />
                        <p>Solana</p>
                    </span>
                    <div className="mx-auto w-[350px] max-w-md relative max-[768px]:hidden">
                        <input 
                            type="text" 
                            placeholder="Search token name or address" 
                            className="bg-transparent focus:bg-secondaryDark focus:!bg-opacity-40 rounded-lg p-2 text-xs w-full pl-9 border border-grey3 leading-none focus:outline-none focus:border-primary focus:border-opacity-50 peer transition-colors h-8 hover:bg-secondaryDark hover:bg-opacity-70" 
                        /> 
                        <button className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center text-xs text-grey3 rounded-xl leading-none peer-empty:block p-1" disabled>
                            ⌘ + K
                        </button> 
                        <button className="absolute left-1 p-2 top-1/2 -translate-y-1/2 peer-focus:stroke-grey2">
                            <CiSearch className="text-gray-400" />
                        </button> 
                    </div>                
                </span>
                <span className="flex w-fit justify-center items-center gap-[20px] text-[20px]">
                    <BiLogoTelegram className="max-[500px]:hidden hover:text-primary cursor-pointer" />
                    <FaXTwitter className="max-[500px]:hidden hover:text-primary cursor-pointer" />
                    {connectedWallet ? (
                        <div className="flex items-center gap-2">
                            <span 
                                className="text-[15px] bg-[#373737] py-[5px] px-[8px] rounded-md hover:bg-[#474747] cursor-pointer"
                                title={walletAddress}
                            >
                                {shortenAddress(walletAddress)}
                            </span>
                            <button 
                                onClick={disconnectWallet}
                                className="text-[15px] bg-red-900 py-[5px] px-[8px] rounded-md hover:bg-red-800"
                            >
                                Disconnect
                            </button>
                        </div>
                    ) : (
                        <button 
                            onClick={openWalletModal} 
                            className="flex items-center bg-[#00cc33] py-[5px] px-[15px] rounded-md font-semibold text-black text-[14px] gap-[10px] hover:bg-[#00bb33] transition-colors"
                        >
                            Connect <span className="max-[500px]:hidden">& Snipe</span>
                        </button>
                    )}
                </span>
            </nav>
            <SideBar open={sideOpen} />
            <WalletModal 
                isOpen={isWalletModalOpen} 
                onClose={closeWalletModal}
                onWalletConnected={handleWalletConnected}
            />
        </>
    )
}

export default Navbar;