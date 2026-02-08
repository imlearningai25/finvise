
import React from 'react';

interface HeaderProps {
  toggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center space-x-4">
        <button 
          onClick={toggleSidebar}
          className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
        >
          <i className="fa-solid fa-bars-staggered text-lg"></i>
        </button>
        <div className="hidden md:flex items-center space-x-2">
          <span className="text-sm font-medium text-slate-400">Dashboard</span>
          <i className="fa-solid fa-chevron-right text-[10px] text-slate-300"></i>
          <span className="text-sm font-semibold text-slate-800">Investment Advisor</span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full">
          <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-pulse mr-2"></div>
          <span className="text-xs font-bold uppercase tracking-tight">AI Active</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center border border-white shadow-sm overflow-hidden">
          <img src="https://picsum.photos/32/32" alt="Avatar" />
        </div>
      </div>
    </header>
  );
};
