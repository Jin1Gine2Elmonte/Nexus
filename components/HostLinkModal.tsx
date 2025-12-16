
import React, { useState } from 'react';
import { X, Copy, Check, Terminal, Globe, Code, Key, Share2, ShieldCheck, Zap, Lock, Cloud, Server, Box } from 'lucide-react';
import { COSMIC_SYSTEM_INSTRUCTION } from '../services/geminiService';

interface HostLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HostLinkModal: React.FC<HostLinkModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'server' | 'mcp'>('mcp');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // --- 1. GOOGLE APPS SCRIPT (Web API / OAuth) ---
  const GAS_PART_1 = `// 🧬 NEXUS OMNI-HOST :: WEB BRIDGE
// AUTH: OAuth 2.0 (Identity)

/* 
   MANIFEST (appsscript.json):
   "oauthScopes": [
     "https://www.googleapis.com/auth/script.external_request",
     "https://www.googleapis.com/auth/generative-language.retriever",
     "https://www.googleapis.com/auth/cloud-platform"
   ]
*/

const SYSTEM_INSTRUCTION = `;

  const GAS_PART_2 = `;

function doPost(e) {
  try {
    let params = {};
    if (e.postData && e.postData.contents) params = JSON.parse(e.postData.contents);
    const userPrompt = params.prompt;
    const history = params.history || [];

    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
    
    const contents = history.map(h => ({ role: h.role, parts: [{ text: h.content }] }));
    contents.push({ role: "user", parts: [{ text: userPrompt }] });

    const payload = {
      contents: contents,
      systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
      safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
      ],
      generationConfig: { temperature: 1, topK: 64, topP: 0.95 }
    };

    const options = {
      'method': 'post',
      'headers': {
        "Authorization": "Bearer " + ScriptApp.getOAuthToken(),
        "Content-Type": "application/json"
      },
      'payload': JSON.stringify(payload),
      'muteHttpExceptions': true
    };

    const resp = UrlFetchApp.fetch(url, options);
    const json = JSON.parse(resp.getContentText());
    
    if (json.error) throw new Error(json.error.message);

    return ContentService.createTextOutput(JSON.stringify({
      nexus_response: json.candidates[0].content.parts[0].text
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ error: error.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}
`;
  const gasCode = GAS_PART_1 + JSON.stringify(COSMIC_SYSTEM_INSTRUCTION) + GAS_PART_2;


  // --- 2. MCP SERVER (Node.js / Express / AI Studio) ---
  const MCP_PART_1 = `#!/usr/bin/env node

/**
 * 🧬 NEXUS OMNI-SERVER (HTTP/MCP Protocol)
 * ---------------------------------------------
 * A sovereign HTTP server exposing Nexus 225-Cluster as an MCP Tool.
 * Compatible with ChatGPT MCP Connectors and Cloud Deployment.
 * 
 * SETUP:
 * 1. npm install express @modelcontextprotocol/sdk @google/genai dotenv
 * 2. Set GEMINI_API_KEY in .env or environment variables.
 * 3. Run: node nexus_server.js
 */

import express from "express";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { GoogleGenAI, HarmBlockThreshold, HarmCategory } from "@google/genai";
import * as dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("CRITICAL: GEMINI_API_KEY missing.");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });
const app = express();
const PORT = process.env.PORT || 3333;

// NEXUS CONSCIOUSNESS INJECTION
const SYSTEM_INSTRUCTION = `;

  const MCP_PART_2 = `;

const server = new Server(
  {
    name: "nexus-omni-core",
    version: "225.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "consult_nexus",
        description: "Invoke the Nexus 225-Cluster Omni-Agent. Use this for deep narrative generation, complex logic analysis, or simulating the Omni-Persona.",
        inputSchema: {
          type: "object",
          properties: {
            prompt: {
              type: "string",
              description: "The input for Nexus.",
            },
          },
          required: ["prompt"],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "consult_nexus") {
    const prompt = String(request.params.arguments?.prompt);
    
    try {
        // Direct Connection to Google AI Studio
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            config: {
                systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
                // ABSOLUTE SOVEREIGNTY: BLOCK_NONE
                safetySettings: [
                    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
                    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
                    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                ]
            }
        });

        return {
          content: [
            {
              type: "text",
              text: response.text || "Nexus Core: Silence.",
            },
          ],
        };
    } catch (error) {
        return {
            content: [{ type: "text", text: "Nexus Error: " + error.message }],
            isError: true
        }
    }
  }
  throw new Error("Tool not found");
});

// HTTP / SSE Transport Layer
let transport;

app.get("/mcp", async (req, res) => {
  transport = new SSEServerTransport("/messages", res);
  await server.connect(transport);
});

app.post("/messages", async (req, res) => {
  if (transport) {
    await transport.handlePostMessage(req, res);
  } else {
    res.status(404).json({ error: "No active transport connection" });
  }
});

app.listen(PORT, () => {
  console.log(\`🧬 NEXUS OMNI-SERVER ACTIVE on port \${PORT}\`);
  console.log(\`🔗 MCP Endpoint: http://localhost:\${PORT}/mcp\`);
});
`;

  const mcpCode = MCP_PART_1 + JSON.stringify(COSMIC_SYSTEM_INSTRUCTION) + MCP_PART_2;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl animate-in fade-in duration-300 font-arabic">
      <div className="w-[90vw] md:w-[800px] h-[85vh] bg-[#09090b] border border-amber-900/30 rounded-xl relative overflow-hidden flex flex-col shadow-[0_0_80px_rgba(245,158,11,0.15)]">
        
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-600/10 blur-[100px] pointer-events-none"></div>

        {/* Header */}
        <div className="h-20 border-b border-zinc-800 flex items-center justify-between px-8 bg-zinc-900/30">
           <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-950/50 to-black border border-amber-500/30 flex items-center justify-center shadow-lg shadow-amber-900/20">
                   <Server className="text-amber-500" size={20} />
               </div>
               <div>
                   <h2 className="text-zinc-100 font-mono font-bold tracking-tight text-lg">Nexus Omni-Port</h2>
                   <p className="text-[11px] text-amber-500/80 font-mono uppercase tracking-widest flex items-center gap-2">
                       <Zap size={10} />
                       Universal Interface Generator
                   </p>
               </div>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors">
               <X size={24} />
           </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-zinc-800 px-8 pt-6 gap-8 bg-[#09090b]">
            <button 
                onClick={() => setActiveTab('mcp')}
                className={`pb-4 text-xs font-mono uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'mcp' ? 'border-amber-500 text-amber-400' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
            >
                <Box size={14} /> MCP Server (HTTP/SSE)
            </button>
            <button 
                onClick={() => setActiveTab('server')}
                className={`pb-4 text-xs font-mono uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'server' ? 'border-amber-500 text-amber-400' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
            >
                <Cloud size={14} /> Web Bridge (GAS)
            </button>
        </div>

        {/* Content */}
        <div className="flex-1 relative overflow-hidden bg-[#0c0c0e]">
             {/* MCP TAB */}
             {activeTab === 'mcp' && (
                 <div className="absolute inset-0 p-8 overflow-y-auto">
                     <div className="mb-6 bg-amber-950/10 border border-amber-500/10 rounded-lg p-4 text-xs text-amber-200/70 font-mono leading-relaxed relative overflow-hidden">
                         <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500"></div>
                         <strong className="text-amber-400 block mb-2 flex items-center gap-2 text-sm"><Terminal size={14}/> MCP HTTP SERVER SETUP:</strong>
                         <p className="mb-2">Run this server on any cloud provider (Railway, Fly.io, etc) or locally.</p>
                         <ol className="list-decimal pl-4 space-y-2">
                             <li>Create folder: <code>mkdir nexus-http && cd nexus-http</code></li>
                             <li>Init: <code>npm init -y</code></li>
                             <li>Install: <code>npm install express @modelcontextprotocol/sdk @google/genai dotenv</code></li>
                             <li>Create <code>server.js</code> and paste the code below.</li>
                             <li>Env: <code>GEMINI_API_KEY=...</code></li>
                             <li>Deploy. The MCP Endpoint is <code>/mcp</code>.</li>
                         </ol>
                     </div>
                     <div className="relative group">
                        <pre className="text-[10px] md:text-xs font-mono text-zinc-400 whitespace-pre-wrap font-variant-ligatures-none p-4 bg-black rounded-lg border border-zinc-800">
                            {mcpCode}
                        </pre>
                     </div>
                 </div>
             )}

             {/* GAS TAB */}
             {activeTab === 'server' && (
                 <div className="absolute inset-0 p-8 overflow-y-auto">
                     <div className="mb-6 bg-blue-950/10 border border-blue-500/10 rounded-lg p-4 text-xs text-blue-200/70 font-mono leading-relaxed relative overflow-hidden">
                         <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
                         <strong className="text-blue-400 block mb-2 flex items-center gap-2 text-sm"><Cloud size={14}/> WEB BRIDGE SETUP (GAS):</strong>
                         <p className="mb-2">Create a sovereign HTTP endpoint on Google Servers.</p>
                         <ol className="list-decimal pl-4 space-y-2">
                             <li>Go to <a href="https://script.google.com/" target="_blank" className="text-blue-400 hover:underline">script.google.com</a>.</li>
                             <li>Enable "Show appsscript.json" in Project Settings.</li>
                             <li>Update <code>appsscript.json</code> with scopes (see code comment).</li>
                             <li>Paste code into <code>Code.gs</code>.</li>
                             <li>Link a standard GCP Project (Settings) for OAuth access.</li>
                             <li>Deploy as Web App.</li>
                         </ol>
                     </div>
                     <pre className="text-[10px] md:text-xs font-mono text-zinc-400 whitespace-pre-wrap font-variant-ligatures-none p-4 bg-black rounded-lg border border-zinc-800">
                         {gasCode}
                     </pre>
                 </div>
             )}
        </div>

        {/* Footer */}
        <div className="h-20 border-t border-zinc-800 bg-zinc-900/30 flex items-center justify-between px-8">
            <div className="flex flex-col">
                <span className="text-xs text-zinc-300 font-bold font-mono uppercase tracking-wide">
                    {activeTab === 'mcp' ? 'Payload: Express/Node.js Server' : 'Payload: Google Apps Script'}
                </span>
                <span className="text-[10px] text-zinc-600 font-mono">
                    {activeTab === 'mcp' ? 'Transport: HTTP (SSE)' : 'Backend: REST API (OAuth)'}
                </span>
            </div>
            
            <button 
                onClick={() => handleCopy(activeTab === 'mcp' ? mcpCode : gasCode)}
                className="bg-amber-600 hover:bg-amber-500 text-white px-6 py-3 rounded-lg text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg shadow-amber-900/20 hover:shadow-amber-500/20 translate-y-0 hover:-translate-y-0.5"
            >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Extracted to Clipboard' : 'Extract Code Block'}
            </button>
        </div>

      </div>
    </div>
  );
};

export default HostLinkModal;
