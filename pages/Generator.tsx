import React, { useState, useRef, useEffect, memo } from 'react';
import { Send, Sparkles, Trash2, Bot, User as UserIcon, StopCircle } from 'lucide-react';
import { Button } from '../components/Button';
import { CodeBlock } from '../components/CodeBlock';
import { sendMessageToWaterIA, resetChat, startChatWithScript } from '../services/geminiService';
import { dbService } from '../services/authService';
import { User, AppView, ChatMessage, ScriptItem } from '../types';

// Memoized Message Component to prevent re-rendering entire list on input change
const ChatMessageItem = memo(({ msg, onSaveScript, userAvatar }: { 
  msg: ChatMessage, 
  onSaveScript: (code: string) => void,
  userAvatar?: boolean 
}) => {
  
  const renderMessageContent = (text: string) => {
    // Split text by code blocks to render them separately
    const parts = text.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('```')) {
        // Extract content inside backticks
        const codeContent = part.replace(/^```(?:lua)?\s*/i, '').replace(/```$/i, '').trim();
        return (
          <div key={index} className="my-4 w-full max-w-3xl">
             <CodeBlock code={codeContent} onSave={() => onSaveScript(codeContent)} showSaveButton={true} />
          </div>
        );
      }
      // Render regular text with line breaks
      if (!part.trim()) return null;
      return <p key={index} className="whitespace-pre-wrap mb-2 leading-relaxed">{part}</p>;
    });
  };

  return (
    <div className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-slide-up`}>
      {/* Avatar */}
      <div className={`flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center ${
        msg.role === 'user' ? 'bg-slate-700' : 'bg-gradient-to-br from-cyan-500 to-blue-600 shadow-[0_0_15px_rgba(6,182,212,0.5)]'
      }`}>
        {msg.role === 'user' ? <UserIcon size={18} /> : <Bot size={20} className="text-white" />}
      </div>

      {/* Bubble */}
      <div className={`flex flex-col max-w-[85%] md:max-w-[75%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
        <div className={`px-5 py-3 rounded-2xl ${
          msg.role === 'user' 
            ? 'bg-slate-800 text-slate-100 rounded-tr-none' 
            : 'bg-slate-900/80 border border-white/10 text-slate-200 rounded-tl-none backdrop-blur-sm shadow-lg'
        }`}>
          {msg.isError ? (
            <span className="text-red-400">{msg.text}</span>
          ) : (
            renderMessageContent(msg.text)
          )}
        </div>
      </div>
    </div>
  );
});

interface GeneratorProps {
  user: User | null;
  setView: (view: AppView) => void;
  initialScript?: ScriptItem | null;
}

export const Generator: React.FC<GeneratorProps> = ({ user, setView, initialScript }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const hasInitializedRef = useRef(false);

  // Initialize Chat (either fresh or with script)
  useEffect(() => {
    const initChat = async () => {
      // If we already initialized this exact session, skip
      if (hasInitializedRef.current) return;
      hasInitializedRef.current = true;

      setMessages([]); // Clear visual messages

      if (initialScript) {
        setIsLoading(true);
        // Special initialization with context
        const response = await startChatWithScript(initialScript.code, initialScript.title);
        
        setMessages([
          { role: 'user', text: `Quero continuar editando o script: ${initialScript.title}` },
          { role: 'model', text: response }
        ]);
        setIsLoading(false);
      } else {
        // Normal fresh start
        resetChat();
        setMessages([
            { role: 'model', text: 'Olá! Sou a Water IA. O que vamos criar para o Roblox hoje?' }
        ]);
      }
    };

    initChat();
    
    // Reset the ref when initialScript changes so we can re-init
    return () => {
      // Cleanup handled by ref logic
    }
  }, [initialScript]);

  // Reset flag when component unmounts or script changes completely
  useEffect(() => {
     hasInitializedRef.current = false;
  }, [initialScript?.id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    
    // Add User Message
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      // Get AI Response
      const responseText = await sendMessageToWaterIA(userMessage);
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Erro ao comunicar com a IA.", isError: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    resetChat();
    setMessages([{ role: 'model', text: 'Chat limpo. Mande uma nova ideia!' }]);
    hasInitializedRef.current = true; // Prevent re-loading initial script if cleared
  };

  // Helper to save specific code block
  const handleSaveScript = async (code: string) => {
    if (!user) {
      setView(AppView.LOGIN);
      return;
    }
    const title = `Script Water IA - ${new Date().toLocaleTimeString()}`;
    await dbService.saveScript(user, title, code);
    alert('Script salvo na biblioteca com sucesso!');
  };

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-80px)] p-2 md:p-4 flex flex-col">
      {/* Header Area */}
      <div className="flex items-center justify-between mb-4 bg-slate-900/50 p-4 rounded-xl border border-white/5 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/20 rounded-lg">
            <Sparkles className="text-cyan-400 w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-white">
              {initialScript ? `Editando: ${initialScript.title}` : 'Water Chat IA'}
            </h2>
            <p className="text-xs text-slate-400">Gemini 3.0 Pro • Contexto Ativo</p>
          </div>
        </div>
        <Button variant="ghost" onClick={handleClearChat} className="text-xs">
          <Trash2 size={16} /> <span className="hidden sm:inline">Limpar Chat</span>
        </Button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-6 px-2 md:px-4 pb-4">
        {messages.map((msg, idx) => (
          <ChatMessageItem 
            key={idx} 
            msg={msg} 
            onSaveScript={handleSaveScript} 
          />
        ))}
        {isLoading && (
          <div className="flex gap-4 animate-pulse">
            <div className="w-10 h-10 rounded-full bg-cyan-900/50 flex items-center justify-center">
              <Bot size={20} className="text-cyan-700" />
            </div>
            <div className="flex items-center gap-1 bg-slate-900/50 px-4 py-3 rounded-2xl rounded-tl-none border border-white/5">
              <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
              <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="mt-4 bg-slate-900/80 p-2 md:p-3 rounded-2xl border border-white/10 backdrop-blur-xl shadow-2xl flex items-end gap-2 relative z-20">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Peça um script ou peça para alterar o anterior (Ex: 'Crie uma GUI', 'Agora mude a cor para vermelho')..."
          className="w-full bg-transparent border-none text-white placeholder-slate-500 focus:ring-0 resize-none max-h-32 min-h-[44px] py-3 px-3"
          rows={1}
        />
        <Button 
          onClick={handleSend} 
          disabled={!input.trim() || isLoading}
          className="mb-1 rounded-xl h-10 w-10 md:w-auto md:px-6 !p-0 md:!py-2.5 flex items-center justify-center"
        >
          {isLoading ? <StopCircle size={20} /> : <Send size={18} />}
          <span className="hidden md:inline ml-2">Enviar</span>
        </Button>
      </div>
    </div>
  );
};