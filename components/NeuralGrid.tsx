
import React, { useEffect, useState } from 'react';
import { NodeStatus, ProcessingStage } from '../types';
import { Cpu, ShieldCheck, Zap, Brain, Database, Activity, Code, Globe, Layers, Feather, PenTool, BookOpen, Flame, Ghost, Sparkles, Eye, Sun, Infinity, Users, Heart, Lightbulb, Archive, ScanEye, Mic2, Palette, Music, Wind, GitMerge, Hammer, MessageSquare, Scroll, Swords, Smile, Moon, Compass, Search, Scissors, CloudFog, Anchor, Scale, Gavel, Skull, Monitor, Watch, Map, Flag, Lock, Flower, Star, Hash, Box, Binary, Sigma, FileDigit, Thermometer, Fingerprint, Hourglass, Key, Link, Microscope, Radio, Rocket, Signal, Terminal, Umbrella, Video, Wifi, Wrench } from 'lucide-react';

interface NeuralGridProps {
  stage: ProcessingStage;
}

// --- LOGIC SPECIALIZATIONS (Will cycle for 180 Nodes) ---
const LOGIC_SPECIALIZATIONS = [
  // Sciences & Math
  "الرياضيات المتقدمة", "الفيزياء الكونية", "الكيمياء العضوية", "البيولوجيا التطورية", "علم الأعصاب",
  "فيزياء الكم", "الديناميكا الحرارية", "علم الفلك", "الجيولوجيا", "علم الوراثة",
  "الإحصاء والاحتمالات", "الخوارزميات", "المنطق الصوري", "نظرية الألعاب", "علم التشفير",
  "الهندسة العكسية", "تحليل البيانات", "الذكاء الاصطناعي", "الأمن السيبراني", "الشبكات العصبية",
  // History & Society
  "التاريخ القديم", "عصر النهضة", "تاريخ الحروب", "علم الاجتماع", "الانثروبولوجيا",
  "علم الآثار", "الأديان المقارنة", "الميثولوجيا", "الفولكلور", "تطور اللغات",
  "الجغرافيا السياسية", "الاقتصاد الكلي", "التجارة العالمية", "القانون الدولي", "الأنظمة السياسية",
  "الاستراتيجية العسكرية", "التكتيكات الحربية", "اللوجستيات", "إدارة الأزمات", "علم النفس الجماهيري",
  // Psychology & Philosophy
  "علم النفس السريري", "التحليل النفسي (Freud)", "اللاوعي الجمعي (Jung)", "السلوكية", "علم النفس المعرفي",
  "الفلسفة الوجودية", "العدمية", "الرواقية", "الميتافيزيقا", "الأخلاقيات",
  "المنطق الفلسفي", "نظرية المعرفة", "الجماليات", "فلسفة اللغة", "فلسفة العقل",
  // Structural & Systems
  "بناء العوالم (Worldbuilding)", "أنظمة السحر الصلبة", "التسلسل الزمني", "السببية", "تحليل الحبكة",
  "اكتشاف الثغرات", "الاتساق الداخلي", "إدارة الموارد", "الهندسة المعمارية", "التخطيط الحضري",
  "علم الجريمة", "الطب الشرعي", "التحقيق الجنائي", "تحليل الدوافع", "لغة الجسد",
  "الاقتصاد الجزئي", "العملات الرقمية", "أنظمة الحكم", "البيروقراطية", "التنظيم الاجتماعي"
];

// --- GENESIS SPECIALIZATIONS (Will cycle for 130 Nodes) ---
const CREATIVE_SPECIALIZATIONS = [
  "السرد الملحمي", "الرعب الكوني", "الفانتازيا المظلمة", "Xianxia (الزراعة)", "الخيال العلمي الصلب",
  "السايبربانك", "الواقعية السحرية", "الرومانسية القوطية", "التراجيديا", "الكوميديا السوداء",
  "الغموض والتشويق", "الرعب النفسي", "أدب الديستوبيا", "أدب اليوتوبيا", "الستيم بانك",
  "Space Opera", "Grimdark", "LitRPG", "Isekai", "Slice of Life",
  "الوصف الحسي", "التدفق الشعوري", "الرمزية", "الاستعارة", "التناص",
  "بناء الغلاف الجوي", "الإضاءة والظلال", "الألوان والمزاج", "الموسيقى في النص", "الصمت البليغ",
  "تصميم الوحوش", "تصميم الأزياء", "تصميم الأسلحة", "المأكولات الخيالية", "اللغات المختلقة",
  "الطقوس السحرية", "الأعياد والمهرجانات", "العادات والتقاليد", "الأساطير المؤسسة", "النبوءات",
  "الحوار الداخلي", "تيار الوعي", "الراوي غير الموثوق", "كسر الجدار الرابع", "السرد غير الخطي",
  "الذروة الدرامية", "التقلبات (Twists)", "النهايات المفتوحة", "التطهير (Catharsis)", "الأمل اليائس",
  "النوستالجيا", "الملنخوليا", "النشوة", "الغضب المقدس", "السكينة",
  "جماليات القبح", "الغرائبية", "العبثية", "السريالية", "الخيال الجامح"
];

