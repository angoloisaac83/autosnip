"use client"
import React, { useState } from "react";
import Image from "next/image";
import { GiHamburgerMenu } from "react-icons/gi";
import { BiLogoTelegram } from "react-icons/bi";
import { CiSearch } from "react-icons/ci";
import { FaXTwitter } from "react-icons/fa6";
import WalletModal from '@/components/connectModal';
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
    const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

    const openWalletModal = () => {
      setIsWalletModalOpen(true);
    };
  
    const closeWalletModal = () => {
      setIsWalletModalOpen(false);
    };
  
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
                <div class="mx-auto w-[350px] max-w-md relative"><input type="text" placeholder="Search token name or address" class="bg-transparent focus:bg-secondaryDark focus:!bg-opacity-40 rounded-lg p-2 text-xs w-full pl-9 border border-grey3 leading-none focus:outline-none focus:border-primary focus:border-opacity-50 peer transition-colors h-8 hover:bg-secondaryDark hover:bg-opacity-70" /> <button class="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center text-xs text-grey3 rounded-xl leading-none peer-empty:block p-1" disabled="">⌘ + K</button> <button class="absolute left-1 p-2 top-1/2 -translate-y-1/2 peer-focus:stroke-grey2"><svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#CCC" viewBox="0 0 20 20" height="16px" width="16px" class="stroke-grey2"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.667" d="M9.167 15.833a6.667 6.667 0 1 0 0-13.333 6.667 6.667 0 0 0 0 13.333M17.5 17.5l-3.625-3.625"></path></svg></button> </div>                
            </span>
            <span className="flex w-fit justify-center items-center gap-[20px] text-[20px]">
                <BiLogoTelegram className="max-[500px]:hidden" />
                <FaXTwitter className="max-[500px]:hidden" />
                {
                  localStorage.getItem("walletid") === '' ? (
                    <button 
                      onClick={openWalletModal} 
                      className="flex items-center bg-[#00cc33] py-[5px] px-[15px] rounded-md font-semibold text-black text-[14px] gap-[10px]"
                    >
                      Connect <span className="max-[500px]:hidden">& Snipe</span>
                    </button>
                  ) : (<span className="text-[15px] bg-[#373737] py-[5px] px-[8px] rounded-md">00x0xvvx0x0s0z0c0c</span>)
                }
                
            </span>
            </nav>
            <SideBar open={sideOpen} />
            <WalletModal isOpen={isWalletModalOpen} onClose={closeWalletModal} />

        </>
    )
}

export default Navbar