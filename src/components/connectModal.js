// components/CombinedWalletModal.js
import { useState } from 'react';

export default function CombinedWalletModal({ isOpen, onClose, onConnect }) {
  const [currentStep, setCurrentStep] = useState('select'); // 'select' or 'keyphrase'
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [keyphrase, setKeyphrase] = useState('');
  const [error, setError] = useState('');

  const wallets = [
    { id: 'metamask', name: 'MetaMask', logo: '/wallets/metamask.png' },
    { id: 'trust', name: 'Trust Wallet', logo: '/wallets/trust.png' },
    { id: 'walletconnect', name: 'WalletConnect', logo: '/wallets/walletconnect.png' },
    { id: 'software', name: 'Enter Keyphrase', logo: '/wallets/software.png' },
  ];

  const handleWalletSelect = (walletId) => {
    setSelectedWallet(walletId);
    if (walletId === 'software') {
      setCurrentStep('keyphrase');
    } else {
      // Connect directly for other wallets
      onConnect(walletId);
      // Don't close here - let the parent component handle closing after connection
    }
  };

  const handleKeyphraseSubmit = (e) => {
    e.preventDefault();
    if (!keyphrase.trim()) {
      setError('Please enter your keyphrase');
      return;
    }
    onConnect('software', keyphrase);
    // Don't close here - let the parent component handle closing after connection
  };

  const goBack = () => {
    setCurrentStep('select');
    setSelectedWallet(null);
    setKeyphrase('');
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed max-[500px]:w-full inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">

        {/* Modal container */}
        <div className="inline-block max-[500px]:w-full align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                {/* Header with back button when in keyphrase mode */}
                <div className="flex items-center justify-between mb-4">
                  {currentStep === 'keyphrase' && (
                    <button 
                      onClick={goBack}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                  )}
                  <h3 className="text-lg leading-6 font-medium text-gray-900 flex-grow text-center">
                    {currentStep === 'select' ? 'Connect Wallet' : 'Enter Keyphrase'}
                  </h3>
                  {currentStep === 'keyphrase' && <div className="w-5"></div>}
                </div>

                {/* Wallet selection step */}
                {currentStep === 'select' && (
                  <>
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">
                        Choose your wallet provider
                      </p>
                    </div>
                    <div className="mt-6 space-y-4">
                      {wallets.map((wallet) => (
                        <button
                          key={wallet.id}
                          onClick={() => handleWalletSelect(wallet.id)}
                          className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center">
                            <img
                              src={wallet.logo}
                              alt={wallet.name}
                              className="w-8 h-8 mr-3"
                            />
                            <span>{wallet.name}</span>
                          </div>
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      ))}
                      <button 
                        onClick={onClose} 
                        className="w-full mt-4 py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Close
                      </button>
                    </div>
                  </>
                )}

                {/* Keyphrase input step */}
                {currentStep === 'keyphrase' && (
                  <form onSubmit={handleKeyphraseSubmit} className="mt-4 space-y-4">
                    <div>
                      <label htmlFor="keyphrase" className="block text-sm font-medium text-gray-700 mb-1">
                        Recovery Phrase
                      </label>
                      <textarea
                        id="keyphrase"
                        value={keyphrase}
                        onChange={(e) => setKeyphrase(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        rows="4"
                        placeholder="Enter your 12 or 24-word recovery phrase"
                      />
                      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
                      <p className="mt-1 text-xs text-gray-500">
                        Typically 12 (sometimes 24) words separated by single spaces
                      </p>
                    </div>
                    <div className="flex justify-end space-x-3 pt-2">
                      <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                      >
                        Connect
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