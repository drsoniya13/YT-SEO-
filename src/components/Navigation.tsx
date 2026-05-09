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
  X
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
  Settings
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
          width: isMobile ? (isOpen ? 280 : 0) : (isOpen ? 260 : 80),
          x: isMobile && !isOpen ? -280 : 0
        }}
        className="fixed left-0 top-0 h-screen bg-studio-sidebar border-r border-studio-border flex flex-col z-[60] overflow-hidden"
      >
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Zap className="w-8 h-8 text-studio-cyan" fill="currentColor" />
            <AnimatePresence>
              {(isOpen || isMobile) && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="text-xl font-bold tracking-tighter text-white"
                >
                  YT Studio
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          {isMobile && (
            <button onClick={() => setIsOpen(false)} className="text-slate-400">
              <X className="w-6 h-6" />
            </button>
          )}
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
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
                className={`w-full flex items-center gap-4 p-3 rounded-studio transition-all relative group ${
                  isActive 
                    ? 'bg-studio-cyan/10 text-studio-cyan' 
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <AnimatePresence>
                  {(isOpen || isMobile) && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="whitespace-nowrap text-sm font-medium"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="active-nav"
                    className="absolute left-0 w-1 h-6 bg-studio-cyan rounded-r-full"
                  />
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 space-y-4">
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <button className="flex items-center gap-3 p-2 text-slate-400 hover:text-slate-200 transition-colors">
                <HelpCircle className="w-5 h-5 shrink-0" />
                {(isOpen || isMobile) && <div className="flex flex-col items-start"><span className="text-xs font-bold">Need Help?</span><span className="text-[10px]">Help Center</span></div>}
              </button>
            </div>
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
    <header className="h-16 border-b border-studio-border bg-studio-bg/80 backdrop-blur-md flex items-center justify-between px-4 md:px-8 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="bg-studio-cyan p-2 rounded-lg text-slate-950 md:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-[8px] md:text-[10px] uppercase tracking-widest text-studio-cyan font-bold leading-none">
            <Zap className="w-2.5 h-2.5 md:w-3 h-3" />
            {isManualApi ? 'Manual Processing Active' : 'Live Processing YT Studio'}
          </div>
          <h1 className="text-base md:text-2xl font-bold text-white tracking-wide uppercase leading-tight">
            {currentPage === 'Dashboard' ? 'Dashboard Overview' : currentPage}
          </h1>
          <div className="flex items-center gap-2 md:gap-4 mt-0.5 md:mt-1">
             <div className="flex items-center gap-1 md:gap-1.5 text-[7px] md:text-[8px] font-black uppercase tracking-[0.2em]">
                <span className="text-slate-500">Status:</span>
                <span className="text-studio-cyan">Operational</span>
             </div>
             <div className="w-px h-1.5 md:h-2 bg-slate-800" />
             <div className="flex items-center gap-1 md:gap-1.5 text-[7px] md:text-[8px] font-black uppercase tracking-[0.2em]">
                <span className="text-slate-500">Buffer:</span>
                <span className="text-studio-cyan">Clear</span>
             </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 md:gap-3">
        <button className="btn-secondary h-8 md:h-10 px-2 md:px-3">
          <Globe className="w-3 h-3 md:w-4 h-4 text-studio-cyan" />
          <span className="text-[10px] md:text-xs font-bold uppercase">EN</span>
        </button>
        <button className="btn-secondary h-8 md:h-10 w-8 md:w-10 p-0 hidden sm:flex">
          <Moon className="w-3.5 h-3.5 md:w-4 h-4" />
        </button>
        <button className="btn-secondary h-8 md:h-10 w-8 md:w-10 p-0 relative">
          <Bell className="w-3.5 h-3.5 md:w-4 h-4" />
          <span className="absolute top-1.5 md:top-2 right-1.5 md:right-2 w-1.5 md:w-2 h-1.5 md:h-2 bg-studio-cyan rounded-full border-2 border-studio-bg" />
        </button>
        <button className="btn-secondary h-8 md:h-10 w-8 md:w-10 p-0 border border-studio-cyan/50">
          <User className="w-3.5 h-3.5 md:w-4 h-4 text-white" />
        </button>
      </div>
    </header>
  );
}
