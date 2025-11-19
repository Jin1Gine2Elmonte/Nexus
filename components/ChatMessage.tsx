import React, { useState } from 'react';
import { Message } from '../types';
import { User, Bot, ChevronDown, ChevronUp, BrainCircuit } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const [showThought, setShowThought] = useState(false);

  // Extract thought process if it was combined in the content string (formatted as <thought>...</thought> or similar)
  // In this app, we handle separate messages or assume message.content is the final, 
  // but for the "Omni" feel, we might have a separate "Thinking" block passed in.
  // Here we assume message.content is the final display text.

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-start' : 'justify-start'} animate-fadeIn`}>
      <div className={`
        flex max-w-4xl w-full gap-4 
        ${isUser ? 'flex-row-reverse' : 'flex-row'}
      `}>
        {/* Avatar */}
        <div className={`
            flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
            ${isUser ? 'bg-zinc-700 text-zinc-300' : 'bg-gradient-to-br from-emerald-600 to-teal-800 text-white shadow-lg'}
        `}>
          {isUser ? <User size={20} /> : <Bot size={20} />}
        </div>

        {/* Content */}
        <div className={`flex flex-col gap-2 w-full min-w-0 ${isUser ? 'items-end' : 'items-start'}`}>
            <span className="text-xs text-zinc-500 font-mono">
                {isUser ? 'المستخدم' : 'Nexus Omni-Core'}
            </span>
            
            {/* Thinking Toggle for AI */}
            {!isUser && message.isThinking && (
                 <button 
                 onClick={() => setShowThought(!showThought)}
                 className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-900/20 border border-emerald-900/50 px-3 py-1.5 rounded hover:bg-emerald-900/40 transition-colors mb-2 w-fit"
               >
                 <BrainCircuit size={14} />
                 <span>{showThought ? 'إخفاء مسار التحليل (30 عقدة)' : 'إظهار مسار التحليل العميق (30 عقدة)'}</span>
                 {showThought ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
               </button>
            )}

            {/* Thinking Content */}
            {!isUser && message.isThinking && showThought && (
                <div className="bg-black/40 border-l-2 border-emerald-600 p-4 rounded-r-lg text-sm text-zinc-400 font-mono whitespace-pre-wrap mb-2 w-full animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center gap-2 mb-2 text-emerald-500 text-xs uppercase tracking-widest">
                        <span>تحليل DeepSeek R-1 المحاكى</span>
                        <div className="h-px bg-emerald-900 flex-grow"></div>
                    </div>
                    {/* Only show first 1000 chars if too long, or full */}
                    <ReactMarkdown>{message.content}</ReactMarkdown> 
                </div>
            )}

            {/* Main Content */}
            {(!message.isThinking) && (
                <div className={`
                    px-5 py-4 rounded-2xl text-sm leading-relaxed shadow-md break-words w-full overflow-hidden
                    ${isUser 
                        ? 'bg-zinc-800 text-zinc-100 rounded-tr-none' 
                        : 'bg-zinc-900/80 border border-zinc-800 text-zinc-200 rounded-tl-none'}
                `}>
                    <div className="prose prose-invert prose-sm max-w-none font-arabic">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;