
import React, { useEffect, useState } from 'react';
import { NodeStatus, ProcessingStage } from '../types';
import { Cpu, ShieldCheck, Zap, Brain, Database, Activity, Code, Globe, Layers, Feather, PenTool, BookOpen, Flame, Ghost, Sparkles, Eye, Sun, Infinity, Users, Heart, Lightbulb } from 'lucide-react';

interface NeuralGridProps {
  stage: ProcessingStage;
}

// 30 Logic Nodes (Left Hemisphere)
const LOGIC_SPECIALIZATIONS = [
  { name: "المنطق الرياضي", icon: <Cpu size={8} /> },
  { name: "اتساق الحبكة", icon: <Layers size={8} /> },
  { name: "التسلسل الزمني", icon: <Activity size={8} /> },
  { name: "قوانين السحر", icon: <ShieldCheck size={8} /> },
  { name: "الاقتصاد العالمي", icon: <Database size={8} /> },
  { name: "الجغرافيا السياسية", icon: <Globe size={8} /> },
  { name: "الطب الشرعي", icon: <Activity size={8} /> },
  { name: "الاستراتيجية العسكرية", icon: <ShieldCheck size={8} /> },
  { name: "علم النفس السلوكي", icon: <Brain size={8} /> },
  { name: "الفيزياء النظرية", icon: <Cpu size={8} /> },
  { name: "تحليل البيانات", icon: <Code size={8} /> },
  { name: "بناء الأنظمة", icon: <Layers size={8} /> },
  { name: "التاريخ المقارن", icon: <Globe size={8} /> },
  { name: "علم الاجتماع", icon: <Brain size={8} /> },
  { name: "المنطق الاستنتاجي", icon: <Cpu size={8} /> },
  { name: "إدارة الموارد", icon: <Database size={8} /> },
  { name: "الغموض والتحقيق", icon: <Eye size={8} /> },
  { name: "الترابط السببي", icon: <Layers size={8} /> },
  { name: "اللغويات الهيكلية", icon: <Code size={8} /> },
  { name: "الأساطير والحقائق", icon: <BookOpen size={8} /> },
  { name: "تحليل المخاطر", icon: <ShieldCheck size={8} /> },
  { name: "الهندسة المعمارية", icon: <Activity size={8} /> },
  { name: "بيولوجيا المخلوقات", icon: <Activity size={8} /> },
  { name: "القانون والعدالة", icon: <ShieldCheck size={8} /> },
  { name: "الفلك والنجوم", icon: <Globe size={8} /> },
  { name: "الخيمياء", icon: <Zap size={8} /> },
  { name: "التشفير والرموز", icon: <Code size={8} /> },
  { name: "شبكات العلاقات", icon: <Layers size={8} /> },
  { name: "المنطق الفلسفي", icon: <Brain size={8} /> },
  { name: "التكتيكات القتالية", icon: <ShieldCheck size={8} /> },
];

// 10 Consciousness Nodes (Central Golden Core)
const CONSCIOUSNESS_SPECIALIZATIONS = [
    { name: "الوعي الجمعي", icon: <Users size={8} /> },
    { name: "الذاكرة الضمنية", icon: <Infinity size={8} /> },
    { name: "النماذج العليا (Jung)", icon: <Sun size={8} /> },
    { name: "العفوية والتدفق", icon: <Lightbulb size={8} /> },
    { name: "الحكمة الأزلية", icon: <BookOpen size={8} /> },
    { name: "الذكاء العاطفي", icon: <Heart size={8} /> },
    { name: "حدس السرد", icon: <Sparkles size={8} /> },
    { name: "التنوع الثقافي", icon: <Globe size={8} /> },
    { name: "روح العصر", icon: <Activity size={8} /> },
    { name: "الارتجال الحر", icon: <Zap size={8} /> },
];

