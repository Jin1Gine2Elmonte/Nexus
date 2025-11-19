
import React, { useState } from 'react';
import { Message } from '../types';
import { User, Bot, ChevronDown, ChevronUp, BrainCircuit, Terminal, Sparkles, Copy, Check, FileText, Edit2, FileCode, FileImage, Paperclip } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ChatMessageProps {
  message: Message;
  onEdit?: (content: string) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, onEdit }) => {
  const isUser = message.role === 'user';
  const [showThought, setShowThought] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('image')) return <FileImage size={14} />;
    if (mimeType.includes('pdf')) return <FileText size={14} />;
    if (mimeType.includes('code') || mimeType.includes('javascript') || mimeType.includes('html')) return <FileCode size={14} />;
    return <Paperclip size={14} />;
  };

  return (
    <div className={`flex w-full mb-8 ${isUser ? 'justify-start' : 'justify-start'} group`}>
      <div className={`
        flex max-w-4xl w-full gap-5
        ${isUser ? 'flex-row-reverse' : 'flex-row'}
      `}>
        {/* Avatar */}
        <div className={`
            flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center border
            ${isUser 
                ? 'bg-zinc-900/50 border-zinc-700 text-zinc-400' 
                : 'bg-gradient-to-br from-emerald-900/20 to-teal-900/20 border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]'}
        `}>
          {isUser ? <User size={22} /> : <Bot size={22} />}
        </div>

        {/* Content */}
        <div className={`flex flex-col gap-2 w-full min-w-0 ${isUser ? 'items-end' : 'items-start'}`}>
            <div className="flex items-center gap-2 text-xs font-mono opacity-70 mb-1">
                <span className={isUser ? 'text-zinc-400' : 'text-emerald-500 font-bold tracking-wide'}>
                    {isUser ? 'USER::INPUT' : 'NEXUS::OMNI_CORE'}
                </span>
                <span className="text-zinc-600 text-[10px]">{new Date(message.timestamp).toLocaleTimeString()}</span>
            </div>

            {/* Attachments (If any) */}
            {message.attachments && message.attachments.length > 0 && (
              <div className={`flex flex-wrap gap-2 mb-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
                {message.attachments.map((file) => (
                  <div key={file.id} className="flex items-center gap-2 px-3 py-2 bg-zinc-900/80 border border-zinc-700/50 rounded-lg text-xs text-zinc-300 max-w-[200px]">
                    <span className="text-emerald-500">{getFileIcon(file.mimeType)}</span>
                    <span className="truncate font-mono">{file.name}</span>
                  </div>
                ))}
              </div>
            )}
            
            {/* Thinking Process Block */}
            {!isUser && message.isThinking && (
                 <div className="w-full max-w-2xl">
                     <button 
                        onClick={() => setShowThought(!showThought)}
                        className={`
                            flex items-center gap-2 text-xs px-4 py-2 rounded-t-lg border-t border-x transition-all w-full
                            ${showThought 
                                ? 'bg-zinc-900 border-emerald-500/20 text-emerald-400' 
                                : 'bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:text-emerald-400 hover:bg-zinc-900'}
                        `}
                     >
                        <BrainCircuit size={14} className={showThought ? "animate-pulse" : ""} />
                        <span className="font-mono uppercase tracking-wider font-bold">
                            مسار التحليل العميق (30 عقدة)
                        </span>
                        <div className="flex-grow"></div>
                        {showThought ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                     </button>
                     
                     {showThought && (
                        <div className="bg-black border-x border-b border-emerald-500/20 rounded-b-lg p-5 text-xs font-mono text-zinc-400 overflow-hidden relative">
                             {/* Code-like look */}
                             <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/20"></div>
                             <div className="flex items-center gap-2 mb-3 text-emerald-600 border-b border-emerald-900/30 pb-2">
                                 <Terminal size={12} />
                                 <span>EXECUTION_LOG::DEEP_THINKING_MODEL_V3</span>
                             </div>
                             <div className="whitespace-pre-wrap leading-relaxed opacity-90">
                                <ReactMarkdown>{message.content}</ReactMarkdown>
                             </div>
                        </div>
                     )}
                     {!showThought && (
                        <div className="h-1 w-full bg-gradient-to-r from-emerald-500/0 via-emerald-500/20 to-emerald-500/0"></div>
                     )}
                 </div>
            )}

            {/* Main Content Bubble */}
            {(!message.isThinking) && (
                <div className={`
                    relative px-6 py-5 rounded-2xl text-sm leading-7 shadow-sm break-words w-full overflow-hidden border group-bubble
                    ${isUser 
                        ? 'bg-zinc-800/80 border-zinc-700 text-zinc-100 rounded-tr-sm' 
                        : 'bg-zinc-900/40 border-zinc-800 text-zinc-200 rounded-tl-sm shadow-[0_4px_20px_rgba(0,0,0,0.2)]'}
                `}>
                    {!isUser && <Sparkles size={14} className="absolute top-4 left-4 text-emerald-500/20" />}
                    
                    <div className="prose prose-invert prose-sm max-w-none font-arabic">
                        <ReactMarkdown 
                            components={{
                                code({node, inline, className, children, ...props}: any) {
                                    const match = /language-(\w+)/.exec(className || '');
                                    const lang = match ? match[1] : 'text';
                                    const codeText = String(children).replace(/\n$/, '');

                                    if (!inline) {
                                        return (
                                            <div className="my-4 rounded-lg border border-zinc-700 overflow-hidden bg-[#0d0d10]">
                                                {/* Professional Code Header */}
                                                <div className="flex items-center justify-between px-3 py-2 bg-[#18181b] border-b border-zinc-700">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex gap-1.5">
                                                            <div className="w-2.5 h-2.5 rounded-full bg-zinc-600/50"></div>
                                                            <div className="w-2.5 h-2.5 rounded-full bg-zinc-600/50"></div>
                                                            <div className="w-2.5 h-2.5 rounded-full bg-zinc-600/50"></div>
                                                        </div>
                                                        <span className="text-[10px] font-mono text-zinc-400 uppercase ml-2">{lang}</span>
                                                    </div>
                                                    <button 
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(codeText);
                                                        }}
                                                        className="flex items-center gap-1 text-[10px] text-zinc-400 hover:text-emerald-400 transition font-mono uppercase group/btn"
                                                    >
                                                        <Copy size={12} />
                                                        <span className="group-hover/btn:underline">Copy Code</span>
                                                    </button>
                                                </div>
                                                
                                                <div className="p-4 overflow-x-auto font-mono text-xs leading-relaxed text-zinc-300">
                                                    <code className={className} {...props}>
                                                        {children}
                                                    </code>
                                                </div>
                                            </div>
                                        );
                                    }
                                    return (
                                        <code {...props} className="bg-zinc-800/80 px-1.5 py-0.5 rounded text-emerald-300 font-mono text-xs border border-zinc-700/50">
                                            {children}
                                        </code>
                                    )
                                }
                            }}
                        >
                            {message.content}
                        </ReactMarkdown>
                    </div>

                    {/* Message Actions */}
                    <div className="flex justify-end items-center gap-3 mt-4 pt-3 border-t border-zinc-800/50 opacity-0 group-hover:opacity-100 transition-opacity">
                        {isUser && onEdit && (
                            <button 
                                onClick={() => onEdit(message.content)}
                                className="text-zinc-500 hover:text-emerald-400 transition flex items-center gap-1 text-[10px] font-mono uppercase"
                            >
                                <Edit2 size={10} /> Edit
                            </button>
                        )}
                        <button 
                            className="text-zinc-500 hover:text-white transition flex items-center gap-1 text-[10px] font-mono uppercase"
                            onClick={() => handleCopy(message.content)}
                        >
                            {copied ? <Check size={10} className="text-emerald-500" /> : <Copy size={10} />}
                            {copied ? <span className="text-emerald-500">Copied</span> : 'Copy Text'}
                        </button>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
