
import React from 'react';
import { InvestmentAccount } from '../types';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  templates: InvestmentAccount[];
  onSelectTemplate: (name: string) => void;
}

const FINANCIAL_FACTS = [
  "Compound interest is often called the 'eighth wonder of the world'.",
  "The average historical stock market return is about 10% annually.",
  "Roth IRA contributions can be withdrawn anytime tax-free.",
  "401(k) limits for 2024 increased to $23,000.",
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen, templates, onSelectTemplate }) => {
  return (
    <aside className={`
      ${isOpen ? 'w-80' : 'w-0'} 
      transition-all duration-300 ease-in-out bg-slate-950 border-r border-slate-800 
      flex flex-col h-full overflow-hidden shrink-0 text-white
    `}>
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <i className="fa-solid fa-vault text-xl"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">FinVise AI</h1>
            <p className="text-xs text-slate-400 font-medium">Smart Wealth Advisor</p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">Account Guides</h2>
          <div className="space-y-1">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => onSelectTemplate(template.name)}
                className="w-full group flex items-center p-3 rounded-lg hover:bg-slate-900 transition-colors text-left"
              >
                <div className={`w-8 h-8 ${template.color} rounded-lg flex items-center justify-center text-white mr-3 shrink-0`}>
                  <i className={`fa-solid ${template.icon} text-sm`}></i>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-200 group-hover:text-white truncate transition-colors">{template.name}</p>
                  <p className="text-xs text-slate-500 truncate">{template.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">Resources</h2>
          <ul className="space-y-2">
            <li>
              <a href="#" className="flex items-center text-sm text-slate-400 hover:text-indigo-400 px-2 py-1 transition-colors">
                <i className="fa-solid fa-book-open w-5 text-slate-500"></i>
                Tax Planning 101
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center text-sm text-slate-400 hover:text-indigo-400 px-2 py-1 transition-colors">
                <i className="fa-solid fa-calculator w-5 text-slate-500"></i>
                Compound Interest Tool
              </a>
            </li>
          </ul>
        </div>

        <div className="mb-8">
          <h2 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-4 px-2 flex items-center gap-2">
            <i className="fa-solid fa-lightbulb text-[10px]"></i>
            Did you know?
          </h2>
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
            <p className="text-xs text-slate-300 leading-relaxed italic">
              "{FINANCIAL_FACTS[Math.floor(Math.random() * FINANCIAL_FACTS.length)]}"
            </p>
          </div>
        </div>
      </div>

      <div className="mt-auto p-6 border-t border-slate-900">
        <div className="bg-slate-900 rounded-xl p-4">
          <p className="text-xs text-slate-400 italic mb-1">Disclaimer</p>
          <p className="text-[10px] text-slate-500 leading-relaxed">
            AI generated advice is for educational purposes. Consult a certified financial planner for personalized strategy.
          </p>
        </div>
      </div>
    </aside>
  );
};
