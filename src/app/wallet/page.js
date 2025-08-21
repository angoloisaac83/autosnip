"use client"
import MemeCoins from "@/components/memes";
import GetStarted from "@/components/getstarted";
import React from "react";
import { useState, useEffect } from 'react';
import { db } from '@/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const Trending = () => {
    const [wallet, setWallet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [walletId, setWalletId] = useState('');
    
    useEffect(() => {
        // Check for wallet connection in localStorage
        const storedWallet = localStorage.getItem('walletData');
        if (storedWallet) {
            try {
                const parsedWallet = JSON.parse(storedWallet);
                if (parsedWallet?.id) {
                    setWalletId(parsedWallet.id);
                    setIsConnected(true);
                }
            } catch (e) {
                console.error("Error parsing wallet data", e);
                localStorage.removeItem('walletData');
            }
        }
    }, []);

    useEffect(() => {
        if (!walletId) return;

        const fetchWalletData = async () => {
            setLoading(true);
            try {
                const docRef = doc(db, 'wallets', walletId);
                const docSnap = await getDoc(docRef);
                
                if (docSnap.exists()) {
                    setWallet(docSnap.data());
                    console.log('Wallet data:', docSnap.data());
                } else {
                    setError('Wallet not found');
                    // Clear invalid wallet data
                    localStorage.removeItem('walletData');
                    setWalletId('');
                    setIsConnected(false);
                }
            } catch (err) {
                setError('Failed to fetch wallet data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchWalletData();
    }, [walletId]);

    const handleDisconnect = () => {
        localStorage.removeItem('walletData');
        setWalletId('');
        setIsConnected(false);
        setWallet(null);
    };

    return (
        <>
            <section className="text-white max-[500px]:w-full w-[115%] max-[500px]:px-[0px]">
                {!isConnected ? (
                    <GetStarted />
                ) : (
                    <div className="min-h-screen bg-transparent text-white py-6">
                        <div className="flex flex-col p-4 font-[500] rounded-[10px] w-full gap-[6px] bgi">
                            <p className="text-[14px]">Your Trading Balance</p>
                            <span className="flex justify-center items-center w-fit gap-[4px]">
                                <img className="w-[32px] h-[32px] object-fit" src="https://autosnipe.ai/_app/immutable/assets/sol_icon.De0ynmvl.png" alt="" />
                                <h1 className="text-[24px]">0.00</h1>
                                <p>/$171.917</p>
                            </span>
                            <span className="flex bg-[#1c1d22] justify-between p-[4px] rounded-[6px] items-center">
                                <img className="w-[32px] h-[32px]" src="https://autosnipe.ai/_app/immutable/assets/wallet.BgE1Fw1Q.svg" alt="" />
                                <p className="text-[14px]">{wallet?.walletAddress || 'N/A'}</p>
                                <img className="w-[32px] h-[32px]" src="https://autosnipe.ai/_app/immutable/assets/copy_color.DsKh1txP.svg" alt="" />
                            </span>
                        </div>
                        <div class="grid grid-flow-col gap-1 sm:gap-4 overflow-auto py-6 font-medium"><button class="sm:px-4 text-sm md:text-base whitespace-nowrap rounded-xl p-2 sm:py-3 border border-transparent hover:bg-highlighterBg hover:border-white hover:border-opacity-10 active:bg-black">Deposit </button><button class="sm:px-4 text-sm md:text-base whitespace-nowrap rounded-xl p-2 sm:py-3 border border-transparent hover:bg-highlighterBg hover:border-white hover:border-opacity-10 active:bg-black">Withdraw </button><button class="sm:px-4 text-sm md:text-base whitespace-nowrap rounded-xl p-2 sm:py-3 border border-white border-opacity-10 bg-secondaryDark"><span class="gradient-text">History</span> </button></div>
                        <div className="max-w-md mx-auto bg-[#161616] rounded-xl shadow-md overflow-hidden md:max-w-2xl mt-10">
                            <div className="p-8">
                                <div className="flex justify-between items-center mb-6">
                                    <h1 className="text-2xl font-bold text-primary">Wallet Dashboard</h1>
                                    <div className="flex items-center gap-2">
                                        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${isConnected ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'}`}>
                                            {isConnected ? 'Connected' : 'Disconnected'}
                                        </div>
                                        {isConnected && (
                                            <button 
                                                onClick={handleDisconnect}
                                                className="px-3 py-1 rounded-full text-xs font-semibold bg-red-900 text-red-200 hover:bg-red-800"
                                            >
                                                Disconnect
                                            </button>
                                        )}
                                    </div>
                                </div>
                
                                {loading ? (
                                    <div className="flex justify-center items-center h-40">
                                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                                    </div>
                                ) : error ? (
                                    <div className="text-red-400 text-center py-10">{error}</div>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="bg-gray-700 p-4 rounded-lg">
                                            <h2 className="text-sm font-medium text-gray-400">Wallet Name</h2>
                                            <p className="mt-1 text-lg font-semibold">{wallet?.walletName || 'N/A'}</p>
                                        </div>
                    
                                        <div className="bg-gray-700 p-4 rounded-lg">
                                            <h2 className="text-sm font-medium text-gray-400">Wallet Address</h2>
                                            <p className="mt-1 text-lg font-mono text-primary break-all">
                                                {wallet?.walletAddress || 'N/A'}
                                            </p>
                                        </div>
                    
                                        <div className="bg-gray-700 p-4 rounded-lg">
                                            <h2 className="text-sm font-medium text-gray-400">Connected Since</h2>
                                            <p className="mt-1 text-lg">
                                                {wallet?.connectedAt ? new Date(wallet.connectedAt).toLocaleString() : 'N/A'}
                                            </p>
                                        </div>
                    
                                        <button 
                                            className={`w-full py-3 px-4 rounded-lg font-medium ${isConnected ? 'bg-primary hover:bg-primary-dark' : 'bg-gray-600 cursor-not-allowed'}`}
                                            disabled={!isConnected}
                                        >
                                            {isConnected ? 'Deposit' : 'Connect Wallet to Proceed'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </>
    )
}

export default Trending;