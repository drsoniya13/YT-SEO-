import { motion, AnimatePresence } from 'motion/react';
import { LucideIcon, Zap } from 'lucide-react';
import { ReactNode } from 'react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  color?: string;
}

export function StatCard({ icon: Icon, label, value, color = 'studio-cyan' }: StatCardProps) {
  return (
    <div className="glass-panel p-4 flex items-center gap-4 group hover:bg-white/5 transition-all">
      <div className={`p-3 rounded-xl bg-slate-900 border border-studio-border group-hover:border-${color}/50`}>
        <Icon className={`w-5 h-5 text-${color}`} />
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-0.5">{label}</p>
        <p className="text-sm font-bold text-slate-200">{value}</p>
      </div>
    </div>
  );
}

interface PanelHeaderProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function PanelHeader({ icon: Icon, title, subtitle, action }: PanelHeaderProps) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="p-2 rounded-lg bg-studio-cyan/10">
        <Icon className="w-5 h-5 text-studio-cyan" />
      </div>
      <div className="flex-1">
        <h3 className="text-sm font-bold uppercase tracking-wider text-white">{title}</h3>
        {subtitle && <p className="text-[10px] text-slate-500 uppercase tracking-widest font-medium">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function GlowingButton({ children, onClick, className = "", variant = "primary", disabled = false }: { children: ReactNode, onClick?: () => void, className?: string, variant?: "primary" | "secondary", disabled?: boolean }) {
  const styles = variant === "primary" ? "btn-primary" : "btn-secondary";
  return (
    <motion.button 
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={disabled}
      className={`${styles} relative overflow-hidden group ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {!disabled && <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-[30deg]" />}
      {children}
    </motion.button>
  );
}

export function NeuralLoadingOverlay({ isVisible, message, progress }: { isVisible: boolean, message: string, progress?: number }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-6"
        >
          <div className="max-w-md w-full space-y-8 text-center">
            <div className="relative">
              <div className="absolute inset-0 bg-studio-cyan/20 blur-3xl rounded-full scale-150 animate-pulse" />
              <div className="relative flex items-center justify-center">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="w-32 h-32 rounded-full border-2 border-dashed border-studio-cyan/30"
                />
                <motion.div 
                  animate={{ rotate: -360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute w-24 h-24 rounded-full border-2 border-studio-cyan/50"
                />
                <Zap className="absolute w-10 h-10 text-studio-cyan animate-bounce" fill="currentColor" />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-black uppercase tracking-[0.3em] text-white italic">{message}</h3>
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500 px-2">
                <span>Neural Frequency</span>
                <span>{progress ? Math.round(progress) : '88'}% STABLE</span>
              </div>
              <div className="h-1.5 w-full bg-slate-900 rounded-full border border-studio-border overflow-hidden p-0.5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress || 40}%` }}
                  className="h-full bg-studio-cyan shadow-[0_0_15px_#00e5ff]"
                />
              </div>
              <p className="text-[8px] font-black uppercase tracking-[0.4em] text-studio-cyan/60 animate-pulse">
                [ BITSTREAM_SYNCING_ACTIVE ]
              </p>
            </div>

            <div className="pt-4 grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-900/50 border border-studio-border rounded-xl">
                <p className="text-[8px] text-slate-500 uppercase tracking-widest mb-1">Packet Rate</p>
                <p className="text-xs font-black uppercase text-white tracking-widest">480 KB/S</p>
              </div>
              <div className="p-3 bg-slate-900/50 border border-studio-border rounded-xl">
                <p className="text-[8px] text-slate-500 uppercase tracking-widest mb-1">Latency</p>
                <p className="text-xs font-black uppercase text-white tracking-widest">12 MS</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
