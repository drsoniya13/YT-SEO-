import { useState, useEffect } from 'react';
import { Sidebar, Header } from './components/Navigation';
import { Dashboard } from './pages/Dashboard';
import { VocalSynthesis } from './pages/VocalSynthesis';
import { FrequencyExtractor } from './pages/FrequencyExtractor';
import { Settings } from './pages/Settings';
import { LensAlchemy } from './pages/LensAlchemy';
import { ScriptForge } from './pages/ScriptForge';
import { ApiKeys } from './pages/ApiKeys';
import { Page } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('Dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'Dashboard':
        return <Dashboard />;
      case 'Vocal Synthesis':
        return <VocalSynthesis />;
      case 'Frequency Extractor':
        return <FrequencyExtractor />;
      case 'Script Forge':
        return <ScriptForge />;
      case 'Lens Alchemy':
        return <LensAlchemy />;
      case 'API Keys':
        return <ApiKeys />;
      case 'Settings':
        return <Settings />;
      default:
        return (
          <div className="glass-panel p-10 md:p-20 flex flex-col items-center justify-center text-center">
             <div className="text-studio-cyan text-2xl md:text-4xl font-black mb-4 uppercase tracking-[0.2em]">{currentPage}</div>
             <p className="text-slate-500 uppercase tracking-widest font-bold text-xs md:text-sm">This module is currently in development.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-studio-bg flex overflow-x-hidden">
      <Sidebar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen}
        isMobile={isMobile}
      />
      
      <motion.main 
        animate={{ 
          marginLeft: isMobile ? 0 : (isSidebarOpen ? 260 : 80),
          width: isMobile ? '100%' : `calc(100% - ${isSidebarOpen ? 260 : 80}px)`
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="flex-1 flex flex-col min-h-screen overflow-x-hidden"
      >
        <Header 
          currentPage={currentPage} 
          theme="sci-fi" 
          onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        
        <div className="flex-1 p-4 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(10px)' }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="max-w-7xl mx-auto w-full"
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </div>

        <footer className="p-6 md:p-8 border-t border-studio-border bg-studio-sidebar/50">
           <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex flex-col items-center md:items-start gap-4">
                 <div className="flex items-center gap-2 text-white font-black tracking-tighter">
                   <div className="w-5 h-5 bg-studio-cyan rounded flex items-center justify-center">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-slate-950"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor"/></svg>
                   </div>
                   STUDIO
                 </div>
                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">© 2024 STUDIO AI. All rights reserved.</p>
              </div>
              <div className="flex flex-wrap justify-center gap-4 md:gap-8">
                 <a href="#" className="text-[10px] text-slate-500 hover:text-studio-cyan transition-colors font-bold uppercase tracking-widest">Privacy Policy</a>
                 <a href="#" className="text-[10px] text-slate-500 hover:text-studio-cyan transition-colors font-bold uppercase tracking-widest">Terms of Service</a>
                 <a href="#" className="text-[10px] text-slate-500 hover:text-studio-cyan transition-colors font-bold uppercase tracking-widest">Support</a>
              </div>
           </div>
        </footer>
      </motion.main>

      {/* Floating Chat Trigger */}
      <button className="fixed bottom-4 md:bottom-8 right-4 md:right-8 w-12 h-12 md:w-14 md:h-14 rounded-full bg-studio-cyan text-slate-950 flex items-center justify-center shadow-2xl shadow-studio-cyan/20 group active:scale-90 transition-transform z-50">
         <MessageSquare className="w-5 h-5 md:w-6 md:h-6" />
         <div className="absolute -top-1 -right-1 w-2.5 h-2.5 md:w-3 md:h-3 bg-red-500 rounded-full border-2 border-studio-bg" />
      </button>
    </div>
  );
}
