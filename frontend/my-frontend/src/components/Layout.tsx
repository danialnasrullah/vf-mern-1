import React from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
  showNavbar?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  className = "", 
  showNavbar = true 
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      {showNavbar && <Navbar />}
      
      {/* Main Content */}
      <main className={`${className}`}>
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">M</span>
                </div>
                <span className="text-xl font-bold text-gray-900">MERN App</span>
              </div>
              <p className="text-gray-600 text-sm">
                Your gateway to learning and exploring bootcamps. Discover amazing opportunities and connect with the best programs.
              </p>
            </div>
            
            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/" className="text-gray-600 hover:text-blue-600 text-sm transition-colors duration-200">
                    Home
                  </a>
                </li>
                <li>
                  <a href="/bootcamps" className="text-gray-600 hover:text-blue-600 text-sm transition-colors duration-200">
                    Bootcamps
                  </a>
                </li>
                <li>
                  <a href="/login" className="text-gray-600 hover:text-blue-600 text-sm transition-colors duration-200">
                    Sign In
                  </a>
                </li>
              </ul>
            </div>
            
            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Contact</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>Email: contact@mernapp.com</p>
                <p>Phone: (555) 123-4567</p>
                <p>Address: 123 Learning St, Tech City</p>
              </div>
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm">
              © 2024 MERN App. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-600 hover:text-blue-600 text-sm transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600 text-sm transition-colors duration-200">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 