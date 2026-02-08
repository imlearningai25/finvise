
import React, { useState, useRef, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ChatInterface } from './components/ChatInterface';
import { ChatMessage, InvestmentAccount } from './types';
import { geminiService } from './services/geminiService';

const ACCOUNT_TEMPLATES: InvestmentAccount[] = [
  { id: 'roth', name: 'Roth IRA', description: 'Tax-free growth & withdrawals in retirement.', icon: 'fa-sun', color: 'bg-orange-500' },
  { id: '401k', name: '401(k)', description: 'Employer-sponsored plan with potential match.', icon: 'fa-building-columns', color: 'bg-blue-600' },
  { id: 'brokerage', name: 'Brokerage', description: 'No contribution limits, flexible withdrawals.', icon: 'fa-chart-line', color: 'bg-emerald-600' },
  { id: 'hsa', name: 'HSA', description: 'Triple-tax advantaged for healthcare costs.', icon: 'fa-heart-pulse', color: 'bg-rose-500' },
  { id: '529', name: '529 College Plan', description: 'Tax-advantaged savings for education expenses.', icon: 'fa-graduation-cap', color: 'bg-indigo-500' },
  { id: 'stocks', name: 'Stocks & Options', description: 'Equities, derivatives, and trading strategies.', icon: 'fa-arrow-trend-up', color: 'bg-violet-600' },
];

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: "Hello! I'm FinVise AI. I can help you understand the nuances of various investment accounts and trading strategies. Which one would you like to explore today?",
      timestamp: new Date()
    }
  ]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleSendMessage = async (text: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    const assistantMessageId = (Date.now() + 1).toString();
    const assistantMessage: ChatMessage = {
      id: assistantMessageId,
      role: 'model',
      text: '',
      timestamp: new Date(),
      isStreaming: true,
    };

    setMessages(prev => [...prev, assistantMessage]);

    try {
      let fullText = '';
      let allSources: any[] = [];
      
      const stream = geminiService.sendMessageStream(text);
      for await (const chunk of stream) {
        fullText += chunk.text;
        if (chunk.sources) {
          allSources = [...allSources, ...chunk.sources];
        }
        
        setMessages(prev => prev.map(msg => 
          msg.id === assistantMessageId 
            ? { ...msg, text: fullText, sources: allSources.length > 0 ? allSources : undefined }
            : msg
        ));
      }
      
      setMessages(prev => prev.map(msg => 
        msg.id === assistantMessageId ? { ...msg, isStreaming: false } : msg
      ));
    } catch (error) {
      setMessages(prev => prev.map(msg => 
        msg.id === assistantMessageId 
          ? { ...msg, text: "I'm sorry, I encountered an error processing your request. Please try again.", isStreaming: false }
          : msg
      ));
    }
  };

  const handleQuickAction = (accountName: string) => {
    let query = `Tell me about ${accountName} accounts and their 2024/2025 limits.`;
    if (accountName === 'Stocks & Options') {
      query = "Give me a thorough explanation of different types of stocks (common vs preferred), options (calls/puts), spreads (bull/bear/vertical), and order limits/stops.";
    }
    handleSendMessage(query);
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        templates={ACCOUNT_TEMPLATES} 
        onSelectTemplate={handleQuickAction}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        <main className="flex-1 overflow-hidden relative flex flex-col">
          <ChatInterface 
            messages={messages} 
            onSendMessage={handleSendMessage} 
            quickActions={ACCOUNT_TEMPLATES}
            onQuickAction={handleQuickAction}
          />
        </main>
      </div>
    </div>
  );
};

export default App;
