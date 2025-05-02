import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Mic, LogOut } from 'lucide-react';
import useUserStore from '../stores/userStore';
import useAssistantStore from '../stores/assistantStore';

const Header: React.FC = () => {
  const location = useLocation();
  const { user, clearUser } = useUserStore();
  const { resetState } = useAssistantStore();
  
  const handleLogout = () => {
    clearUser();
    resetState();
  };
  
  const navItems = [
    {
      title: 'Dashboard',
      path: '/dashboard',
      icon: <LayoutDashboard size={18} />,
    },
    {
      title: 'Voice Assistant',
      path: '/voice',
      icon: <Mic size={18} />,
    },
  ];
  
  return (
    <header className="bg-white shadow-sm py-4">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-indigo-600">
            TaskFlow AI
          </Link>
          
          {user && (
            <div className="flex items-center space-x-6">
              <nav className="hidden sm:flex items-center space-x-1">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`
                        flex items-center px-3 py-2 rounded-md text-sm font-medium
                        ${isActive 
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }
                      `}
                    >
                      <span className="mr-1.5">{item.icon}</span>
                      {item.title}
                    </Link>
                  );
                })}
              </nav>
              
              <div className="flex items-center space-x-4">
                <div className="hidden sm:flex items-center">
                  <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                    {user.firstName.charAt(0)}
                    {user.lastName.charAt(0)}
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    {user.firstName}
                  </span>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center text-gray-600 hover:text-red-600"
                >
                  <LogOut size={18} />
                  <span className="ml-1 hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;