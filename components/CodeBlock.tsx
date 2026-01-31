import React, { useState, useMemo } from 'react';
import { Copy, Check, Save } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  onSave?: () => void;
  showSaveButton?: boolean;
}

// Optimized CodeBlock with Memoization
export const CodeBlock: React.FC<CodeBlockProps> = React.memo(({ code, onSave, showSaveButton = false }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Heavy Regex processing is now cached
  const highlightedCode = useMemo(() => {
    return code
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/(--.*)/g, '<span class="text-slate-500 italic">$1</span>') // Comments
      .replace(/\b(local|function|end|if|then|else|elseif|while|do|for|in|return|true|false|nil)\b/g, '<span class="text-purple-400 font-bold">$1</span>') // Keywords
      .replace(/\b(game|workspace|script|Instance|Vector3|CFrame|Color3|UDim2)\b/g, '<span class="text-yellow-300">$1</span>') // Globals
      .replace(/(["'].*?["'])/g, '<span class="text-green-300">$1</span>') // Strings
      .replace(/\b(\d+)\b/g, '<span class="text-blue-300">$1</span>'); // Numbers
  }, [code]);

  return (
    <div className="relative group rounded-xl overflow-hidden border border-slate-700 bg-[#0d1117] shadow-2xl w-full my-2 transform transition-transform will-change-transform">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800/80 border-b border-slate-700 backdrop-blur-sm">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
          <span className="ml-2 text-xs text-slate-400 font-mono hidden sm:inline-block">Water IA Script</span>
        </div>
        
        <div className="flex items-center gap-2">
          {showSaveButton && (
            <button
              onClick={onSave}
              className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-white/10 text-xs text-slate-400 hover:text-cyan-400 transition-colors"
              title="Salvar na Biblioteca"
            >
              <Save size={14} />
              <span className="hidden sm:inline">Salvar</span>
            </button>
          )}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-white/10 text-xs text-slate-400 hover:text-green-400 transition-colors"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copiado" : "Copiar"}
          </button>
        </div>
      </div>
      
      {/* Code Content */}
      <div className="p-4 overflow-x-auto custom-scrollbar">
        <pre className="font-mono text-sm leading-6 whitespace-pre">
          <code className="block text-cyan-50" dangerouslySetInnerHTML={{ __html: highlightedCode }} />
        </pre>
      </div>
      
      {/* Bottom info */}
      <div className="px-4 py-1 bg-slate-900 border-t border-slate-800 text-[10px] text-slate-600 flex justify-between">
        <span>Luau</span>
        <span>Water IA Hub</span>
      </div>
    </div>
  );
});