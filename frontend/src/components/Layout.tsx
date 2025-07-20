import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { getUserCount, setUserCount as updateUserCount } from '../utils/userCount';
import { api } from '../lib/api';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children
}) => {
  const [userCount, setUserCount] = useState<number>(getUserCount());
  
  useEffect(() => {
    // Try to fetch real count from API first
    const fetchRealCount = async () => {
      try {
        const response = await api.getUserCount();
        if (response && typeof response.count === 'number') {
          setUserCount(response.count);
          // Update localStorage with real count
          updateUserCount(response.count);
        }
      } catch (error) {
        console.log('User count API not available, using local count');
        // Fall back to localStorage count
        const localCount = getUserCount();
        setUserCount(localCount);
      }
    };
    
    fetchRealCount();
    
    // Listen for storage changes (when user registers in another tab)
    const handleStorageChange = () => {
      const newCount = getUserCount();
      setUserCount(newCount);
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Check periodically for updates
    const interval = setInterval(() => {
      fetchRealCount();
    }, 30000); // Check every 30 seconds
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);
  return (
    <div className="min-h-screen bg-orange-50">
      <Header />
      
      <div className="px-4 py-4 md:py-6 lg:py-8">
        <div className="relative max-w-screen-2xl mx-auto">
          {/* Main Content - Always centered */}
          <main className="max-w-3xl mx-auto">
            {children}
          </main>
          
          {/* Info Panel - Better spacing on larger screens */}
          <aside className="hidden xl:block absolute left-[calc(50%+400px)] 2xl:left-[calc(50%+420px)] top-0 w-72 xl:w-80">
            <div className="sticky top-20">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white rounded-full"></div>
                  </div>
                  <h2 className="text-heading-3 text-gray-900">Vores fællesskab</h2>
                </div>
                <p className="text-body-small text-gray-700 leading-relaxed mb-4">
                  Et forum skabt af og for pædagogstuderende på VIA. Her mødes vi på tværs af årgange og campusser.
                </p>
                <p className="text-body-small text-gray-700 leading-relaxed mb-4">
                  Del dine projekter, find studiegrupper, få feedback på opgaver eller bare hyg dig med dine medstuderende.
                </p>
                <p className="text-button text-primary-600 mb-4">
                  Fordi studielivet er bedre sammen 🤝
                </p>
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-body-small">
                    <span className="text-gray-600">Medlemmer</span>
                    <span className="text-body-small font-semibold text-gray-900">
                      {userCount.toLocaleString('da-DK')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};