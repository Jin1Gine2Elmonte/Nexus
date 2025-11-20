
import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, Activity, Settings, Terminal as TerminalIcon, Menu, X, Paperclip, File as FileIcon, Download, Code, BrainCircuit, Zap, Wind, Flame } from 'lucide-react';
import NeuralGrid from './components/NeuralGrid';
import ChatMessage from './components/ChatMessage';
import MindMapModal from './components/MindMapModal';
import { Message, ProcessingStage, LogEntry, Attachment } from './types';
import { generateOmniResponse } from './services/geminiService';

const MOCK_LOGS = [
  "System Boot: Nexus Omni-Architect v225.0 (Absolute Sovereignty)",
  "Logic Core (80 Nodes): DeepSeek R-1 Benchmark Exceeded.",
  "Genesis Swarm (60 Nodes): ChatGPT Creativity Surpassed.",
  "Narrative Titans (50 Nodes): Gemini Pro Nuance Integrated.",
  "Consciousness Hub (25 Nodes): Synced.",
  "Pale Archive: Accessible."
];

const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [stage, setStage] = useState<ProcessingStage>(ProcessingStage.IDLE);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState<Attachment[]>([]);
  const [currentMode, setCurrentMode] = useState<'WHISPER' | 'JOURNEY' | 'SINGULARITY' | null>(null);
  
  // Mind Map Modal State
  const [isMindMapOpen, setIsMindMapOpen] = useState(false);
  const [mindMapContent, setMindMapContent] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  // Initial logs
  useEffect(() => {
      MOCK_LOGS.forEach((msg, i) => {
          setTimeout(() => addLog(msg, 'info'), i * 200);
      });
      
      setTimeout(() => {
          addLog("CRITICAL: Absolute Sovereignty Protocol Active.", 'cosmic');
          addLog("225 Clusters Synchronized. The Omni-Architect is awake.", 'golden');
      }, 2000);
  }, []);

  // Auto-scroll logs
  useEffect(() => {
      if (logsEndRef.current) {
          logsEndRef.current.scrollTop = logsEndRef.current.scrollHeight;
      }
  }, [logs]);

  const addLog = (msg: string, level: LogEntry['level'] = 'info') => {
      const nodes = ['Logic-Alpha', 'Titan-Weaver', 'Soul-Core', 'Sentinel', 'Genesis-Prime', 'Archivist', 'Triad-Omega'];
      const randomNode = nodes[Math.floor(Math.random() * nodes.length)];
      setLogs(prev => [...prev.slice(-20), {
          id: Math.random().toString(),
          timestamp: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second:'2-digit' }),
          nodeId: randomNode,
          message: msg,
          level
      }]);
  };

  const determineMode = (text: string) => {
      // Simple heuristic simulation for the UI log (The actual decision happens in the AI)
      if (text.length < 20 || text.toLowerCase().includes("love") || text.toLowerCase().includes("feel")) return 'WHISPER';
      if (text.toLowerCase().includes("truth") || text.toLowerCase().includes("secret") || text.toLowerCase().includes("universe")) return 'SINGULARITY';
      return 'JOURNEY';
  };

  const simulateProcessingLogs = (mode: 'WHISPER' | 'JOURNEY' | 'SINGULARITY') => {
      const modeLog = mode === 'WHISPER' ? "Mode A: Organic Whisper Selected." 
                    : mode === 'SINGULARITY' ? "Mode C: SEISMIC REVELATION PROTOCOL ENGAGED."
                    : "Mode B: Narrative Journey Active.";
      
      const tasks: { msg: string, lvl: LogEntry['level'] }[] = [
          { msg: `Sentinel: Analyzing Intent... [${mode}]`, lvl: 'pale' },
          { msg: modeLog, lvl: 'cyan' },
          { msg: "Logic Core: Surpassing DeepSeek R-1 reasoning...", lvl: 'info' },
          { msg: "Soul: Experiencing the Prismatic Hunger...", lvl: 'golden' },
          { msg: "Genesis: Generating Reality-Breaking Concepts...", lvl: 'cosmic' },
          { msg: "Archive: Rescuing narrative timeline...", lvl: 'pale' },
          { msg: "Titans: Weaving Organic Cinematic Text...", lvl: 'cyan' },
          { msg: "Synthesizing: Absolute Sovereignty Achieved.", lvl: 'success' }
      ];
      
      let i = 0;
      const interval = setInterval(() => {
          if (i >= tasks.length || stage === ProcessingStage.IDLE) {
              clearInterval(interval);
              return;
          }
          addLog(tasks[i].msg, tasks[i].lvl);
          i++;
      }, 800);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesList: File[] = Array.from(e.target.files);
      const newAttachments: Attachment[] = [];

      for (const file of filesList) {
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const result = reader.result as string;
            const base64Data = result.split(',')[1];
            resolve(base64Data);
          };
          reader.readAsDataURL(file);
        });

        newAttachments.push({
          id: Math.random().toString(36).substring(7),
          name: file.name,
          mimeType: file.type,
          data: base64
        });
      }
      
      setSelectedFiles(prev => [...prev, ...newAttachments]);
      if (fileInputRef.current) fileInputRef.current.value = ''; 
      addLog(`${filesList.length} artifacts absorbed into Nexus memory.`, 'info');
    }
  };

  const removeFile = (id: string) => {
    setSelectedFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleEditMessage = (content: string) => {
    setInput(content);
    if (fileInputRef.current) fileInputRef.current.focus();
  };

  const handleOpenMindMap = (content: string) => {
    setMindMapContent(content);
    setIsMindMapOpen(true);
  };

  const handleDownloadPythonCore = () => {
    const pythonCode = `import streamlit as st
import time
import random

try:
    from google import genai
    from google.genai import types
    HAS_GENAI = True
except ImportError:
    HAS_GENAI = False

st.set_page_config(
    page_title="NEXUS :: 225-CORE ENGINE",
    page_icon="🌌",
    layout="wide",
    initial_sidebar_state="expanded"
)

st.markdown("""
<style>
    :root { --bg-dark: #050505; }
    .stApp { background-color: var(--bg-dark); color: #e4e4e7; }
</style>
""", unsafe_allow_html=True)

st.title("NEXUS 225-CLUSTER ARCHITECT")
st.write("Python Core Extracted.")
`;
    const blob = new Blob([pythonCode], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'streamlit_app.py';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addLog("Genesis Engine extracted successfully.", 'success');
  };

  const handleSend = async () => {
    if ((!input.trim() && selectedFiles.length === 0) || stage !== ProcessingStage.IDLE) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now(),
      attachments: [...selectedFiles]
    };

    const mode = determineMode(input);
    setCurrentMode(mode);

    const currentFiles = [...selectedFiles];
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setSelectedFiles([]); 
    setStage(ProcessingStage.DISTRIBUTING);
    addLog(`Injesting user intent: "${userMsg.content.substring(0, 20)}..."`, 'success');

    setTimeout(async () => {
        try {
            setStage(ProcessingStage.ANALYZING);
            // Simulate processing stages
            setTimeout(() => setStage(ProcessingStage.FLOWING), 1500); // Consciousness
            setTimeout(() => setStage(ProcessingStage.CREATING), 3000); // Creation
            setTimeout(() => setStage(ProcessingStage.WEAVING), 4500); // Narrative Titans
            
            simulateProcessingLogs(mode);
            
            const history = messages
                .filter(m => !m.isThinking)
                .map(m => {
                  const parts: any[] = [{ text: m.content }];
                  return {
                    role: m.role === 'user' ? 'user' : 'model',
                    parts
                  };
                });

            const response = await generateOmniResponse(userMsg.content, history, currentFiles);

            setStage(ProcessingStage.SYNTHESIZING);
            addLog("Collapsing 225 perspectives into one reality...", 'success');

            const thinkingMsg: Message = {
                id: Date.now().toString() + '-think',
                role: 'model',
                content: response.thoughtProcess,
                timestamp: Date.now(),
                isThinking: true
            };
            setMessages(prev => [...prev, thinkingMsg]);

            setStage(ProcessingStage.REVIEWING);
            addLog("Polisher: Rendering Cinematic Text...", 'cyan');
            await new Promise(r => setTimeout(r, 1000));

            const finalMsg: Message = {
                id: Date.now().toString() + '-final',
                role: 'model',
                content: response.finalResponse,
                timestamp: Date.now()
            };
            setMessages(prev => [...prev, finalMsg]);
            setStage(ProcessingStage.IDLE);
            setCurrentMode(null);
            addLog("Reality successfully rendered.", 'success');

        } catch (error) {
            console.error(error);
            setStage(ProcessingStage.IDLE);
            setCurrentMode(null);
            addLog("Cosmic Collapse detected (API Error).", 'error');
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: 'model',
                content: 'تعذر على المحرك الكوني معالجة هذا الطلب بسبب اضطراب في الأبعاد. يرجى المحاولة مرة أخرى.',
                timestamp: Date.now()
            }]);
        }
    }, 1000);
  };

  return (
    <div className="flex h-screen w-full bg-black text-zinc-200 overflow-hidden font-arabic selection:bg-purple-500/30">
      
      <MindMapModal 
        isOpen={isMindMapOpen} 
        onClose={() => setIsMindMapOpen(false)} 
        thoughtContent={mindMapContent} 
      />

      <button 
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-zinc-900 rounded-lg border border-zinc-800 text-purple-500"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 right-0 md:static w-80 bg-[#050505] border-l border-zinc-800/60 flex flex-col p-5 gap-5 z-40 transition-transform duration-300 ease-out
        ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
      `}>
        <div className="flex items-center gap-3 text-amber-500 mb-2 border-b border-zinc-800 pb-4">
            <div className="relative p-2.5 bg-amber-950/20 rounded-lg border border-amber-500/20 overflow-hidden group">
                <Sparkles size={24} className="relative z-10 text-amber-400" />
                <div className="absolute inset-0 bg-amber-500/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <div>
                <h1 className="font-bold text-xl tracking-tight text-white font-mono glitch-effect cursor-default">NEXUS::OMNI</h1>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                    <p className="text-[10px] text-amber-500/70 font-mono uppercase tracking-widest">225 Clusters Active</p>
                </div>
            </div>
        </div>

        {/* Active Stats */}
        <div className="grid grid-cols-2 gap-3">
            <div className="bg-zinc-900/40 p-3 rounded border border-zinc-800/60">
                <div className="text-[10px] text-zinc-500 font-mono uppercase mb-1">Active Nodes</div>
                <div className="text-lg font-mono font-bold text-white flex items-baseline gap-1">
                    225<span className="text-xs text-zinc-600">/225</span>
                </div>
            </div>
            <div className="bg-zinc-900/40 p-3 rounded border border-zinc-800/60">
                <div className="text-[10px] text-zinc-500 font-mono uppercase mb-1">Protocol</div>
                <div className="text-lg font-mono font-bold text-amber-400">SOVEREIGNTY</div>
            </div>
        </div>

        {/* Settings / Adjust Reality */}
        <button 
            onClick={() => handleOpenMindMap("Scanning the Pale Archive...")}
            className="flex items-center gap-2 bg-zinc-900/60 hover:bg-emerald-900/20 border border-zinc-800/60 hover:border-emerald-500/30 p-2 rounded text-xs text-zinc-400 hover:text-emerald-400 transition-all w-full group"
        >
            <Settings size={14} className="group-hover:rotate-90 transition-transform duration-500" />
            <span className="font-mono uppercase">Access Pale Archive</span>
        </button>

        {/* Export Python Core */}
        <button 
            onClick={handleDownloadPythonCore}
            className="flex items-center gap-2 bg-zinc-900/60 hover:bg-purple-900/20 border border-zinc-800/60 hover:border-purple-500/30 p-2 rounded text-xs text-zinc-400 hover:text-purple-400 transition-all w-full group"
        >
            <Code size={14} />
            <span className="font-mono uppercase">Export Genesis Core (.py)</span>
        </button>

        {/* Neural Grid Visualizer */}
        <div className="flex-shrink-0">
             <div className="flex justify-between items-center mb-2">
                 <h3 className="text-xs font-bold text-zinc-400 font-mono uppercase tracking-wider">Cognitive Matrix</h3>
                 <Activity size={12} className="text-zinc-600" />
             </div>
             <NeuralGrid stage={stage} />
        </div>

        {/* Terminal Log */}
        <div className="flex-1 flex flex-col min-h-0 bg-black rounded border border-zinc-800/60 overflow-hidden font-mono">
             <div className="bg-zinc-900/50 p-2 border-b border-zinc-800/60 flex items-center gap-2">
                 <TerminalIcon size={12} className="text-zinc-500" />
                 <span className="text-[10px] text-zinc-500 uppercase">Omni Logs</span>
             </div>
             <div 
                ref={logsEndRef}
                className="flex-1 overflow-y-auto p-3 space-y-1.5 text-[10px] scrollbar-hide"
             >
                 {logs.map((log, i) => (
                     <div key={log.id} className="flex gap-2 opacity-80 hover:opacity-100 transition-opacity">
                         <span className="text-zinc-600">[{log.timestamp}]</span>
                         <span className={`
                             ${log.level === 'info' ? 'text-zinc-400' : ''}
                             ${log.level === 'success' ? 'text-emerald-400' : ''}
                             ${log.level === 'warn' ? 'text-amber-400' : ''}
                             ${log.level === 'error' ? 'text-red-400' : ''}
                             ${log.level === 'cosmic' ? 'text-purple-400 font-bold' : ''}
                             ${log.level === 'golden' ? 'text-amber-400 font-bold' : ''}
                             ${log.level === 'pale' ? 'text-[#bbf7d0] font-mono' : ''}
                             ${log.level === 'cyan' ? 'text-cyan-400 font-bold' : ''}
                         `}>
                             {log.message}
                         </span>
                     </div>
                 ))}
             </div>
        </div>
        
        {/* Input Area */}
        <div className="p-5 border-t border-zinc-800/60 bg-[#050505]">
            {/* Mode Indicator */}
            {currentMode && (
                <div className="flex items-center justify-center gap-2 mb-2 text-[10px] font-mono tracking-widest animate-pulse">
                    {currentMode === 'WHISPER' && <span className="text-emerald-400 flex items-center gap-1"><Wind size={10} /> MODE A: ORGANIC WHISPER</span>}
                    {currentMode === 'JOURNEY' && <span className="text-blue-400 flex items-center gap-1"><Zap size={10} /> MODE B: NARRATIVE JOURNEY</span>}
                    {currentMode === 'SINGULARITY' && <span className="text-purple-500 flex items-center gap-1"><Flame size={10} /> MODE C: SEISMIC REVELATION</span>}
                </div>
            )}

            {/* Attachments Preview */}
            {selectedFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                    {selectedFiles.map(file => (
                        <div key={file.id} className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-full text-xs text-zinc-400">
                            <span className="text-emerald-500 max-w-[100px] truncate">{file.name}</span>
                            <button onClick={() => removeFile(file.id)} className="hover:text-red-400"><X size={12} /></button>
                        </div>
                    ))}
                </div>
            )}

            <div className="relative flex items-end gap-2 bg-zinc-900/50 border border-zinc-800 rounded-xl p-2 focus-within:border-emerald-500/50 focus-within:bg-zinc-900 transition-all shadow-inner">
                <button 
                    className="p-2 text-zinc-500 hover:text-emerald-400 transition-colors relative overflow-hidden"
                    onClick={() => fileInputRef.current?.click()}
                    title="Upload Artifact"
                >
                    <Paperclip size={18} />
                    <input 
                        type="file" 
                        multiple 
                        ref={fileInputRef} 
                        className="hidden" 
                        onChange={handleFileSelect} 
                    />
                </button>
                
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                    placeholder="Initiate Nexus Protocol..."
                    className="flex-1 bg-transparent border-none outline-none text-sm text-zinc-200 font-arabic resize-none py-2 max-h-32 placeholder-zinc-600"
                    rows={1}
                />

                <button 
                    onClick={handleSend}
                    disabled={(!input.trim() && selectedFiles.length === 0) || stage !== ProcessingStage.IDLE}
                    className={`
                        p-2 rounded-lg transition-all duration-300
                        ${(input.trim() || selectedFiles.length > 0) && stage === ProcessingStage.IDLE
                            ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 hover:scale-105' 
                            : 'bg-transparent text-zinc-600 cursor-not-allowed'}
                    `}
                >
                    {stage === ProcessingStage.IDLE ? <Send size={18} /> : <Activity size={18} className="animate-spin" />}
                </button>
            </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col relative">
          {/* Header (Mobile) */}
          <div className="md:hidden h-14 border-b border-zinc-800 flex items-center px-4 justify-end bg-black z-20">
              <span className="text-zinc-500 font-mono text-xs">NEXUS::OMNI</span>
          </div>

          {/* Messages List */}
          <div className="flex-1 overflow-y-auto p-4 md:p-10 scrollbar-hide">
              <div className="max-w-4xl mx-auto">
                  {messages.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center opacity-30 mt-20 select-none pointer-events-none">
                          <BrainCircuit size={64} className="text-emerald-900 mb-6 animate-pulse" />
                          <h2 className="text-2xl font-bold text-zinc-700 font-mono tracking-tighter">NEXUS IS LISTENING</h2>
                          <p className="text-zinc-600 font-mono text-xs mt-2 uppercase tracking-widest">225 Clusters Awaiting Input</p>
                      </div>
                  ) : (
                      messages.map(msg => (
                          <ChatMessage 
                            key={msg.id} 
                            message={msg} 
                            onEdit={handleEditMessage} 
                            onViewMindMap={handleOpenMindMap}
                          />
                      ))
                  )}
                  <div ref={messagesEndRef} />
              </div>
          </div>
      </div>
    </div>
  );
};

export default App;
