import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="container mx-auto px-4 py-6">
        <p className="text-center text-gray-400 text-sm">&copy; {new Date().getFullYear()} h-equity reads. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;