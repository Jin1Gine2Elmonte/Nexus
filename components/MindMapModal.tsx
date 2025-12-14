
import React, { useEffect, useState, useRef } from 'react';
import { X, Activity, GitBranch, Zap, Brain, Network, Share2, Layers, Archive, EyeOff, Merge, Ban, Fingerprint, History, RefreshCw } from 'lucide-react';

interface MindMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  thoughtContent: string;
}

interface GraphNode {
  id: number;
  text: string;
  x: number;
  y: number;
  size: number;
  type: 'core' | 'major' | 'minor' | 'ghost';
  opacity: number;
  pulseDelay: number;
}

const MindMapModal: React.FC<MindMapModalProps> = ({ isOpen, onClose, thoughtContent }) => {
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [stats, setStats] = useState({
    density: 0,
    timelines: 0,
    entropy: 0
  });
  
  // Parse thoughts into nodes
  useEffect(() => {
    if (isOpen) {
      const newNodes: GraphNode[] = [];
      
      // 1. Core Node (Nexus)
      newNodes.push({ 
        id: 0, 
        text: "NEXUS::ARCHIVE_CORE", 
        x: 50, 
        y: 50, 
        size: 25, 
        type: 'core', 
        opacity: 1,
        pulseDelay: 0 
      });

      // 2. Parse Content
      const lines = thoughtContent ? thoughtContent.split('\n').filter(l => l.trim().length > 5) : ["Initializing Archive...", "Scanning Ghost Paths..."];
      const significantLines = lines.filter(l => l.includes('*') || l.includes('-') || l.includes(':'));
      
      // Limit to reasonable number for visual clarity, but pretend there are 100s
      const nodesToCreate = significantLines.slice(0, 24).map(l => l.replace(/[*#-]/g, '').trim().substring(0, 30));
      
      // Create Organic Layout
      nodesToCreate.forEach((text, i) => {
        const angle = (i / nodesToCreate.length) * 2 * Math.PI;
        // Organic radius variation
        const radius = 20 + Math.random() * 25; 
        const x = 50 + radius * Math.cos(angle);
        const y = 50 + radius * Math.sin(angle);
        
        // Randomly assign "Ghost Paths" (rejected ideas)
        // In the Pale Archive logic, we keep rejected paths visible but faint
        const isGhost = Math.random() > 0.8;

        newNodes.push({
          id: i + 1,
          text: text + (isGhost ? " [REJECTED]" : ""),
          x: Math.max(5, Math.min(95, x)),
          y: Math.max(5, Math.min(95, y)),
          size: isGhost ? 8 : 12 + Math.random() * 8,
          type: isGhost ? 'ghost' : (Math.random() > 0.7 ? 'major' : 'minor'),
          opacity: isGhost ? 0.3 : 0.9,
          pulseDelay: Math.random() * 2
        });
      });
      
      setNodes(newNodes);
      setStats({
        density: Math.floor(Math.random() * 30) + 70,
        timelines: 100, // Fixed 100 as per protocol
        entropy: Math.floor(Math.random() * 100)
      });
    }
  }, [isOpen, thoughtContent]);

  const handleNodeAction = (action: 'synthesize' | 'avoid' | 'prune') => {
    if (selectedNode === null) return;
    
    setNodes(prev => prev.map(n => {
        if (n.id === selectedNode) {
            if (action === 'avoid') return { ...n, type: 'ghost', opacity: 0.2, text: `[GHOST] ${n.text}` };
            if (action === 'synthesize') return { ...n, type: 'major', opacity: 1, size: n.size * 1.2, text: `[MERGED] ${n.text}` };
            if (action === 'prune') return { ...n, opacity: 0 }; // Hide
        }
        return n;
    }));
    setSelectedNode(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-[95vw] h-[90vh] bg-[#050c05] border border-[#1f2e1f] rounded-lg relative overflow-hidden flex flex-col shadow-[0_0_100px_rgba(0,0,0,1)]">
        
        {/* --- THE PALE ARCHIVE AESTHETICS --- */}
        
        {/* 1. Wood Grain Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.08] pointer-events-none mix-blend-overlay" 
             style={{
                 backgroundImage: `
                    repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 1px, transparent 50%),
                    repeating-linear-gradient(-45deg, #10b981 0, #10b981 1px, transparent 1px, transparent 50%)
                 `,
                 backgroundSize: '40px 40px'
             }}>
        </div>
        
        {/* 2. Static Dust (Stars/Noise) */}
        <div className="absolute inset-0 opacity-20 pointer-events-none"
             style={{
                 backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)',
                 backgroundSize: '50px 50px',
                 filter: 'contrast(500%) brightness(1000%)'
             }}>
        </div>
        
        {/* 3. Background Pulse Waves (The "Waves" Requirement) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none z-0 flex items-center justify-center">
            <div className="w-[40vw] h-[40vw] rounded-full border border-[#10b981] opacity-5 animate-ping" style={{ animationDuration: '4s' }}></div>
            <div className="w-[60vw] h-[60vw] rounded-full border border-[#10b981] opacity-5 animate-ping" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
            <div className="w-[80vw] h-[80vw] rounded-full border border-[#10b981] opacity-5 animate-ping" style={{ animationDuration: '4s', animationDelay: '2s' }}></div>
        </div>

        {/* 4. Header */}
        <div className="h-14 border-b border-[#1f2e1f] flex items-center justify-between px-6 bg-[#020502]/80 backdrop-blur relative z-20">
           <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded border border-[#1f2e1f] bg-black flex items-center justify-center">
                   <Archive className="text-[#bbf7d0] opacity-60" size={20} />
               </div>
               <div>
                   <h2 className="text-[#bbf7d0] font-mono tracking-widest text-lg font-bold uppercase">The Pale Archive</h2>
                   <div className="flex items-center gap-3 text-[10px] text-[#86efac] font-mono opacity-60">
                       <span className="flex items-center gap-1"><Activity size={10} /> PRISMATIC HUNGER: ACTIVE</span>
                       <span className="flex items-center gap-1"><History size={10} /> TIMELINES: {stats.timelines}</span>
                   </div>
               </div>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-[#1f2e1f] rounded-full text-[#bbf7d0] transition-colors">
               <X size={20} />
           </button>
        </div>

        {/* 5. Main Canvas */}
        <div className="flex-1 relative overflow-hidden cursor-crosshair" ref={canvasRef} onClick={() => setSelectedNode(null)}>
            
            {/* Connecting Lines (Synapses) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-30">
                {nodes.map((node, i) => (
                    node.opacity > 0 && node.id !== 0 && (
                        <line 
                            key={`line-${i}`}
                            x1="50%" 
                            y1="50%" 
                            x2={`${node.x}%`} 
                            y2={`${node.y}%`} 
                            stroke={node.type === 'ghost' ? '#525252' : '#bbf7d0'} 
                            strokeWidth={node.type === 'major' ? 1.5 : 0.5}
                            strokeDasharray={node.type === 'ghost' ? "4 4" : "none"}
                        />
                    )
                ))}
            </svg>

            {/* Nodes */}
            {nodes.map((node) => (
                node.opacity > 0 && (
                    <div
                        key={node.id}
                        className={`absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full border transition-all duration-500 cursor-pointer group z-10 flex items-center justify-center
                            ${node.type === 'core' ? 'bg-black border-[#bbf7d0] shadow-[0_0_30px_rgba(187,247,208,0.2)]' : ''}
                            ${node.type === 'major' ? 'bg-[#050c05] border-[#bbf7d0]/60 hover:scale-125 hover:border-[#bbf7d0]' : ''}
                            ${node.type === 'minor' ? 'bg-black border-[#bbf7d0]/30 hover:scale-110' : ''}
                            ${node.type === 'ghost' ? 'bg-transparent border-zinc-700 border-dashed grayscale blur-[1px] hover:blur-0 hover:border-zinc-500' : ''}
                        `}
                        style={{
                            left: `${node.x}%`,
                            top: `${node.y}%`,
                            width: `${node.size * 3}px`,
                            height: `${node.size * 3}px`,
                            opacity: node.opacity
                        }}
                        onClick={(e) => { e.stopPropagation(); setSelectedNode(node.id); }}
                    >
                        {/* Bio-Digital Pulse Animation (Individual Node) */}
                        {node.type !== 'ghost' && (
                            <div 
                                className="absolute inset-0 rounded-full border border-[#bbf7d0] opacity-0 animate-ping"
                                style={{ animationDuration: '3s', animationDelay: `${node.pulseDelay}s` }}
                            />
                        )}
                        
                        {/* Icon/Text */}
                        {node.type === 'core' ? <Fingerprint size={24} className="text-[#bbf7d0]" /> : null}
                        
                        {/* Tooltip */}
                        <div className={`
                            absolute top-full mt-2 left-1/2 -translate-x-1/2 w-max max-w-[200px] bg-black/90 border border-[#1f2e1f] px-3 py-1.5 rounded text-[10px] font-mono text-[#bbf7d0] pointer-events-none z-50
                            ${selectedNode === node.id ? 'opacity-100 scale-100' : 'opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100'}
                            transition-all duration-200
                        `}>
                            {node.text}
                        </div>
                    </div>
                )
            ))}

            {/* Context Menu for Selected Node */}
            {selectedNode !== null && selectedNode !== 0 && (
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-black border border-[#bbf7d0]/40 p-2 rounded-lg flex gap-2 shadow-2xl z-50 animate-in slide-in-from-bottom-4">
                    <button 
                        onClick={() => handleNodeAction('synthesize')}
                        className="flex items-center gap-2 px-3 py-2 hover:bg-[#1f2e1f] rounded text-[#bbf7d0] text-xs font-mono border border-transparent hover:border-[#bbf7d0]/30"
                    >
                        <Merge size={14} /> Synthesize
                    </button>
                    <button 
                        onClick={() => handleNodeAction('avoid')}
                        className="flex items-center gap-2 px-3 py-2 hover:bg-[#1f2e1f] rounded text-zinc-400 hover:text-zinc-200 text-xs font-mono border border-transparent hover:border-zinc-700"
                    >
                        <EyeOff size={14} /> Avoid (Ghost)
                    </button>
                    <button 
                        onClick={() => handleNodeAction('prune')}
                        className="flex items-center gap-2 px-3 py-2 hover:bg-red-900/20 rounded text-red-400 text-xs font-mono border border-transparent hover:border-red-900/50"
                    >
                        <Ban size={14} /> Prune
                    </button>
                </div>
            )}

        </div>

        {/* 6. Footer / Telemetry */}
        <div className="h-12 bg-[#020502]/90 border-t border-[#1f2e1f] flex items-center justify-between px-6 font-mono text-[10px] text-[#bbf7d0]/50 relative z-20">
             <div className="flex items-center gap-6">
                 <span className="flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-[#bbf7d0] animate-pulse"></span>
                     SENTINEL: MONITORING
                 </span>
                 <span>ARCHIVE STATUS: STABLE</span>
             </div>
             <div className="flex gap-4">
                 <span>DENSITY: {stats.density}%</span>
                 <span>ENTROPY: {stats.entropy}%</span>
             </div>
        </div>
      </div>
    </div>
  );
};

export default MindMapModal;
