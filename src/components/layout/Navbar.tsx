import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-slate-900 border-b border-slate-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-white font-bold text-xl">h-equity reads</Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link to="/catalog" className="text-gray-300 hover:bg-slate-800 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Catalog</Link>
              <Link to="/register" className="text-gray-300 hover:bg-slate-800 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Register</Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;