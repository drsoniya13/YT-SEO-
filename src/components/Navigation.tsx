import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Mic, 
  Activity, 
  FileText, 
  Image as ImageIcon, 
  LayoutGrid, 
  History, 
  FolderRoot, 
  KeyRound, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
  HelpCircle,
  Menu,
  Bell,
  Moon,
  User,
  Globe,
  X,
  Sparkles,
  Search,
  MessageSquare,
  Layout
} from 'lucide-react';
import { Page, NAV_ITEMS } from '../types';

const iconMap: Record<string, any> = {
  LayoutDashboard,
  Mic,
  Activity,
  FileText,
  Image: ImageIcon,
  LayoutGrid,
  History,
  FolderRoot,
  KeyRound,
  Settings,
  Sparkles,
  Search,
  MessageSquare,
  Layout
};

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isMobile: boolean;
}

export function Sidebar({ currentPage, setCurrentPage, isOpen, setIsOpen, isMobile }: SidebarProps) {
  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55]"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ 
          width: isMobile ? (isOpen ? 280 : 0) : (isOpen ? 280 : 88),
          x: isMobile && !isOpen ? -280 : 0
        }}
        className="fixed left-0 top-0 h-screen bg-[#020617] border-r border-slate-900 flex flex-col z-[60] overflow-hidden font-sans"
      >
        <div className="p-8 flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="relative">
              <Zap className="w-10 h-10 text-studio-cyan relative z-10" fill="currentColor" />
              <div className="absolute inset-0 bg-studio-cyan/20 blur-xl rounded-full animate-pulse z-0" />
            </div>
            <AnimatePresence>
              {(isOpen || isMobile) && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex flex-col"
                >
                  <span className="text-xl font-black tracking-tighter text-white leading-none">VOCALPRO</span>
                  <span className="text-[8px] font-black tracking-[0.4em] text-studio-cyan opacity-80 mt-1">NEURAL STUDIO</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {isMobile && (
            <button onClick={() => setIsOpen(false)} className="text-slate-400 p-2 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
          )}
        </div>

        <nav className="flex-1 px-4 py-2 space-y-2 overflow-y-auto no-scrollbar">
          {NAV_ITEMS.map((item) => {
            const Icon = iconMap[item.icon === 'Image' ? 'Image' : item.icon];
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id);
                  if (isMobile) setIsOpen(false);
                }}
                className={`w-full flex items-center gap-5 p-4 rounded-xl transition-all relative group overflow-hidden ${
                  isActive 
                    ? 'bg-studio-cyan text-slate-950 shadow-[0_0_20px_rgba(0,229,255,0.2)]' 
                    : 'text-slate-500 hover:bg-slate-900/50 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 relative z-10 ${isActive ? 'text-slate-950' : 'group-hover:text-studio-cyan'}`} />
                <AnimatePresence>
                  {(isOpen || isMobile) && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="whitespace-nowrap text-xs font-black uppercase tracking-widest relative z-10"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="active-nav-glow"
                    className="absolute inset-0 bg-linear-to-r from-white/10 to-transparent pointer-events-none"
                  />
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-6 mt-auto">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-900 flex flex-col gap-4">
             <div className="flex items-center gap-3 text-slate-500">
                <HelpCircle className="w-5 h-5" />
                {(isOpen || isMobile) && (
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">Neural Docs</span>
                    <span className="text-[8px] text-slate-600 uppercase font-bold tracking-widest">Help Center</span>
                  </div>
                )}
             </div>
             {(isOpen || isMobile) && (
               <div className="pt-4 border-t border-slate-900">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-600">Storage</span>
                    <span className="text-[8px] font-black uppercase tracking-widest text-studio-cyan">72% used</span>
                  </div>
                  <div className="h-1 bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-studio-cyan w-[72%]" />
                  </div>
               </div>
             )}
          </div>
        </div>

        {!isMobile && (
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="absolute -right-3 top-20 bg-studio-cyan text-slate-950 p-1 rounded-full border-4 border-studio-bg hover:scale-110 transition-transform hidden md:block"
          >
            {isOpen ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          </button>
        )}
      </motion.aside>
    </>
  );
}

interface HeaderProps {
  currentPage: Page;
  theme: string;
  onMenuClick: () => void;
}

export function Header({ currentPage, theme, onMenuClick }: HeaderProps) {
  const isManualApi = typeof window !== 'undefined' && !!localStorage.getItem('gemini_api_key');

  return (
    <header className="h-24 border-b border-slate-900 bg-[#020617]/80 backdrop-blur-xl flex items-center justify-between px-6 md:px-10 sticky top-0 z-40 font-sans">
      <div className="flex items-center gap-6">
        <button 
          onClick={onMenuClick}
          className="bg-studio-cyan p-3 rounded-xl text-slate-950 md:hidden shadow-[0_0_20px_rgba(0,229,255,0.3)]"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <div className={`p-1.5 rounded-lg border flex items-center gap-2 ${isManualApi ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : 'bg-studio-cyan/10 border-studio-cyan/20 text-studio-cyan'}`}>
              <Zap className="w-3 h-3 animate-pulse" />
              <span className="text-[8px] md:text-[9px] uppercase tracking-[0.3em] font-black">
                {isManualApi ? 'Protocol Delta: Manual' : 'Neural Core: Active'}
              </span>
            </div>
          </div>
          <h1 className="text-xl md:text-3xl font-black text-white tracking-tighter uppercase italic leading-none">
            {currentPage === 'Dashboard' ? 'Central Command' : currentPage}
          </h1>
          <div className="flex items-center gap-4 mt-2">
             <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.3em]">
                <span className="text-slate-600 italic">Sync:</span>
                <span className="text-studio-cyan">Live</span>
             </div>
             <div className="w-px h-2 bg-slate-800" />
             <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.3em]">
                <span className="text-slate-600 italic">Load:</span>
                <span className="text-studio-cyan">Minimal</span>
             </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        <div className="hidden lg:flex items-center gap-6 pr-6 border-r border-slate-900 mr-2">
          <div className="flex flex-col items-end">
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-600">Throughput</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-white">4.2 GB/s</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-600">Latency</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-studio-cyan">12ms</span>
          </div>
        </div>

        <button className="h-10 md:h-12 px-4 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800 transition-all flex items-center gap-3 group">
          <Globe className="w-4 h-4 text-studio-cyan group-hover:rotate-12 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">EN</span>
        </button>
        
        <button className="h-10 md:h-12 w-10 md:w-12 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800 transition-all flex items-center justify-center relative group">
          <Bell className="w-5 h-5 text-slate-400 group-hover:text-studio-cyan transition-colors" />
          <span className="absolute top-3 right-3 w-2 h-2 bg-studio-cyan rounded-full border-2 border-[#020617] animate-ping" />
          <span className="absolute top-3 right-3 w-2 h-2 bg-studio-cyan rounded-full border-2 border-[#020617]" />
        </button>
        
        <button className="h-10 md:h-12 w-10 md:w-12 rounded-xl border-2 border-studio-cyan bg-studio-cyan flex items-center justify-center shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:scale-105 transition-transform">
          <User className="w-5 h-5 text-slate-950" />
        </button>
      </div>
    </header>
  );
}