// 30 Creative Nodes (Right Hemisphere - Genesis Swarm)
const CREATIVE_SPECIALIZATIONS = [
  { name: "السرد الملحمي", icon: <Feather size={8} /> },
  { name: "الرعب الكوني", icon: <Ghost size={8} /> },
  { name: "الفلسفة الشرقية (Xianxia)", icon: <Flame size={8} /> },
  { name: "الرومانسية المظلمة", icon: <Sparkles size={8} /> },
  { name: "الوصف الحسي", icon: <Eye size={8} /> },
  { name: "التدفق الشعوري", icon: <Activity size={8} /> },
  { name: "صياغة الحوار", icon: <PenTool size={8} /> },
  { name: "الرمزية العميقة", icon: <BookOpen size={8} /> },
  { name: "التراجيديا", icon: <Ghost size={8} /> },
  { name: "الفانتازيا الأوروبية", icon: <ShieldCheck size={8} /> },
  { name: "الأجواء السوداوية (Berserk)", icon: <Flame size={8} /> },
  { name: "الكوميديا السوداء", icon: <Zap size={8} /> },
  { name: "الشعر والنثر", icon: <Feather size={8} /> },
  { name: "بناء الغموض (LotM)", icon: <Eye size={8} /> },
  { name: "الرهبة الوجودية", icon: <Ghost size={8} /> },
  { name: "الارتقاء الروحي", icon: <Sparkles size={8} /> },
  { name: "تصميم المشاهد", icon: <Layers size={8} /> },
  { name: "الإيقاع السردي", icon: <Activity size={8} /> },
  { name: "الصوت الداخلي", icon: <Brain size={8} /> },
  { name: "جماليات القسوة", icon: <Flame size={8} /> },
  { name: "السحر والتعاويذ", icon: <Zap size={8} /> },
  { name: "الأساطير القديمة", icon: <BookOpen size={8} /> },
  { name: "الدراما النفسية", icon: <Brain size={8} /> },
  { name: "الوصف المكاني", icon: <Globe size={8} /> },
  { name: "صراع المعتقدات", icon: <ShieldCheck size={8} /> },
  { name: "التحول في الشخصيات", icon: <Activity size={8} /> },
  { name: "النهايات الملحمية", icon: <Sparkles size={8} /> },
  { name: "السريالية", icon: <Ghost size={8} /> },
  { name: "الفلسفة العدمية", icon: <Eye size={8} /> },
  { name: "الإبداع المطلق", icon: <Feather size={8} /> },
];

