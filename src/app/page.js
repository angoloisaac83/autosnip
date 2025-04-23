"use client"
import MemeCoins from "@/components/memes";
import Image from "next/image";
import { useState } from "react";
import { IoWallet } from "react-icons/io5";
import WalletModal from '@/components/connectModal';

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
      <section className="w-[full] pt-[1350px] max-[500px]:text-center max-[500px]:pt-[2450px] h-fit text-white flex flex-col items-center justify-center">
        <div className="w-full max-[500px]:w-[350px] h-fit flex flex-col gap-[20px] items-center justify-start">
          <h1 className="text-[40px] max-[500px]:text-[30px]">
            Snipe & Sell Solana Tokens at <i className="text-[#00cc33] font-bold">Hyperspeed!</i> 
          </h1>
          <ul className="flex flex-wrap text-[12px] items-center justify-center gap-[40px]">
             <li className="flex items-center justify-center gap-[10px]">
                 <Image
                    src="/memecoins_icon.B2QarAeS.avif" 
                    alt="Logo"
                    className="w-[18px]"
                    width={150}
                    height={30}
                />
              ALL SOLANA MEMECOINS</li>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 25" width="18" height="18" class="starIcon__fillHack hidden md:block"><path fill="#fff" fill-rule="evenodd" d="m12.8 13.38 11.2-.8-11.2-.8L12 .7l-.8 11.08-11.2.8 11.2.8.8 11.07z" clip-rule="evenodd"></path></svg>
            <li className="flex items-center justify-center gap-[10px]">
                 <Image
                    src="/deposit_icon.76izqal4.avif" 
                    alt="Logo"
                    className="w-[18px]"
                    width={150}
                    height={30}
                />
            DEPOSIT FROM ALL CHAINS</li>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 25" width="18" height="18" class="starIcon__fillHack hidden md:block"><path fill="#fff" fill-rule="evenodd" d="m12.8 13.38 11.2-.8-11.2-.8L12 .7l-.8 11.08-11.2.8 11.2.8.8 11.07z" clip-rule="evenodd"></path></svg>
            <li className="flex items-center justify-center gap-[10px]">
                 <Image
                    src="/rug_detection_icon.BXcUJ9kG.avif" 
                    alt="Logo"
                    className="w-[18px]"
                    width={150}
                    height={30}
                />
            DETECT RUGS AUTOMATICALLY</li>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 25" width="18" height="18" class="starIcon__fillHack hidden md:block"><path fill="#fff" fill-rule="evenodd" d="m12.8 13.38 11.2-.8-11.2-.8L12 .7l-.8 11.08-11.2.8 11.2.8.8 11.07z" clip-rule="evenodd"></path></svg>
            <li className="flex items-center justify-center gap-[10px]">
                 <Image
                    src="/mev_protection_icon.0nTkU8lo.avif" 
                    alt="Logo"
                    className="w-[18px]"
                    width={150}
                    height={30}
                />
            MEV PROTECTED TRADING</li>
          </ul>
          <p className="text-[20px] max-[500px]:text-[15px] text-[grey]">Connect your wallet and start sniping memes now</p>
          <button onClick={openWalletModal}
 className="flex items-center bg-[#00cc33] w-[314px] h-[56px] rounded-lg font-semibold text-black text-[19px] justify-center gap-[10px]"><IoWallet />Connect & Snipe</button>
          <p className="text-[13px] text-[grey]">By continuing, you agree to our <span className="text-[white]">Privacy policy</span> and <span className="text-[white]">Terms of Use</span></p>
        </div>
        <section className="w-full h-fit pb-[50px] flex  max-[500px]:flex-col items-center max-[500px]:gap-[20px] justify-between pt-[60px]">
          <div className="flex w-[300px] gap-[10px] bg-[#00cc33] p-[13px] rounded-md font-semibold">
            <span className="flex flex-col gap-[10px] items-start justify-center">
              <p>
                Meme Vision
              </p>
              <p className="text-[12px] text-[grey]">Find the best meme tokens and track latest migrations</p>
              <button className="w-full h-fit py-[5px] text-black shadow-xl">Try Meme Vision</button>
            </span>
            <Image
                    src="/memevision.png" 
                    alt="Logo"
                    className="w-[120px]"
                    width={150}
                    height={30}
                />
          </div>
          <div className="flex w-[300px] gap-[10px] bg-[#00cc33] p-[13px] rounded-md font-semibold">
            <span className="flex flex-col gap-[10px] items-start justify-center">
              <p>
               Traders Lens
              </p>
              <p className="text-[12px] text-[grey]">Find the best meme tokens and track latest migrations</p>
              <button className="w-full h-fit py-[5px] text-black shadow-xl">Try Meme Vision</button>
            </span>
            <Image
                    src="/memevision.png" 
                    alt="Logo"
                    className="w-[120px]"
                    width={150}
                    height={30}
                />
          </div>
          <div className="flex w-[300px] gap-[10px] bg-[#00cc33] p-[13px] rounded-md font-semibold">
            <span className="flex flex-col gap-[10px] items-start justify-center">
              <p>
                Earn 40% on fees
              </p>
              <p className="text-[12px] text-[grey]">Refer your friends now! They get 10% discount on fees</p>
              <button className="w-full h-fit py-[5px] text-black shadow-xl">Try Meme Vision</button>
            </span>
            <Image
                    src="/memevision.png" 
                    alt="Logo"
                    className="w-[120px]"
                    width={150}
                    height={30}
                />
          </div>
        </section>
        <MemeCoins />
        <section className="text-black">
        <WalletModal isOpen={isWalletModalOpen} onClose={closeWalletModal} />

        </section>

      </section>
    </>
  );
}