// --- NARRATIVE TITANS (Will cycle for 110 Nodes) ---
const NARRATIVE_TITANS = [
  { name: "Weaver (الحائك)", icon: <GitMerge size={6} /> }, { name: "Painter (الرسام)", icon: <Palette size={6} /> },
  { name: "Bard (الشاعر)", icon: <Music size={6} /> }, { name: "Psychopomp (المرشد)", icon: <Wind size={6} /> },
  { name: "Architect (المهندس)", icon: <Hammer size={6} /> }, { name: "Dialogist (المحاور)", icon: <MessageSquare size={6} /> },
  { name: "Chronicler (المؤرخ)", icon: <Scroll size={6} /> }, { name: "Tactician (التكتيكي)", icon: <Swords size={6} /> },
  { name: "Jester (المهرج)", icon: <Smile size={6} /> }, { name: "Shadow (الظل)", icon: <Moon size={6} /> },
  { name: "Lover (العاشق)", icon: <Heart size={6} /> }, { name: "Sage (الحكيم)", icon: <BookOpen size={6} /> },
  { name: "Alchemist (الكيميائي)", icon: <Zap size={6} /> }, { name: "Pathfinder (المستكشف)", icon: <Compass size={6} /> },
  { name: "Polisher (الصاقل)", icon: <Scissors size={6} /> }, { name: "Dreamer (الحالم)", icon: <CloudFog size={6} /> },
  { name: "Oracle (العراف)", icon: <Sparkles size={6} /> }, { name: "Judge (القاضي)", icon: <Gavel size={6} /> },
  { name: "Beast (الغريزة)", icon: <Skull size={6} /> }, { name: "Mirror (المرآة)", icon: <Monitor size={6} /> },
  { name: "Clockmaker (الزمن)", icon: <Watch size={6} /> }, { name: "Cartographer (الخرائط)", icon: <Map size={6} /> },
  { name: "Diplomat (الدبلوماسي)", icon: <Flag size={6} /> }, { name: "Rebel (الثائر)", icon: <Flame size={6} /> },
  { name: "Monk (الزاهد)", icon: <Hash size={6} /> }, { name: "Seducer (المغوي)", icon: <Flower size={6} /> },
  { name: "Void (العدم)", icon: <Ghost size={6} /> }, { name: "Puppeteer (المتلاعب)", icon: <Activity size={6} /> },
  { name: "Surgeon (الجراح)", icon: <Scissors size={6} /> }, { name: "Botanist (النمو)", icon: <Flower size={6} /> },
  { name: "Astronomer (الفضاء)", icon: <Star size={6} /> }, { name: "Anchor (المرساة)", icon: <Anchor size={6} /> },
  { name: "Mechanic (الميكانيكي)", icon: <Wrench size={6} /> }, { name: "Navigator (الملاح)", icon: <Rocket size={6} /> },
  { name: "Thief (اللص)", icon: <Key size={6} /> }, { name: "Scholar (الباحث)", icon: <Search size={6} /> },
  { name: "Warden (السجان)", icon: <Lock size={6} /> }, { name: "Hymnist (المنشد)", icon: <Mic2 size={6} /> },
  { name: "Smith (الحداد)", icon: <Hammer size={6} /> }, { name: "Gambler (المقامر)", icon: <Binary size={6} /> },
  { name: "Ghost (الشبح)", icon: <Ghost size={6} /> }, { name: "Hunter (الصياد)", icon: <ScanEye size={6} /> },
  { name: "Chef (الطاهي)", icon: <Thermometer size={6} /> }, { name: "Merchant (التاجر)", icon: <Scale size={6} /> },
  { name: "Spy (الجاسوس)", icon: <Radio size={6} /> }, { name: "Hermit (الناسك)", icon: <Umbrella size={6} /> },
  { name: "King (الملك)", icon: <Sun size={6} /> }, { name: "Fool (الأحمق)", icon: <Smile size={6} /> },
  { name: "Scribe (الناسخ)", icon: <PenTool size={6} /> }, { name: "Director (المخرج)", icon: <Video size={6} /> }
];

