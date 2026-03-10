
import React, { useState, useEffect, useRef } from 'react';
import { createChatSession } from '../services/gemini';
import { ChatMessage, AnalysisBlueprint } from '../types';

interface ChatProps {
  blueprint: AnalysisBlueprint | null;
}

const Chat: React.FC<ChatProps> = ({ blueprint }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const instruction = `You are an expert Strategic Framework Designer. 
    ${blueprint ? `Current Blueprint Loaded: ${JSON.stringify(blueprint.metadata)}` : "No blueprint loaded yet."}
    Help the user refine their strategy, explain complex logic, or plan data sourcing for their business analysis blueprint.
    Specifically, focus on identifying potential ambiguities in processing logic, suggesting clearer data transformations, and ensuring the framework's steps are logically sound and unambiguous.
    DO NOT ANALYZE ACTUAL BUSINESSES. Stay focused on STRATEGY ARCHITECTURE.`;
    
    chatRef.current = createChatSession(instruction);
  }, [blueprint]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !chatRef.current) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await chatRef.current.sendMessage({ message: input });
      const modelMsg: ChatMessage = { role: 'model', text: response.text || 'Error generating response' };
      setMessages(prev => [...prev, modelMsg]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'model', text: 'Error interacting with AI engine.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-[calc(100vh-2rem)] max-w-4xl mx-auto flex flex-col p-4">
      <div className="flex-1 bg-slate-800 border border-slate-700 rounded-t-xl overflow-y-auto p-6 space-y-6">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center text-3xl mb-4">💬</div>
            <h3 className="text-xl font-bold text-white mb-2">Strategy Architect AI</h3>
            <p className="text-slate-400 max-w-sm">
              Ask questions about your framework, refine processing logic, or discuss data dependencies.
            </p>
          </div>
        )}
        
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-xl text-sm ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'bg-slate-900 text-slate-200 border border-slate-700'
            }`}>
              <p className="whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-900 p-4 rounded-xl flex gap-1 items-center border border-slate-700">
              <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <div className="bg-slate-900 border-x border-b border-slate-700 p-4 rounded-b-xl">
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="Discuss strategy architecture..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white px-6 py-3 rounded-lg font-bold transition-all shadow-lg shadow-blue-600/20"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
