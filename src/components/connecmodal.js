import React from 'react';

const SuccessModal = ({ isOpen, onClose, selectedWallet }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.64)] bg-opacity-50 z-[110] flex justify-center items-center">
      <div className="bg-[grey] w-[30%] p-6 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Success!</h2>
        <p className="mb-4">
          Connected successfully! Fund your wallet using this Address: 
          <strong> 000x0x0nbcb0ca0</strong> to proceed.
        </p>
        <button 
          onClick={onClose} 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;