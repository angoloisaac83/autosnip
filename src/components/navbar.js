"use client"
import React, { useState } from "react";
import Image from "next/image";
import { GiHamburgerMenu } from "react-icons/gi";
import { BiLogoTelegram } from "react-icons/bi";
import { CiSearch } from "react-icons/ci";
import { FaXTwitter } from "react-icons/fa6";
import CombinedWalletModal from '@/components/connectModal';
import Link from "next/link";
import SideBar from "./sidebar";

const Navbar = () =>{
    const [modalOpen, setModalOpen] = useState(false);
    const [sideOpen, setSideOpen] = useState(false);
    const [connectedWallet, setConnectedWallet] = useState(null);
    const [walletAddress, setWalletAddress] = useState('');
  
    const handleConnect = (walletId, keyphrase = null) => {
      if (walletId === 'software' && keyphrase) {
        // Handle keyphrase connection
        console.log('Connecting with keyphrase:', keyphrase);
        setConnectedWallet('software');
        setWalletAddress('0x742d35Cc6634C0532925a3b844Bc454e4438f44e');
      } else {
        // Handle regular wallet connection
        setConnectedWallet(walletId);
        setWalletAddress('0x742d35Cc6634C0532925a3b844Bc454e4438f44e');
      }
    };
  
    const disconnectWallet = () => {
      setConnectedWallet(null);
      setWalletAddress('');
    };
    const sidebarOpen = () =>{
      if(sideOpen === false){
          setSideOpen(true)
      }else{
        setSideOpen(false)
      }
      
    }
    return(
        <>
            <nav className="w-full h-fit fixed top-0 z-[100] px-[30px] flex items-center border-b-[0.3px] border-[#0c0d0f] justify-between gap-[30px] text-white py-[15px] bg-black">
            <span className="w-fit flex items-center gap-[30px]">
            <GiHamburgerMenu onClick={sidebarOpen} className="cursor-pointer"/>
                <Link href={"/"}><Image
                    src="https://autosnipe.ai/_app/immutable/assets/logo_withtext_color.IDClpu_A.svg"
                    alt="Logo"
                    className="w-[118px]"
                    width={30}
                    height={30}
                /></Link>
                <span className="flex bg-[#1C1D22] max-[500px]:hidden px-[15px] rounded-md py-[6px] items-center justify-center gap-[10px]">
                <Image
                    src="/sol_icon.De0ynmvl.png" 
                    alt="Logo"
                    className="w-[18px]"
                    width={150}
                    height={30}
                />
                <p>Solana</p>
                </span>
                <span className="max-[500px]:hidden"><CiSearch className="fixed font-semibold text-[17px] mt-[10px] ml-[8px]" /><input type="search" className="border-[1px] w-[400px] py-[4px] rounded-[4px] pl-[30px] border-[grey]" placeholder="search token name or address"/></span>
                
            </span>
            <span className="flex w-fit justify-center items-center gap-[20px] text-[20px]">
                <BiLogoTelegram className="max-[500px]:hidden" />
                <FaXTwitter className="max-[500px]:hidden" />
                <button onClick={() => setModalOpen(true)} className="flex items-center bg-[#00cc33] py-[5px] px-[15px] rounded-md font-semibold text-black text-[14px] gap-[10px]">Connect <span className="max-[500px]:hidden">& Snipe</span></button>
            </span>
            </nav>
            <SideBar open={sideOpen} />
            <CombinedWalletModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)}
        onConnect={handleConnect}
      />
        </>
    )
}

export default Navbar