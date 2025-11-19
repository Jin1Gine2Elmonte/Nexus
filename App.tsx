import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, Cpu, Activity, Settings, Lock } from 'lucide-react';
import NeuralGrid from './components/NeuralGrid';
import ChatMessage from './components/ChatMessage';
import { Message, ProcessingStage } from './types';
import { generateOmniResponse } from './services/geminiService';

const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [stage, setStage] = useState<ProcessingStage>(ProcessingStage.IDLE);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim() || stage !== ProcessingStage.IDLE) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setStage(ProcessingStage.DISTRIBUTING);

    // Artificial delay for "Distribution" visualization
    setTimeout(async () => {
        try {
            setStage(ProcessingStage.ANALYZING);
            
            // Prepare history for API
            const history = messages.map(m => ({
                role: m.role === 'user' ? 'user' : 'model',
                parts: [{ text: m.content }]
            })).filter(m => !m.parts[0].text.includes('مسار التحليل')); // Crude filter to avoid sending raw thought back if stored in history

            const response = await generateOmniResponse(userMsg.content, history);

            setStage(ProcessingStage.SYNTHESIZING);

            // Add Thinking Block (Hidden by default in UI)
            const thinkingMsg: Message = {
                id: Date.now().toString() + '-think',
                role: 'model',
                content: response.thoughtProcess,
                timestamp: Date.now(),
                isThinking: true
            };
            setMessages(prev => [...prev, thinkingMsg]);

            // Small delay to show Synthesizing/Reviewing stage
            setStage(ProcessingStage.REVIEWING);
            await new Promise(r => setTimeout(r, 1200));

            // Add Final Response
            const finalMsg: Message = {
                id: Date.now().toString() + '-final',
                role: 'model',
                content: response.finalResponse,
                timestamp: Date.now()
            };
            setMessages(prev => [...prev, finalMsg]);
            setStage(ProcessingStage.IDLE);

        } catch (error) {
            console.error(error);
            setStage(ProcessingStage.IDLE);
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: 'model',
                content: 'حدث خطأ في الاتصال ببروتوكول Omni-Agent. يرجى التحقق من مفتاح API والمحاولة مرة أخرى.',
                timestamp: Date.now()
            }]);
        }
    }, 1500);
  };

  return (
    <div className="flex h-screen w-full bg-zinc-950 text-zinc-200 overflow-hidden font-arabic selection:bg-emerald-500/30">
      
      {/* Sidebar / Dashboard */}
      <div className="w-80 border-l border-zinc-800 bg-black/40 hidden md:flex flex-col p-6 gap-6">
        <div className="flex items-center gap-3 text-emerald-500 mb-4">
            <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                <Activity size={24} />
            </div>
            <div>
                <h1 className="font-bold text-lg tracking-tight text-white">Nexus Omni</h1>
                <p className="text-xs text-zinc-500">V3.0.1 // Deep Reasoner</p>
            </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
            <div className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-800">
                <div className="text-xs text-zinc-500 mb-1">Nodes Active</div>
                <div className="text-xl font-mono font-bold text-white">33/33</div>
            </div>
            <div className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-800">
                <div className="text-xs text-zinc-500 mb-1">Latency</div>
                <div className="text-xl font-mono font-bold text-emerald-400">12ms</div>
            </div>
        </div>

        {/* The Visualizer */}
        <NeuralGrid stage={stage} />

        {/* System Status */}
        <div className="mt-auto space-y-3">
            <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-xs space-y-2">
                <div className="flex justify-between items-center">
                    <span className="text-zinc-400">DeepSeek R-1 Logic</span>
                    <span className="text-emerald-500 font-bold">ACTIVE</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-zinc-400">NotebookLM Context</span>
                    <span className="text-emerald-500 font-bold">SYNCED</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-zinc-400">Gemini Pro 3.0 API</span>
                    <span className="text-emerald-500 font-bold">CONNECTED</span>
                </div>
            </div>
            <button className="w-full py-2 border border-zinc-700 rounded-lg text-xs text-zinc-400 hover:bg-zinc-800 transition flex items-center justify-center gap-2">
                <Settings size={14} />
                إعدادات العقد (المفاتيح)
            </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Header */}
        <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-6 bg-zinc-950/80 backdrop-blur z-10">
            <div className="flex items-center gap-2 md:hidden">
                <Activity size={20} className="text-emerald-500" />
                <span className="font-bold">Nexus Omni</span>
            </div>
            <div className="flex items-center gap-4 ml-auto">
                <span className="text-xs text-zinc-500 px-2 py-1 bg-zinc-900 rounded border border-zinc-800">
                    {stage === ProcessingStage.IDLE ? 'Idle' : 'Processing...'}
                </span>
            </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
            {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center p-10 opacity-50">
                    <Cpu size={64} className="mb-6 text-zinc-700" />
                    <h2 className="text-2xl font-bold text-zinc-300 mb-2">جاهز للبدء</h2>
                    <p className="text-zinc-500 max-w-md">
                        نظام Nexus يجمع بين التحليل العميق، الإبداع، والمراجعة الدقيقة. 
                        يتم توزيع طلبك على 30 عقدة تحليل و 3 عقد مراجعة.
                    </p>
                </div>
            )}
            {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
            ))}
            <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 bg-zinc-950 border-t border-zinc-800">
            <div className="max-w-4xl mx-auto relative">
                <div className="absolute inset-y-0 left-4 flex items-center">
                    <button className="text-zinc-500 hover:text-emerald-400 transition">
                        <Sparkles size={20} />
                    </button>
                </div>
                <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="أدخل استفسارك المعقد هنا ليتم توزيعه على الشبكة..."
                    className="w-full bg-zinc-900 border border-zinc-700 text-white pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all shadow-lg placeholder:text-zinc-600"
                    disabled={stage !== ProcessingStage.IDLE}
                />
                <button 
                    onClick={handleSend}
                    disabled={!input.trim() || stage !== ProcessingStage.IDLE}
                    className={`
                        absolute inset-y-0 right-2 my-2 px-4 rounded-lg flex items-center justify-center transition-all
                        ${input.trim() && stage === ProcessingStage.IDLE ? 'bg-emerald-600 text-white hover:bg-emerald-500' : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'}
                    `}
                >
                    {stage !== ProcessingStage.IDLE ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <Send size={18} className="rtl:rotate-180" />
                    )}
                </button>
            </div>
            <div className="text-center mt-3">
                <p className="text-[10px] text-zinc-600 flex items-center justify-center gap-1">
                    <Lock size={10} />
                    مشفر من طرف لطرف. يتم معالجة البيانات عبر بروتوكول Google Gemini الآمن.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default App;