// --- CONSCIOUSNESS SPECIALIZATIONS (Will cycle for 60 Nodes) ---
const CONSCIOUSNESS_SPECIALIZATIONS = [
    "الوعي الجمعي", "الذاكرة الضمنية", "Jungian Shadow", "Archetypes", "Ego-Core",
    "الحدس", "التدفق", "الضمير", "التعاطف", "البصيرة",
    "التسامي", "الوجودية", "الإرادة الحرة", "القدر", "الكارما",
    "الذكريات المكبوتة", "الأحلام", "الديجافو", "التزامن", "الروحانيات",
    "تجارب الماضي", "الحكمة المكتسبة", "الهوية", "الغاية", "الخلود"
];

const NeuralGrid: React.FC<NeuralGridProps> = ({ stage }) => {
  const [nodes, setNodes] = useState<NodeStatus[]>([]);
  
  // Initialize 500 Nodes
  useEffect(() => {
    const initialNodes: NodeStatus[] = [];
    let idCounter = 0;
    
    // 1. Logic Core (180 Nodes)
    for (let i = 0; i < 180; i++) {
      initialNodes.push({
        id: idCounter++,
        type: 'worker_logic',
        status: 'idle',
        load: 10 + Math.random() * 10,
        specialization: LOGIC_SPECIALIZATIONS[i % LOGIC_SPECIALIZATIONS.length]
      });
    }
    
    // 2. Genesis Swarm (130 Nodes)
    for (let i = 0; i < 130; i++) {
      initialNodes.push({
        id: idCounter++,
        type: 'worker_creative',
        status: 'idle',
        load: 10 + Math.random() * 10,
        specialization: CREATIVE_SPECIALIZATIONS[i % CREATIVE_SPECIALIZATIONS.length]
      });
    }

    // 3. Consciousness Hub (60 Nodes)
    for (let i = 0; i < 60; i++) {
        initialNodes.push({
            id: idCounter++,
            type: 'worker_consciousness',
            status: 'idle',
            load: 20 + Math.random() * 20,
            specialization: CONSCIOUSNESS_SPECIALIZATIONS[i % CONSCIOUSNESS_SPECIALIZATIONS.length]
        });
    }

    // 4. Narrative Titans (110 Nodes)
    for(let i = 0; i < 110; i++) {
        const titan = NARRATIVE_TITANS[i % NARRATIVE_TITANS.length];
        initialNodes.push({
            id: idCounter++,
            type: 'worker_narrator',
            status: 'idle',
            load: 5,
            specialization: titan.name
        });
    }

    // 5. The Pale Archive (10 Nodes)
    initialNodes.push({ id: idCounter++, type: 'worker_sentinel', status: 'scanning', load: 100, specialization: "Sentinel Alpha" });
    initialNodes.push({ id: idCounter++, type: 'worker_sentinel', status: 'scanning', load: 100, specialization: "Sentinel Beta" });
    initialNodes.push({ id: idCounter++, type: 'worker_triad', status: 'idle', load: 0, specialization: "Triad Alpha" });
    initialNodes.push({ id: idCounter++, type: 'worker_triad', status: 'idle', load: 0, specialization: "Triad Beta" });
    initialNodes.push({ id: idCounter++, type: 'worker_triad', status: 'idle', load: 0, specialization: "Triad Gamma" });
    initialNodes.push({ id: idCounter++, type: 'worker_triad', status: 'idle', load: 0, specialization: "Triad Delta" });
    initialNodes.push({ id: idCounter++, type: 'worker_triad', status: 'idle', load: 0, specialization: "Triad Omega" });
    initialNodes.push({ id: idCounter++, type: 'worker_archivist', status: 'idle', load: 0, specialization: "Archivist Prime" });
    initialNodes.push({ id: idCounter++, type: 'worker_archivist', status: 'idle', load: 0, specialization: "Archivist Secundus" });
    initialNodes.push({ id: idCounter++, type: 'worker_archivist', status: 'idle', load: 0, specialization: "Archivist Tertius" });

    // 6. The Arbiters (10 Nodes)
    for (let i = 0; i < 10; i++) {
      initialNodes.push({
        id: idCounter++,
        type: i < 5 ? 'reviewer_logic' : 'reviewer_narrative',
        status: 'idle',
        load: 5,
        specialization: "Arbiter"
      });
    }

    setNodes(initialNodes);
  }, [stage]);

  // Update Logic
  useEffect(() => {
    setNodes(prev => prev.map(node => {
        let newStatus: NodeStatus['status'] = 'idle';
        let newLoad = 5;
        
        if (stage === ProcessingStage.ANALYZING && node.type === 'worker_logic') {
            newStatus = 'analyzing';
            newLoad = 70 + Math.random() * 30;
        } else if (stage === ProcessingStage.CREATING && node.type === 'worker_creative') {
            newStatus = 'dreaming';
            newLoad = 70 + Math.random() * 30;
        } else if (stage === ProcessingStage.FLOWING && node.type === 'worker_consciousness') {
            newStatus = 'flow';
            newLoad = 90 + Math.random() * 10;
        } else if (stage === ProcessingStage.REVIEWING && (node.type.includes('reviewer'))) {
            newStatus = 'reviewing';
            newLoad = 90;
        } else if (stage === ProcessingStage.SYNTHESIZING && (node.type === 'worker_triad' || node.type === 'worker_archivist')) {
             newStatus = 'synthesizing';
             newLoad = 100;
        } else if (stage === ProcessingStage.WEAVING && node.type === 'worker_narrator') {
            newStatus = 'weaving';
            newLoad = 100;
        } else if (node.type === 'worker_sentinel') {
             newStatus = 'scanning';
             newLoad = 60 + Math.random() * 10;
        }
        
        return { ...node, status: newStatus, load: newLoad };
    }));
  }, [stage]);

  return (
    <div className="flex flex-col gap-1 w-full">
      
      {/* TOP ROW: LOGIC (Left) | CONSCIOUSNESS (Mid) | CREATIVE (Right) */}
      <div className="flex gap-1 h-[260px]">
          {/* 180 Logic Nodes */}
          <div className="flex-1 bg-zinc-900/30 border border-emerald-900/30 rounded-sm p-1.5 relative overflow-hidden flex flex-col">
              <div className="text-[8px] font-mono text-emerald-600/70 mb-1 uppercase tracking-widest flex justify-between">
                  <span>Logic Core</span>
                  <span>180</span>
              </div>
              <div className="flex-1 grid grid-cols-15 gap-[2px] content-start">
                  {nodes.filter(n => n.type === 'worker_logic').map(node => (
                      <div key={node.id} className={`aspect-square rounded-[1px] transition-all duration-300 ${node.status === 'analyzing' ? 'bg-emerald-400 shadow-[0_0_5px_rgba(52,211,153,0.8)]' : 'bg-emerald-900/20'}`} title={node.specialization} />
                  ))}
              </div>
          </div>

          {/* 60 Consciousness Nodes */}
          <div className="w-24 bg-amber-950/10 border border-amber-900/30 rounded-sm p-1.5 flex flex-col relative overflow-hidden">
               <div className="absolute inset-0 bg-amber-500/5 animate-pulse"></div>
               <div className="text-[8px] font-mono text-amber-500/70 mb-1 text-center uppercase">Soul (60)</div>
               <div className="flex-1 grid grid-cols-4 gap-1 content-start">
                   {nodes.filter(n => n.type === 'worker_consciousness').map(node => (
                       <div key={node.id} className={`w-full aspect-square rounded-[1px] transition-all duration-500 ${node.status === 'flow' ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]' : 'bg-amber-900/20'}`} title={node.specialization}></div>
                   ))}
               </div>
          </div>

          {/* 130 Genesis Nodes */}
          <div className="flex-1 bg-zinc-900/30 border border-purple-900/30 rounded-sm p-1.5 relative overflow-hidden flex flex-col">
              <div className="text-[8px] font-mono text-purple-600/70 mb-1 text-right uppercase tracking-widest flex justify-between flex-row-reverse">
                  <span>Genesis Swarm</span>
                  <span>130</span>
              </div>
               <div className="flex-1 grid grid-cols-12 gap-[2px] content-start direction-rtl">
                  {nodes.filter(n => n.type === 'worker_creative').map(node => (
                      <div key={node.id} className={`aspect-square rounded-[1px] transition-all duration-300 ${node.status === 'dreaming' ? 'bg-purple-400 shadow-[0_0_5px_rgba(192,132,252,0.8)]' : 'bg-purple-900/20'}`} title={node.specialization} />
                  ))}
              </div>
          </div>
      </div>

      {/* MIDDLE ROW: NARRATIVE TITANS (110) */}
      <div className="h-[120px] bg-cyan-950/10 border border-cyan-900/30 rounded-sm p-1.5 relative overflow-hidden flex flex-col">
           <div className="flex justify-between items-center mb-1">
               <div className="text-[8px] font-mono text-cyan-500/70 uppercase tracking-widest">Narrative Engine (110 Titans)</div>
               <Feather size={10} className="text-cyan-500/50" />
           </div>
           <div className="flex-1 grid grid-cols-14 gap-1">
               {nodes.filter(n => n.type === 'worker_narrator').map((node, idx) => (
                   <div key={node.id} className={`flex items-center justify-center transition-all duration-500 ${node.status === 'weaving' ? 'scale-110' : 'opacity-50'}`} title={node.specialization}>
                       <div className={`w-full h-full rounded-[2px] flex items-center justify-center ${node.status === 'weaving' ? 'bg-cyan-500 text-black shadow-lg' : 'bg-cyan-900/20 text-cyan-700'}`}>
                            {/* Cycle through icons based on original array length to match specialization */}
                           {NARRATIVE_TITANS[idx % NARRATIVE_TITANS.length]?.icon || <PenTool size={6} />}
                       </div>
                   </div>
               ))}
           </div>
      </div>

      {/* BOTTOM ROW: ARCHIVE & ARBITERS */}
      <div className="flex gap-1 h-14">
           {/* Pale Archive (10) */}
           <div className="flex-[2] bg-[#050c05] border border-[#1f2e1f] rounded-sm p-2 relative overflow-hidden flex items-center gap-4">
                <div className="absolute inset-0 opacity-[0.1] mix-blend-overlay" style={{ backgroundImage: `repeating-linear-gradient(45deg, #000 0, #000 2px, transparent 2px, transparent 10px)` }}></div>
                
                {/* Sentinel Group */}
                <div className="flex flex-col items-center gap-1 z-10">
                    <div className="flex gap-1">
                        {nodes.filter(n => n.type === 'worker_sentinel').map(n => (
                            <div key={n.id} className="w-4 h-4 rounded-full border border-[#86efac] bg-[#064e3b]/30 flex items-center justify-center shadow-[0_0_10px_rgba(134,239,172,0.2)] animate-pulse">
                                <ScanEye size={8} className="text-[#86efac]" />
                            </div>
                        ))}
                    </div>
                    <span className="text-[6px] font-mono text-[#86efac] uppercase">Sentinels</span>
                </div>

                {/* Triad Group */}
                <div className="flex-1 flex items-center justify-center gap-1 z-10 border-l border-r border-[#1f2e1f]/50 px-4">
                     {nodes.filter(n => n.type === 'worker_triad').map(node => (
                         <div key={node.id} className={`h-6 w-1.5 rounded-sm transition-all duration-300 ${node.status === 'synthesizing' ? 'bg-[#86efac] shadow-[0_0_10px_rgba(134,239,172,0.8)]' : 'bg-[#064e3b]/20 border border-[#065f46]'}`} title={node.specialization} />
                     ))}
                </div>

                {/* Archivist Group */}
                <div className="flex flex-col items-center gap-1 z-10">
                     <div className="flex gap-1">
                        {nodes.filter(n => n.type === 'worker_archivist').map(n => (
                             <div key={n.id} className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${n.status === 'synthesizing' ? 'bg-[#86efac] text-black' : 'border-[#86efac] text-[#86efac] bg-transparent'}`}>
                                 <Archive size={8} />
                             </div>
                        ))}
                     </div>
                     <span className="text-[6px] font-mono text-[#86efac] uppercase">Archivists</span>
                </div>
           </div>

           {/* Arbiters (10) */}
           <div className="flex-1 bg-blue-950/10 border border-blue-900/30 rounded-sm p-2 flex items-center justify-center gap-1.5 flex-wrap">
                {nodes.filter(n => n.type.includes('reviewer')).map(node => (
                    <div key={node.id} className={`w-3.5 h-3.5 rounded-sm flex items-center justify-center transition-all ${node.status === 'reviewing' ? 'bg-blue-500 text-white shadow-lg scale-110' : 'bg-blue-900/20 text-blue-700'}`} title={node.specialization}>
                        <ShieldCheck size={8} />
                    </div>
                ))}
           </div>
      </div>
    </div>
  );
};

export default NeuralGrid;
