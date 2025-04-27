"use client"
import Image from "next/image";
import { useState } from "react";
import { IoWallet } from "react-icons/io5";
import WalletModal from '@/components/connectModal';
import GetStarted from "@/components/getstarted";
import TokenList from "@/components/tokenList";
import MemeCoins from "@/app/memes";
import dynamic from 'next/dynamic';

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
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
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  const openWalletModal = () => {
    setIsWalletModalOpen(true);
  };

  const closeWalletModal = () => {
    setIsWalletModalOpen(false);
  };

  return (
    <>
      <section className="w-[full] pt-[1780px] max-[500px]:text-center max-[500px]:pt-[3150px] h-fit text-white flex flex-col items-center justify-center bg-gradient-to-r from-[#012109] via-black to-black ">
        <div className="w-full max-[500px]:w-[350px] pt-10 h-fit flex flex-col gap-[20px] items-center justify-start">
          <h1 className="text-[40px] max-[500px]:text-[30px]">
            Snipe & Sell Solana Tokens at <i className="text-[#00cc33] font-bold">Hyperspeed!</i> 
          </h1>
          <ul className="flex flex-wrap text-[12px] items-start justify-center gap-[20px]">
             <li className="flex flex-row-reverse items-center justify-center gap-[24px]">
              <h2 className="w-20 sm:w-full">ALL SOLANA MEMECOINS</h2>
              <Image
                    src="/memecoins_icon.B2QarAeS.avif" 
                    alt="Logo"
                    className="w-[24px]"
                    width={150}
                    height={30}
                />
                
              </li>
              
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 25" width="18" height="18" class="starIcon__fillHack hidden md:block"><path fill="#fff" fill-rule="evenodd" d="m12.8 13.38 11.2-.8-11.2-.8L12 .7l-.8 11.08-11.2.8 11.2.8.8 11.07z" clip-rule="evenodd"></path></svg>
            <li className="flex flex-row-reverse items-center justify-center gap-[10px]">
                <h2 className="w-24 text-start">DEPOSIT FROM ALL CHAINS</h2>
                <Image
                    src="/deposit_icon.76izqal4.avif" 
                    alt="Logo"
                    className="w-[24px]"
                    width={150}
                    height={30}
                />
            </li>
            
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 25" width="18" height="18" class="starIcon__fillHack hidden md:block"><path fill="#fff" fill-rule="evenodd" d="m12.8 13.38 11.2-.8-11.2-.8L12 .7l-.8 11.08-11.2.8 11.2.8.8 11.07z" clip-rule="evenodd"></path></svg>
            <li className="flex flex-row-reverse items-center justify-center gap-[10px]">
                 <h2 className="w-24 sm:w-full">DETECT RUGS AUTOMATICALLY</h2>
                 <Image
                    src="/rug_detection_icon.BXcUJ9kG.avif" 
                    alt="Logo"
                    className="w-[24px]"
                    width={150}
                    height={30}
                />
            </li>
            
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 25" width="18" height="18" class="starIcon__fillHack hidden md:block"><path fill="#fff" fill-rule="evenodd" d="m12.8 13.38 11.2-.8-11.2-.8L12 .7l-.8 11.08-11.2.8 11.2.8.8 11.07z" clip-rule="evenodd"></path></svg>
            <li className="flex flex-row-reverse items-center justify-center gap-[10px]">
                 <h2 className="w-24 text-start sm:w-full">MEV PROTECTED TRADING</h2>
                 <Image
                    src="/mev_protection_icon.0nTkU8lo.avif" 
                    alt="Logo"
                    className="w-[24px]"
                    width={150}
                    height={30}
                />
            </li>
           
          </ul>
          <p className="text-[20px] max-[500px]:text-[15px] text-[grey]">Connect your wallet and start sniping memes now</p>
          <button onClick={openWalletModal} className="flex items-center cursor-pointer bg-[#00cc33] w-[314px] h-[56px] rounded-lg font-semibold text-black text-[19px] justify-center gap-[10px] hover:shadow-[0_0_8px_#ff0000,0_0_8px_#ff00ff,0_0_8px_#0000ff]"><IoWallet />Connect & Snipe</button>
          <p className="text-[13px] text-[grey]">By continuing, you agree to our <span className="text-[white]">Privacy policy</span> and <span className="text-[white]">Terms of Use</span></p>
        </div>
        <section className="w-full flex h-fit pb-[50px] flex-col justify-center gap-5 overflow-hidden sm:flex-row  items-center sm:gap-4 pt-[60px]">
        <div className="flex w-[300px] hover:border-[#00cc33] hover:border-1 cursor-pointer gap-[10px] bg-[url('/animated-backgro.png')] bg-cover bg-center p-[13px] rounded-md font-semibold">

            <span className="flex flex-col gap-[10px] items-start justify-center">
              <p>
                Meme Vision
              </p>
              <p className="text-[12px] text-[grey]">Find the best meme tokens and track latest migrations</p>
              <button className="w-28 h-fit py-[5px] mr-7 text-xs rounded-full bg-black text-[#00cc33] hover:text-white hover:bg-[#00cc33] shadow-xl">Try Meme Vision</button>
            </span>
            <Image
                    src="/memevision.png" 
                    alt="Logo"
                    className="w-[100px] object-contain"
                    width={40}
                    height={40}
                />
          </div>
          <div className="flex w-[300px] hover:border-[#00cc33] hover:border-1 gap-[10px] bg-[url('/animated-backgro.png')] bg-cover bg-center p-[13px] rounded-md font-semibold">
            <span className="flex flex-col gap-[10px] items-start justify-center">
              <p>
               Traders Lens
              </p>
              <p className="text-[12px] text-[grey]">Find the best meme tokens and track latest migrations</p>
              <button className="w-28 h-fit py-[5px] mr-7 text-xs rounded-full bg-black text-[#00cc33] hover:text-white hover:bg-[#00cc33] shadow-xl">Try Meme Vision</button>
            </span>
            <Image
                    src="/bannerman.png" 
                    alt="Logo"
                    className="w-[100px] object-contain"
                    width={40}
                    height={40}
                />
          </div>
          <div className="flex w-[300px] hover:border-[#00cc33] hover:border-1 gap-[10px] bg-[url('/animated-backgro.png')] bg-cover bg-center p-[13px] rounded-md font-semibold">
            <span className="flex flex-col gap-[10px] items-start justify-center">
              <p>
                Earn 40% on fees
              </p>
              <p className="text-[12px] text-[grey]">Refer your friends now! They get 10% discount on fees</p>
              <button  className="w-28 h-fit py-[5px] mr-7 text-xs rounded-full bg-black text-[#00cc33] hover:text-white hover:bg-[#00cc33] shadow-xl">Try Meme Vision</button>
            </span>
            <Image
                    src="/trader.png" 
                    alt="Logo"
                    className="w-[100px] object-contain"
                    width={40}
                    height={40}
                />
          </div>
        </section>
        <MemeCoins />
       {/* <div className="mt-[4rem]">
       <TokenList/>
       </div> */}
        <section className="text-black">
        <WalletModal isOpen={isWalletModalOpen} onClose={closeWalletModal} />

        </section>

        <GetStarted /> 
               <marquee className="bg-black font-mono py-3 w-[1050px] max-[500px]:w-[400px] border-t-[0.2px] border-b border-gray-600">
                <div class="  text-lg ">
          <div class="marquee-content flex gap-2 svelte-1sh8w68">
            <span class="text-[#3E356B]">EXCLUSIVE &amp; INDUSTRY 1ST FEATURES ON AUTOSNIPE</span>
            <span className="text-[#00cc33]">✦</span>
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#00cc33] to-white">AI OPTIMISED PRIORITY FEES</span>
            <span className="text-[#00cc33]">✦</span>
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#00cc33] to-white">ON-CHAIN RENT REFUND</span>
            <span className="text-[#00cc33]">✦</span>
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#00cc33] to-white">AI DETECTION OF POTENTIAL RUG PULL TOKENS</span>
            <span className="text-[#00cc33]">✦</span>
            <span class="text-[#3E356B]">EXCLUSIVE &amp; INDUSTRY 1ST FEATURES ON AUTOSNIPE</span>
          </div>
        </div>

        </marquee>
        {/* <marquee className="border-t border-b border-secondaryDark w-[1065px] max-[500px]:w-[350px]" behavior="scroll" direction="left" scrollamount="10" loop="infinite">
          <div class="text-primary w-full flex items-center justify-center font-mono py-3 text-sm marquee svelte-1sh8w68"><div class="marquee-content svelte-1sh8w68"><span class="gradient-text2">EXCLUSIVE &amp; INDUSTRY 1ST FEATURES ON AUTOSNIPE</span> <span>✦</span> <span class="gradient-text">AI OPTIMISED PRIORITY FEES</span> <span>✦</span> <span class="gradient-text">ON-CHAIN RENT REFUND</span> <span>✦</span> <span class="gradient-text">AI DETECTION OF POTENTIAL RUG PULL TOKENS</span> <span>✦</span> <span class="gradient-text2">EXCLUSIVE &amp; INDUSTRY 1ST FEATURES ON AUTOSNIPE</span> <span>✦</span> <span class="gradient-text">AI OPTIMISED PRIORITY FEES</span> <span>✦</span> <span class="gradient-text">ON-CHAIN RENT REFUND</span> <span>✦</span> <span class="gradient-text">AI DETECTION OF POTENTIAL RUG PULL TOKENS</span> <span>✦</span></div> <div class="marquee-content svelte-1sh8w68"><span class="gradient-text2">EXCLUSIVE &amp; INDUSTRY 1ST FEATURES ON AUTOSNIPE</span> <span>✦</span> <span class="gradient-text">AI OPTIMISED PRIORITY FEES</span> <span>✦</span> <span class="gradient-text">ON-CHAIN RENT REFUND</span> <span>✦</span> <span class="gradient-text">AI DETECTION OF POTENTIAL RUG PULL TOKENS</span> <span>✦</span> <span class="gradient-text2">EXCLUSIVE &amp; INDUSTRY 1ST FEATURES ON AUTOSNIPE</span> <span>✦</span> <span class="gradient-text">AI OPTIMISED PRIORITY FEES</span> <span>✦</span> <span class="gradient-text">ON-CHAIN RENT REFUND</span> <span>✦</span> <span class="gradient-text">AI DETECTION OF POTENTIAL RUG PULL TOKENS</span></div></div>
        </marquee> */}
      </section>
    </>
  );
}
