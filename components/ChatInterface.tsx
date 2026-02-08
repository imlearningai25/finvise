
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, InvestmentAccount } from '../types';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  quickActions: InvestmentAccount[];
  onQuickAction: (name: string) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, quickActions, onQuickAction }) => {
  const [inputValue, setInputValue] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  const formatText = (text: string) => {
    return text.split('\n').map((line, i) => (
      <span key={i}>
        {line}
        <br />
      </span>
    ));
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white md:m-4 md:rounded-2xl md:shadow-sm border border-slate-200 overflow-hidden">
      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-opacity-5"
      >
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[85%] md:max-w-[70%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start gap-3`}>
              <div className={`
                w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm
                ${message.role === 'user' ? 'bg-slate-800 text-white ml-2' : 'bg-indigo-600 text-white mr-2'}
              `}>
                <i className={`fa-solid ${message.role === 'user' ? 'fa-user' : 'fa-robot'} text-xs`}></i>
              </div>
              
              <div className="flex flex-col gap-2">
                <div className={`
                  px-5 py-4 rounded-2xl text-sm leading-relaxed shadow-sm
                  ${message.role === 'user' 
                    ? 'bg-slate-800 text-white rounded-tr-none' 
                    : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none'}
                `}>
                  {formatText(message.text)}
                  
                  {message.isStreaming && (
                    <span className="inline-flex ml-1 w-1.5 h-4 bg-indigo-500 animate-pulse align-middle"></span>
                  )}

                  {message.sources && message.sources.length > 0 && !message.isStreaming && (
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Verified Sources</p>
                      <div className="flex flex-wrap gap-2">
                        {message.sources.map((source, idx) => (
                          <a 
                            key={idx}
                            href={source.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-2 py-1 bg-slate-50 border border-slate-200 rounded text-[10px] text-indigo-600 font-medium hover:bg-indigo-50 hover:border-indigo-100 transition-colors"
                          >
                            <i className="fa-solid fa-link mr-1"></i>
                            {source.title.length > 25 ? source.title.substring(0, 25) + '...' : source.title}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 px-1 font-medium">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>
        ))}
        {messages.length === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-8">
            {quickActions.map(action => (
              <button
                key={action.id}
                onClick={() => onQuickAction(action.name)}
                className="group p-4 bg-slate-50 border border-slate-100 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-all text-left"
              >
                <div className={`w-8 h-8 ${action.color} rounded-lg flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform`}>
                   <i className={`fa-solid ${action.icon} text-sm`}></i>
                </div>
                <h3 className="text-sm font-bold text-slate-800 mb-1">Explain {action.name}</h3>
                <p className="text-xs text-slate-500 line-clamp-2">{action.description}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 md:p-6 bg-slate-50 border-t border-slate-100">
        <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto flex gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about Roth IRA limits, 401(k) matches, or 529 plans..."
              className="w-full bg-white border border-slate-200 text-slate-700 text-sm rounded-xl py-3.5 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <button type="button" className="text-slate-300 hover:text-slate-400">
                <i className="fa-solid fa-microphone text-lg"></i>
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="bg-indigo-600 text-white px-6 py-3.5 rounded-xl font-semibold text-sm hover:bg-indigo-700 disabled:bg-slate-200 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-600/20 active:scale-95 flex items-center gap-2"
          >
            <span>Send</span>
            <i className="fa-solid fa-paper-plane text-xs"></i>
          </button>
        </form>
        <div className="mt-3 text-center">
          <p className="text-[10px] text-slate-400 font-medium">
            AI powered by Gemini • Live Grounding Enabled
          </p>
        </div>
      </div>
    </div>
  );
};
