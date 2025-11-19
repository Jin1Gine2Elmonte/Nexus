import React, { useEffect, useState } from 'react';
import { NodeStatus, ProcessingStage } from '../types';
import { Cpu, ShieldCheck, Zap, Activity, Brain, Server, Lock, Share2 } from 'lucide-react';

interface NeuralGridProps {
  stage: ProcessingStage;
}

const SPECIALIZATIONS = [
  "تحليل منطقي", "رياضيات متقدمة", "تفكير إبداعي", "بحث واسترجاع", "بنية برمجية", "أمن المعلومات", 
  "سياق تاريخي", "نمذجة فيزيائية", "لغويات ودلالة", "تحليل بيانات", "تخطيط استراتيجي", "سلوك معرفي",
  "علوم طبية", "تصميم هندسي", "فنون بصرية", "اقتصاد كلي", "منطق فلسفي", "أنظمة حيوية",
  "كيمياء تحليلية", "علوم فضاء", "تشريع وقانون", "بيداغوجيا", "سلوك سوق", "إدارة موارد",
  "نظريات موسيقية", "سيناريو", "أداء رياضي", "مستقبل تقني", "استدامة بيئية", "طاقة بديلة"
];

const NeuralGrid: React.FC<NeuralGridProps> = ({ stage }) => {
  const [nodes, setNodes] = useState<NodeStatus[]>([]);
  const [tick, setTick] = useState(0);

  // Initialize nodes
  useEffect(() => {
    const initialNodes: NodeStatus[] = [];
    // 30 Worker Nodes
    for (let i = 0; i < 30; i++) {
      initialNodes.push({
        id: i,
        type: 'worker',
        status: 'idle',
        load: 5 + Math.random() * 10,
        specialization: SPECIALIZATIONS[i]
      });
    }
    // 3 Reviewer Nodes
    for (let i = 30; i < 33; i++) {
      initialNodes.push({
        id: i,
        type: 'reviewer',
        status: 'idle',
        load: 0,
        specialization: 'Omni-Reviewer'
      });
    }
    setNodes(initialNodes);
  }, []);

  // High frequency animation loop for "matrix" feel
  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1);
      setNodes(prev => prev.map(node => {
        let targetStatus: NodeStatus['status'] = 'idle';
        let loadChange = (Math.random() - 0.5) * 10;

        // Logic for Worker Nodes (0-29)
        if (node.type === 'worker') {
           if (stage === ProcessingStage.DISTRIBUTING) {
             // Sequential activation or rapid random
             targetStatus = Math.random() > 0.5 ? 'analyzing' : 'idle';
             loadChange += 20;
           } else if (stage === ProcessingStage.ANALYZING) {
             // Heavy load, mostly active
             targetStatus = Math.random() > 0.2 ? 'analyzing' : 'idle';
             loadChange += (Math.random() * 15);
           } else if (stage === ProcessingStage.SYNTHESIZING) {
             // Cooling down, transferring
             targetStatus = Math.random() > 0.8 ? 'analyzing' : 'idle';
             loadChange -= 5;
           }
        } 
        
        // Logic for Reviewer Nodes (30-32)
        if (node.type === 'reviewer') {
            if (stage === ProcessingStage.SYNTHESIZING) {
                targetStatus = 'reviewing';
                loadChange += 15;
            } else if (stage === ProcessingStage.REVIEWING) {
                targetStatus = 'reviewing';
                loadChange += Math.random() * 5; // Stable high load
            }
        }

        let newLoad = Math.min(100, Math.max(2, node.load + loadChange));
        // Decay if idle
        if (stage === ProcessingStage.IDLE) {
            newLoad = Math.max(2, newLoad - 2);
            targetStatus = 'idle';
        }

        return {
          ...node,
          status: targetStatus,
          load: newLoad
        };
      }));
    }, 100); // Faster update for smoother "glitch" visuals

    return () => clearInterval(interval);
  }, [stage]);

  const activeWorkers = nodes.filter(n => n.type === 'worker' && n.status === 'analyzing').length;
  const activeReviewers = nodes.filter(n => n.type === 'reviewer' && n.status === 'reviewing').length;

  return (
    <div className="relative bg-black/80 border border-zinc-800 rounded-xl overflow-hidden backdrop-blur-md shadow-2xl">
      {/* Grid Background Pattern */}
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none"></div>
      
      {/* Header */}
      <div className="relative z-10 flex justify-between items-center p-3 border-b border-zinc-800 bg-zinc-900/50">
        <div className="flex items-center gap-2">
          <Cpu size={14} className={`text-emerald-500 ${stage !== ProcessingStage.IDLE ? 'animate-pulse' : ''}`} />
          <span className="text-[10px] font-mono font-bold tracking-widest text-zinc-400 uppercase glitch-text">
            Core_Grid::Active
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono">
            <span className={stage !== ProcessingStage.IDLE ? "text-emerald-400" : "text-zinc-600"}>
                {activeWorkers.toString().padStart(2, '0')}/30
            </span>
            <span className="text-zinc-700">|</span>
            <span className={stage === ProcessingStage.REVIEWING ? "text-indigo-400" : "text-zinc-600"}>
                {activeReviewers}/03
            </span>
        </div>
      </div>

      <div className="relative z-10 p-4">
        {/* 30 WORKER NODES */}
        <div className="mb-2 flex justify-between items-end">
             <h4 className="text-[9px] text-zinc-500 font-mono uppercase tracking-widest">Deep Analysis Layer</h4>
             {stage === ProcessingStage.ANALYZING && (
                 <span className="text-[9px] text-emerald-500 animate-pulse">PROCESSING...</span>
             )}
        </div>
        
        <div className="grid grid-cols-6 gap-1.5 mb-6">
          {nodes.filter(n => n.type === 'worker').map((node) => {
            const isActive = node.status === 'analyzing';
            const opacity = isActive ? 1 : 0.3;
            const colorClass = isActive ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-zinc-800';
            const borderClass = isActive ? 'border-emerald-400/50' : 'border-zinc-800';

            return (
              <div 
                key={node.id}
                className={`
                  group relative aspect-square rounded-sm border ${borderClass} transition-all duration-200 overflow-hidden
                  ${isActive ? 'scale-105 z-10' : 'scale-100'}
                `}
                title={node.specialization}
              >
                {/* Inner Load Bar */}
                <div 
                    className={`absolute bottom-0 left-0 right-0 transition-all duration-100 ${colorClass}`}
                    style={{ height: `${node.load}%`, opacity: opacity }}
                />
                
                {/* Scanline effect inside active nodes */}
                {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-transparent h-[200%] w-full animate-[scanline_1s_linear_infinite]" />
                )}

                {/* Hover Tooltip (Simulated via title mostly, but could be visual) */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/80">
                    <Activity size={10} className="text-emerald-400" />
                </div>
              </div>
            );
          })}
        </div>

        {/* CONNECTORS */}
        <div className="relative h-8 w-full mb-4 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-x-0 top-1/2 h-px bg-zinc-800"></div>
            <div className="absolute inset-x-0 top-1/2 h-px bg-emerald-500/50 scale-x-0 transition-transform duration-500"
                 style={{ transform: `scaleX(${stage === ProcessingStage.SYNTHESIZING ? 1 : 0})` }}
            ></div>
            <div className={`px-3 py-1 bg-black border border-zinc-800 rounded-full z-10 flex items-center gap-2 transition-colors duration-300 ${stage === ProcessingStage.SYNTHESIZING ? 'border-emerald-500 text-emerald-500' : 'text-zinc-600'}`}>
                <Share2 size={10} className={stage === ProcessingStage.SYNTHESIZING ? 'animate-spin' : ''} />
                <span className="text-[8px] font-mono uppercase">Data Synapse</span>
            </div>
        </div>

        {/* 3 REVIEWER NODES */}
        <div className="mb-2 flex justify-between items-end">
             <h4 className="text-[9px] text-zinc-500 font-mono uppercase tracking-widest">Executive Review Layer</h4>
             {stage === ProcessingStage.REVIEWING && (
                 <span className="text-[9px] text-indigo-400 animate-pulse">REFINING...</span>
             )}
        </div>

        <div className="grid grid-cols-3 gap-4">
          {nodes.filter(n => n.type === 'reviewer').map((node, idx) => {
            const isActive = node.status === 'reviewing';
            
            return (
              <div 
                key={node.id}
                className={`
                  relative h-16 rounded-lg border transition-all duration-500 flex flex-col items-center justify-center gap-1 overflow-hidden
                  ${isActive 
                    ? 'bg-indigo-500/10 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.4)]' 
                    : 'bg-zinc-900 border-zinc-800'}
                `}
              >
                {/* Background ring pulse */}
                {isActive && (
                    <div className="absolute inset-0 bg-indigo-500/20 animate-pulse"></div>
                )}

                <div className={`relative z-10 transition-transform duration-300 ${isActive ? 'scale-110 text-indigo-300' : 'text-zinc-600'}`}>
                    {idx === 0 && <Brain size={18} />}
                    {idx === 1 && <ShieldCheck size={18} />}
                    {idx === 2 && <Zap size={18} />}
                </div>
                
                <div className="relative z-10 text-[8px] font-mono uppercase text-zinc-500">
                    {idx === 0 ? 'Context' : idx === 1 ? 'Verify' : 'Format'}
                </div>

                {/* High-tech loading bar at bottom */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-zinc-800">
                    <div 
                        className="h-full bg-indigo-500 transition-all duration-200"
                        style={{ width: `${node.load}%` }}
                    />
                </div>
              </div>
            );
          })}
        </div>

        {/* Status Footer */}
        <div className="mt-4 pt-3 border-t border-zinc-800 flex justify-between items-center">
             <div className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${stage === ProcessingStage.IDLE ? 'bg-zinc-600' : 'bg-emerald-500 animate-ping'}`}></div>
                <span className="text-[9px] text-zinc-500 font-mono">
                    STATUS: {stage}
                </span>
             </div>
             <div className="flex gap-1">
                 {[1,2,3,4].map(i => (
                     <div key={i} className={`w-0.5 h-2 rounded-sm ${Math.random() > 0.5 ? 'bg-zinc-700' : 'bg-zinc-800'}`}></div>
                 ))}
             </div>
        </div>

      </div>
    </div>
  );
};

export default NeuralGrid;