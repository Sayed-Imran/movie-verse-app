import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Film, Heart, History, Settings, LogOut } from 'lucide-react';

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'favorites', label: 'Favorites', icon: Heart },
  { id: 'watchlist', label: 'Watchlist', icon: Film },
  { id: 'history', label: 'Watch History', icon: History },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  if (!user) {
    return null;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Account Information</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-1">Username</h4>
                  <p className="text-white">{user.username}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-1">Email</h4>
                  <p className="text-white">{user.email}</p>
                </div>
                {user.full_name && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-1">Full Name</h4>
                    <p className="text-white">{user.full_name}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Account Actions</h3>
              <button
                onClick={logout}
                className="inline-flex items-center justify-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors duration-300"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Log Out
              </button>
            </div>
          </div>
        );
        
      case 'favorites':
        return (
          <div className="space-y-6">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Your Favorite Movies</h3>
              <div className="text-center py-10">
                <Heart className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">
                  You haven't added any movies to your favorites yet.
                </p>
                <p className="text-gray-500 mt-2">
                  Click the heart icon on any movie to add it to your favorites.
                </p>
              </div>
            </div>
          </div>
        );
        
      case 'watchlist':
        return (
          <div className="space-y-6">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Your Watchlist</h3>
              <div className="text-center py-10">
                <Film className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">
                  Your watchlist is empty.
                </p>
                <p className="text-gray-500 mt-2">
                  Add movies to your watchlist to keep track of what you want to watch.
                </p>
              </div>
            </div>
          </div>
        );
        
      case 'history':
        return (
          <div className="space-y-6">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Watch History</h3>
              <div className="text-center py-10">
                <History className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">
                  Your watch history is empty.
                </p>
                <p className="text-gray-500 mt-2">
                  Movies you've marked as watched will appear here.
                </p>
              </div>
            </div>
          </div>
        );
        
      case 'settings':
        return (
          <div className="space-y-6">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Account Settings</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-md font-medium mb-2">Change Password</h4>
                  <p className="text-gray-400 text-sm mb-4">
                    Update your password to keep your account secure.
                  </p>
                  <button
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors duration-300"
                    disabled
                  >
                    Change Password
                  </button>
                </div>
                
                <div>
                  <h4 className="text-md font-medium mb-2">Email Preferences</h4>
                  <p className="text-gray-400 text-sm mb-4">
                    Manage your email notifications and preferences.
                  </p>
                  <button
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors duration-300"
                    disabled
                  >
                    Update Preferences
                  </button>
                </div>
                
                <div>
                  <h4 className="text-md font-medium text-red-500 mb-2">Danger Zone</h4>
                  <p className="text-gray-400 text-sm mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors duration-300"
                    disabled
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-1/4">
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-purple-600 text-white text-xl font-bold">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <h2 className="mt-4 text-xl font-bold text-white">{user.username}</h2>
                <p className="text-gray-400 text-sm">{user.email}</p>
              </div>
              
              <div className="border-t border-gray-700 pt-4 mt-4">
                <p className="text-sm text-gray-400 mb-2">Member since</p>
                <p className="text-white">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
            
            <nav className="bg-gray-800 rounded-lg overflow-hidden">
              <ul>
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <li key={tab.id}>
                      <button
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center px-6 py-4 transition-colors duration-200 ${
                          activeTab === tab.id
                            ? 'bg-purple-600 text-white'
                            : 'text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        <Icon className="h-5 w-5 mr-3" />
                        <span>{tab.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
          
          {/* Main Content */}
          <div className="w-full md:w-3/4">
            <h1 className="text-2xl font-bold text-white mb-6">
              {tabs.find(tab => tab.id === activeTab)?.label}
            </h1>
            
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;