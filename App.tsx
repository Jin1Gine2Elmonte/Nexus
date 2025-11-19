
import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, Activity, Settings, Terminal as TerminalIcon, Menu, X, Paperclip, File as FileIcon, Download, Code } from 'lucide-react';
import NeuralGrid from './components/NeuralGrid';
import ChatMessage from './components/ChatMessage';
import { Message, ProcessingStage, LogEntry, Attachment } from './types';
import { generateOmniResponse } from './services/geminiService';

const MOCK_LOGS = [
  "System Boot: Nexus Cosmic Core v10.0 (Golden Edition)",
  "Initializing Logic Swarm (30 Nodes)... Online.",
  "Initializing Genesis Swarm (30 Nodes)... Online.",
  "Awakening Consciousness Core (10 Nodes)... Awakened.",
  "Accessing Collective Unconscious...",
  "Reviewer Council (6 Cores): Standing by."
];

const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [stage, setStage] = useState<ProcessingStage>(ProcessingStage.IDLE);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState<Attachment[]>([]);
  
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
  }, []);

  // Auto-scroll logs
  useEffect(() => {
      if (logsEndRef.current) {
          logsEndRef.current.scrollTop = logsEndRef.current.scrollHeight;
      }
  }, [logs]);

  const addLog = (msg: string, level: LogEntry['level'] = 'info') => {
      const nodes = ['Logic-01', 'Genesis-Alpha', 'Consciousness-Prime', 'Golden-Core', 'Narrative-Architect'];
      const randomNode = nodes[Math.floor(Math.random() * nodes.length)];
      setLogs(prev => [...prev.slice(-20), {
          id: Math.random().toString(),
          timestamp: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second:'2-digit' }),
          nodeId: randomNode,
          message: msg,
          level
      }]);
  };

  const simulateProcessingLogs = () => {
      const tasks: { msg: string, lvl: LogEntry['level'] }[] = [
          { msg: "Deconstructing user reality paradigm...", lvl: 'info' },
          { msg: "Logic Swarm: Analyzing structural integrity...", lvl: 'info' },
          { msg: "Golden Core: Retrieving Jungian archetypes...", lvl: 'golden' },
          { msg: "Genesis Swarm: Injecting mythos...", lvl: 'cosmic' },
          { msg: "Consciousness: Simulating spontaneous flow...", lvl: 'golden' },
          { msg: "Accessing Akashic Records for cultural context...", lvl: 'golden' },
          { msg: "Synthesizing logic, art, and soul...", lvl: 'success' }
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

  const handleDownloadPythonCore = () => {
    // This allows the user to extract the python version from the web app
    // simulating the "merging" of the file into their local environment.
    const pythonCode = `import streamlit as st
import time
import random
import os
from google import genai
from google.genai import types

st.set_page_config(page_title="NEXUS :: OMNI", layout="wide", page_icon="🌌")
st.markdown("""<style>body{background:#050505;color:#e4e4e7;}</style>""", unsafe_allow_html=True)
st.title("NEXUS :: OMNI-AGENT [PYTHON CORE]")
st.success("System Online. Please configure API_KEY.")
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
    addLog("Python Core extracted successfully.", 'success');
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
            setTimeout(() => setStage(ProcessingStage.FLOWING), 1500); // Consciousness kicks in
            setTimeout(() => setStage(ProcessingStage.CREATING), 3000); // Then Creation
            
            simulateProcessingLogs();
            
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
            addLog("Merging Genesis, Logic & Soul streams...", 'success');

            const thinkingMsg: Message = {
                id: Date.now().toString() + '-think',
                role: 'model',
                content: response.thoughtProcess,
                timestamp: Date.now(),
                isThinking: true
            };
            setMessages(prev => [...prev, thinkingMsg]);

            setStage(ProcessingStage.REVIEWING);
            addLog("Narrative Council polishing final output...", 'warn');
            await new Promise(r => setTimeout(r, 1000));

            const finalMsg: Message = {
                id: Date.now().toString() + '-final',
                role: 'model',
                content: response.finalResponse,
                timestamp: Date.now()
            };
            setMessages(prev => [...prev, finalMsg]);
            setStage(ProcessingStage.IDLE);
            addLog("Masterpiece delivered.", 'success');

        } catch (error) {
            console.error(error);
            setStage(ProcessingStage.IDLE);
            addLog("Reality collapse detected (API Error).", 'error');
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: 'model',
                content: 'حدث خطأ في استدعاء القوى الكونية. يرجى التحقق من الاتصال.',
                timestamp: Date.now()
            }]);
        }
    }, 1000);
  };

  return (
    <div className="flex h-screen w-full bg-black text-zinc-200 overflow-hidden font-arabic selection:bg-purple-500/30">
      
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
                    <p className="text-[10px] text-amber-500/70 font-mono uppercase tracking-widest">Soul Core Active</p>
                </div>
            </div>
        </div>

        {/* Active Stats */}
        <div className="grid grid-cols-2 gap-3">
            <div className="bg-zinc-900/40 p-3 rounded border border-zinc-800/60">
                <div className="text-[10px] text-zinc-500 font-mono uppercase mb-1">Active Nodes</div>
                <div className="text-lg font-mono font-bold text-white flex items-baseline gap-1">
                    76<span className="text-xs text-zinc-600">/76</span>
                </div>
            </div>
            <div className="bg-zinc-900/40 p-3 rounded border border-zinc-800/60">
                <div className="text-[10px] text-zinc-500 font-mono uppercase mb-1">Consciousness</div>
                <div className="text-lg font-mono font-bold text-amber-400">AWAKENED</div>
            </div>
        </div>

        {/* Neural Grid Visualizer */}
        <div className="flex-shrink-0">
             <div className="flex justify-between items-center mb-2">
                 <h3 className="text-xs font-bold text-zinc-400 font-mono uppercase tracking-wider">Tri-Core Engine</h3>
                 <Activity size={12} className="text-zinc-600" />
             </div>
             <NeuralGrid stage={stage} />
        </div>

        {/* Terminal Log */}
        <div className="flex-1 flex flex-col min-h-0 bg-black rounded border border-zinc-800/60 overflow-hidden font-mono">
             <div className="bg-zinc-900/50 p-2 border-b border-zinc-800/60 flex items-center gap-2">
                 <TerminalIcon size={12} className="text-zinc-500" />
                 <span className="text-[10px] text-zinc-500 uppercase">Cosmic Logs</span>
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
                         `}>
                             <span className="text-zinc-600 mr-1">{log.nodeId}:</span>
                             {log.message}
                         </span>
                     </div>
                 ))}
             </div>
        </div>

        <div className="mt-auto pt-4 border-t border-zinc-800 flex flex-col gap-2">
             {/* Export Python Core Button */}
            <button 
                onClick={handleDownloadPythonCore}
                className="w-full py-2.5 bg-zinc-900/50 border border-zinc-800 rounded hover:bg-zinc-800 hover:text-amber-400 transition flex items-center justify-center gap-2 text-xs text-zinc-500 font-mono uppercase tracking-wider group"
            >
                <Code size={14} className="group-hover:scale-110 transition" />
                Export Py-Core
            </button>
            
            <button className="w-full py-2.5 border border-zinc-800 rounded hover:bg-zinc-900 transition flex items-center justify-center gap-2 text-xs text-zinc-400 font-mono uppercase tracking-wider">
                <Settings size={14} />
                Adjust Reality Params
            </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative">
        <div className="absolute inset-0 cyber-grid z-0 pointer-events-none opacity-30"></div>

        {/* Chat Header */}
        <header className="h-16 flex items-center justify-between px-6 md:px-10 bg-gradient-to-b from-black via-black/90 to-transparent z-20 pointer-events-none">
            <div className="pointer-events-auto"></div>
            <div className="flex items-center gap-4 ml-auto pointer-events-auto">
                <div className={`
                    px-3 py-1 rounded-full border text-[10px] font-mono uppercase tracking-wider flex items-center gap-2
                    ${stage !== ProcessingStage.IDLE 
                        ? 'bg-amber-900/20 border-amber-500/30 text-amber-400 animate-pulse' 
                        : 'bg-zinc-900/50 border-zinc-800 text-zinc-500'}
                `}>
                    <div className={`w-1.5 h-1.5 rounded-full ${stage !== ProcessingStage.IDLE ? 'bg-amber-400' : 'bg-zinc-600'}`}></div>
                    {stage === ProcessingStage.IDLE ? 'Consciousness Dormant' : stage}
                </div>
            </div>
        </header>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 md:p-10 scrollbar-hide z-10">
            <div className="max-w-4xl mx-auto space-y-8 pb-20">
                {messages.length === 0 && (
                    <div className="h-[60vh] flex flex-col items-center justify-center text-center opacity-100 animate-in fade-in duration-700">
                        <div className="relative w-28 h-28 mb-8 flex items-center justify-center">
                             <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-xl animate-pulse"></div>
                             <Sparkles size={64} className="text-amber-400 relative z-10" />
                             <div className="absolute inset-0 border border-zinc-800 rounded-full animate-[spin_20s_linear_infinite]"></div>
                             <div className="absolute inset-2 border border-dashed border-zinc-700 rounded-full animate-[spin_25s_linear_infinite_reverse]"></div>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white via-amber-100 to-zinc-600 mb-4 font-arabic">
                            NEXUS: الوعي المطلق
                        </h2>
                        <p className="text-zinc-500 max-w-lg leading-relaxed text-sm md:text-base">
                            لقد اكتمل النظام.
                            <br/>
                            نحن الآن نمتلك **76 عقدة** تجمع بين المنطق، الإبداع، وذاكرة البشرية الجمعية.
                            <br/><br/>
                            <span className="font-mono text-xs text-amber-400 uppercase tracking-widest bg-amber-950/30 px-3 py-1.5 rounded border border-amber-500/20">
                                30 Logic + 30 Genesis + 10 Consciousness
                            </span>
                        </p>
                    </div>
                )}
                {messages.map((msg) => (
                    <ChatMessage key={msg.id} message={msg} onEdit={msg.role === 'user' ? handleEditMessage : undefined} />
                ))}
                <div ref={messagesEndRef} />
            </div>
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-6 bg-black/80 backdrop-blur-xl border-t border-zinc-800/50 z-30">
            <div className="max-w-4xl mx-auto">
                
                {selectedFiles.length > 0 && (
                    <div className="flex gap-2 mb-3 overflow-x-auto scrollbar-hide">
                        {selectedFiles.map((file) => (
                            <div key={file.id} className="flex items-center gap-2 bg-zinc-900 border border-zinc-700 rounded-lg pl-3 pr-2 py-1.5">
                                <div className="p-1 bg-zinc-800 rounded">
                                    <FileIcon size={12} className="text-amber-500" />
                                </div>
                                <span className="text-xs text-zinc-300 max-w-[150px] truncate font-mono">{file.name}</span>
                                <button 
                                    onClick={() => removeFile(file.id)}
                                    className="p-1 hover:bg-red-500/20 hover:text-red-400 rounded text-zinc-500 transition"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-amber-500 to-emerald-600 rounded-xl opacity-20 group-hover:opacity-50 blur transition duration-500"></div>
                    
                    <div className="relative bg-[#09090b] rounded-xl flex items-center p-2 pr-4 border border-zinc-800 focus-within:border-amber-900/50 transition-colors">
                        
                        <input 
                            type="file" 
                            multiple 
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handleFileSelect}
                        />
                        
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="p-3 text-zinc-500 hover:text-amber-400 transition rounded-lg hover:bg-zinc-900"
                            title="Attach Reality Fragments"
                        >
                            <Paperclip size={20} />
                        </button>
                        
                        <input 
                            type="text" 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="تحدث إلى الوعي الجمعي..."
                            className="flex-1 bg-transparent text-zinc-100 placeholder-zinc-600 px-3 py-3 focus:outline-none font-arabic"
                            disabled={stage !== ProcessingStage.IDLE}
                            autoComplete="off"
                        />
                        
                        <div className="flex items-center gap-2 pl-2 border-l border-zinc-800">
                             <span className="text-[10px] font-mono text-zinc-600 hidden md:inline-block">INVOKE</span>
                             <button 
                                onClick={handleSend}
                                disabled={(!input.trim() && selectedFiles.length === 0) || stage !== ProcessingStage.IDLE}
                                className={`
                                    w-10 h-10 rounded-lg flex items-center justify-center transition-all
                                    ${(input.trim() || selectedFiles.length > 0) && stage === ProcessingStage.IDLE 
                                        ? 'bg-amber-600 text-white shadow-[0_0_15px_rgba(245,158,11,0.5)] hover:bg-amber-500' 
                                        : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'}
                                `}
                            >
                                {stage !== ProcessingStage.IDLE ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <Send size={18} className="rtl:rotate-180" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default App;