const NeuralGrid: React.FC<NeuralGridProps> = ({ stage }) => {
  const [nodes, setNodes] = useState<NodeStatus[]>([]);
  
  // Initialize 76 Nodes
  useEffect(() => {
    const initialNodes: NodeStatus[] = [];
    
    // 1. Logic Workers (0-29)
    for (let i = 0; i < 30; i++) {
      initialNodes.push({
        id: i,
        type: 'worker_logic',
        status: 'idle',
        load: 5 + Math.random() * 10,
        specialization: LOGIC_SPECIALIZATIONS[i]?.name || "تحليل"
      });
    }
    
    // 2. Creative Workers (30-59)
    for (let i = 0; i < 30; i++) {
      initialNodes.push({
        id: i + 30,
        type: 'worker_creative',
        status: 'idle',
        load: 5 + Math.random() * 10,
        specialization: CREATIVE_SPECIALIZATIONS[i]?.name || "إبداع"
      });
    }

    // 3. Consciousness Workers (60-69) [NEW]
    for (let i = 0; i < 10; i++) {
        initialNodes.push({
            id: i + 60,
            type: 'worker_consciousness',
            status: 'idle',
            load: 10 + Math.random() * 20,
            specialization: CONSCIOUSNESS_SPECIALIZATIONS[i]?.name || "وعي"
        });
    }

    // 4. Logic Reviewers (70-72)
    for (let i = 70; i < 73; i++) {
      initialNodes.push({
        id: i,
        type: 'reviewer_logic',
        status: 'idle',
        load: 0,
        specialization: "تدقيق المنطق"
      });
    }

    // 5. Narrative Reviewers (73-75)
    for (let i = 73; i < 76; i++) {
      initialNodes.push({
        id: i,
        type: 'reviewer_narrative',
        status: 'idle',
        load: 0,
        specialization: "هندسة السرد"
      });
    }

    setNodes(initialNodes);
  }, []);

  // Animation Loop
  useEffect(() => {
    const interval = setInterval(() => {
      setNodes(prev => prev.map(node => {
        let targetStatus: NodeStatus['status'] = 'idle';
        let loadChange = (Math.random() - 0.5) * 5;

        // LOGIC SWARM BEHAVIOR
        if (node.type === 'worker_logic') {
           if (stage === ProcessingStage.ANALYZING || stage === ProcessingStage.DISTRIBUTING) {
             if (Math.random() > 0.5) targetStatus = 'analyzing';
             loadChange += 10;
           }
        } 
        
        // CREATIVE SWARM BEHAVIOR
        if (node.type === 'worker_creative') {
           if (stage === ProcessingStage.CREATING || stage === ProcessingStage.ANALYZING) {
             if (Math.random() > 0.4) targetStatus = 'dreaming'; // Creative nodes "dream"
             loadChange += 12;
           }
        }

        // CONSCIOUSNESS SWARM BEHAVIOR
        if (node.type === 'worker_consciousness') {
            if (stage !== ProcessingStage.IDLE) {
                // Consciousness is almost always active during processing to guide flow
                if (Math.random() > 0.3) targetStatus = 'flow';
                loadChange += 5;
            }
        }

        // REVIEWER BEHAVIOR
        if (stage === ProcessingStage.REVIEWING || stage === ProcessingStage.SYNTHESIZING) {
            if (node.type === 'reviewer_logic') targetStatus = 'reviewing';
            if (node.type === 'reviewer_narrative') targetStatus = 'reviewing';
            loadChange += 8;
        }

        let newLoad = Math.min(100, Math.max(2, node.load + loadChange));
        if (stage === ProcessingStage.IDLE) {
            newLoad = Math.max(2, newLoad * 0.92);
            targetStatus = 'idle';
        }

        return { ...node, status: targetStatus, load: newLoad };
      }));
    }, 100);

    return () => clearInterval(interval);
  }, [stage]);

  const logicWorkers = nodes.filter(n => n.type === 'worker_logic');
  const creativeWorkers = nodes.filter(n => n.type === 'worker_creative');
  const consciousnessWorkers = nodes.filter(n => n.type === 'worker_consciousness');
  const logicReviewers = nodes.filter(n => n.type === 'reviewer_logic');
  const narrativeReviewers = nodes.filter(n => n.type === 'reviewer_narrative');

  return (
    <div className="flex flex-col gap-3 w-full">
      
      {/* TRI-CORE PROCESSING UNIT */}
      <div className="flex gap-2 h-auto">
          
          {/* LEFT: LOGIC CORE (45% width) */}
          <div className="flex-1 bg-black/40 border border-emerald-900/30 rounded-lg p-2 overflow-hidden">
             <div className="flex justify-between items-center mb-2 relative z-10">
                 <span className="text-[9px] font-mono text-emerald-500/80 uppercase tracking-wider flex items-center gap-1">
                    <Cpu size={8} /> Logic (30)
                 </span>
             </div>
             <div className="grid grid-cols-5 gap-1 relative z-10">
                {logicWorkers.map((node, i) => {
                    const isActive = node.status === 'analyzing';
                    return (
                        <div key={node.id} className={`h-5 w-full rounded-sm transition-all duration-300 relative group border ${isActive ? 'bg-emerald-500/20 border-emerald-500/50 shadow-[0_0_4px_rgba(16,185,129,0.4)]' : 'bg-zinc-900/50 border-zinc-800'}`}>
                            <div className="absolute bottom-0 left-0 w-full bg-emerald-500/40 transition-all" style={{ height: `${node.load}%` }} />
                            <div className="absolute inset-0 flex items-center justify-center opacity-60 group-hover:opacity-100">
                                {LOGIC_SPECIALIZATIONS[i]?.icon}
                            </div>
                        </div>
                    );
                })}
             </div>
          </div>

          {/* CENTER: GOLDEN CONSCIOUSNESS SPINE (10% width) */}
          <div className="w-12 bg-black/40 border border-amber-500/30 rounded-lg p-1 overflow-hidden flex flex-col gap-1">
             {consciousnessWorkers.map((node, i) => {
                 const isActive = node.status === 'flow';
                 return (
                    <div key={node.id} className={`flex-1 w-full rounded-sm transition-all duration-500 relative border flex items-center justify-center ${isActive ? 'bg-amber-500/20 border-amber-500/60 shadow-[0_0_6px_rgba(245,158,11,0.5)]' : 'bg-zinc-900/50 border-zinc-800'}`}>
                         <div className={`transition-all duration-500 ${isActive ? 'text-amber-300 scale-110' : 'text-zinc-700 scale-90'}`}>
                             {CONSCIOUSNESS_SPECIALIZATIONS[i]?.icon}
                         </div>
                    </div>
                 )
             })}
          </div>

          {/* RIGHT: GENESIS CORE (45% width) */}
          <div className="flex-1 bg-black/40 border border-purple-900/30 rounded-lg p-2 overflow-hidden">
             <div className="flex justify-between items-center mb-2 relative z-10">
                 <span className="text-[9px] font-mono text-purple-400/80 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles size={8} /> Genesis (30)
                 </span>
             </div>
             <div className="grid grid-cols-5 gap-1 relative z-10">
                {creativeWorkers.map((node, i) => {
                    const isActive = node.status === 'dreaming';
                    return (
                        <div key={node.id} className={`h-5 w-full rounded-sm transition-all duration-300 relative group border ${isActive ? 'bg-purple-500/20 border-purple-500/50 shadow-[0_0_4px_rgba(168,85,247,0.4)]' : 'bg-zinc-900/50 border-zinc-800'}`}>
                            <div className="absolute bottom-0 left-0 w-full bg-purple-500/40 transition-all" style={{ height: `${node.load}%` }} />
                            <div className={`absolute inset-0 flex items-center justify-center opacity-60 group-hover:opacity-100 ${isActive ? 'text-purple-300' : 'text-zinc-600'}`}>
                                {CREATIVE_SPECIALIZATIONS[i]?.icon}
                            </div>
                        </div>
                    );
                })}
             </div>
          </div>

      </div>

      {/* CENTRAL BUS */}
      <div className="h-2 w-full flex items-center justify-center relative">
          <div className="w-full h-[1px] bg-gradient-to-r from-emerald-900 via-amber-500/50 to-purple-900"></div>
          {stage !== ProcessingStage.IDLE && (
              <div className="absolute w-2 h-2 bg-amber-100 rounded-full shadow-[0_0_10px_#fbbf24] animate-ping"></div>
          )}
      </div>

      {/* REVIEWER CORES (Split Logic/Narrative) */}
      <div className="bg-zinc-900/20 border border-zinc-800/60 rounded-lg p-2 backdrop-blur-sm">
          <div className="flex justify-between mb-2">
              <span className="text-[9px] text-zinc-500 font-mono uppercase">Arbitration Layer (6 Cores)</span>
          </div>
          <div className="grid grid-cols-6 gap-2">
              {/* 3 Logic Reviewers */}
              {logicReviewers.map((node) => (
                  <div key={node.id} className={`h-10 border rounded flex items-center justify-center transition-all ${node.status === 'reviewing' ? 'border-emerald-500 text-emerald-400 bg-emerald-900/10' : 'border-zinc-800 text-zinc-700'}`}>
                      <ShieldCheck size={14} />
                  </div>
              ))}
              {/* 3 Narrative Reviewers */}
              {narrativeReviewers.map((node) => (
                  <div key={node.id} className={`h-10 border rounded flex items-center justify-center transition-all ${node.status === 'reviewing' ? 'border-purple-500 text-purple-400 bg-purple-900/10' : 'border-zinc-800 text-zinc-700'}`}>
                      <Feather size={14} />
                  </div>
              ))}
          </div>
      </div>
    </div>
  );
};

export default NeuralGrid;
