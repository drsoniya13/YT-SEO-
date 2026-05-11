import { 
  History as HistoryIcon,
  Search,
  Filter,
  Trash2,
  ExternalLink,
  Clock,
  Zap,
  Mic,
  Image as ImageIcon,
  Sparkles,
  Activity,
  Target
} from 'lucide-react';
import { PanelHeader } from '../components/Common';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const MOCK_HISTORY = [
  { id: 1, type: 'Vocal Pro', title: 'Viral Intro Voiceover', date: '2024-05-10 14:24', status: 'Success', icon: Mic },
  { id: 2, type: 'Vision Forge', title: 'Cyberpunk Dhaka Streets thumbnail', date: '2024-05-10 12:15', status: 'Success', icon: ImageIcon },
  { id: 3, type: 'Content Architect', title: 'Top 10 Tech Gadgets Script', date: '2024-05-09 22:45', status: 'Success', icon: Sparkles },
  { id: 4, type: 'Ad Forge', title: 'E-commerce Summer Sale', date: '2024-05-09 18:30', status: 'Success', icon: Target },
  { id: 5, type: 'Signal Sync', title: 'Interview with CEO - Part 1', date: '2024-05-08 11:20', status: 'Success', icon: Activity },
  { id: 6, type: 'Vocal Pro', title: 'Documentary Narration BD', date: '2024-05-07 16:55', status: 'Success', icon: Mic },
];

export default function History() {
  const [search, setSearch] = useState('');
  const [history, setHistory] = useState(MOCK_HISTORY);

  const filteredHistory = history.filter(item => 
    item.title.toLowerCase().includes(search.toLowerCase()) || 
    item.type.toLowerCase().includes(search.toLowerCase())
  );

  const deleteItem = (id: number) => {
    setHistory(history.filter(i => i.id !== id));
  };

  return (
    <div className="space-y-8 pb-20 font-sans">
      <div className="glass-panel p-8 md:p-12 space-y-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
           <PanelHeader 
              icon={HistoryIcon} 
              title="Neural Archive" 
              subtitle="Temporal log of all synthesized assets and logic streams."
           />
           
           <div className="flex items-center gap-3">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700 group-focus-within:text-studio-cyan transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search archive..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-slate-950/50 border border-studio-border rounded-xl h-12 pl-12 pr-6 text-xs font-bold text-white outline-none focus:border-studio-cyan/50 focus:ring-1 focus:ring-studio-cyan/20 transition-all w-full md:w-80"
                />
              </div>
              <button className="btn-secondary h-12 w-12 p-0 flex items-center justify-center">
                 <Filter className="w-4 h-4" />
              </button>
           </div>
        </div>

        <div className="overflow-x-auto no-scrollbar -mx-8 px-8">
          <table className="w-full">
            <thead>
              <tr className="border-b border-studio-border">
                <th className="pb-6 text-left text-[10px] uppercase font-black tracking-[0.2em] text-slate-600">Type</th>
                <th className="pb-6 text-left text-[10px] uppercase font-black tracking-[0.2em] text-slate-600">Request Trace</th>
                <th className="pb-6 text-left text-[10px] uppercase font-black tracking-[0.2em] text-slate-600">Timestamp</th>
                <th className="pb-6 text-left text-[10px] uppercase font-black tracking-[0.2em] text-slate-600">Status</th>
                <th className="pb-6 text-right text-[10px] uppercase font-black tracking-[0.2em] text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900">
              <AnimatePresence>
                {filteredHistory.map((item) => (
                  <motion.tr 
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="group hover:bg-studio-cyan/5 transition-colors"
                  >
                    <td className="py-6">
                       <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-lg bg-slate-950 border border-studio-border text-studio-cyan group-hover:border-studio-cyan/30 transition-all">
                             <item.icon className="w-4 h-4" />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-white">{item.type}</span>
                       </div>
                    </td>
                    <td className="py-6">
                       <span className="text-sm font-bold text-slate-400 group-hover:text-white transition-colors">{item.title}</span>
                    </td>
                    <td className="py-6">
                       <div className="flex items-center gap-2 text-slate-600 text-[10px] font-bold uppercase tracking-widest">
                          <Clock className="w-3 h-3" />
                          {item.date}
                       </div>
                    </td>
                    <td className="py-6">
                       <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-green-500/10 border border-green-500/20 text-[8px] font-black text-green-500 uppercase tracking-widest">
                          <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                          {item.status}
                       </div>
                    </td>
                    <td className="py-6 text-right">
                       <div className="flex items-center justify-end gap-2">
                          <button className="p-2 rounded-lg bg-slate-950 border border-studio-border text-slate-500 hover:text-studio-cyan hover:border-studio-cyan/50 transition-all">
                             <ExternalLink className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => deleteItem(item.id)}
                            className="p-2 rounded-lg bg-slate-950 border border-studio-border text-slate-700 hover:text-red-500 hover:border-red-500/50 transition-all font-black uppercase tracking-widest"
                          >
                             <Trash2 className="w-4 h-4" />
                          </button>
                       </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {filteredHistory.length === 0 && (
            <div className="py-20 text-center space-y-6">
               <div className="p-10 rounded-full border-2 border-dashed border-slate-800 bg-slate-900/20 inline-block">
                  <Zap className="w-12 h-12 text-slate-800" />
               </div>
               <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-700">The neural archive is vacant.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
