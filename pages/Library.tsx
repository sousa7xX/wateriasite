import React, { useEffect, useState } from 'react';
import { Trash2, Calendar, FileCode, MessageSquareCode } from 'lucide-react';
import { dbService } from '../services/authService';
import { User, ScriptItem } from '../types';
import { CodeBlock } from '../components/CodeBlock';
import { Button } from '../components/Button';

interface LibraryProps {
  user: User;
  onEditScript?: (script: ScriptItem) => void;
}

export const Library: React.FC<LibraryProps> = ({ user, onEditScript }) => {
  const [scripts, setScripts] = useState<ScriptItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadScripts();
  }, [user]);

  const loadScripts = async () => {
    setLoading(true);
    const data = await dbService.getUserScripts(user.id);
    setScripts(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja deletar este script?')) {
      await dbService.deleteScript(id);
      loadScripts();
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Sua Biblioteca</h1>
        <div className="text-slate-400">{scripts.length} scripts salvos</div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
        </div>
      ) : scripts.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/30 rounded-2xl border border-white/5">
          <FileCode size={48} className="mx-auto text-slate-600 mb-4" />
          <h3 className="text-xl font-semibold text-slate-300">Nenhum script salvo</h3>
          <p className="text-slate-500">Gere alguns scripts na aba Gerador e salve-os aqui!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {scripts.map((script) => (
            <div key={script.id} className="bg-slate-900/80 border border-slate-700 rounded-xl overflow-hidden shadow-lg backdrop-blur-sm transition-transform hover:-translate-y-1 hover:shadow-cyan-900/20">
              <div className="p-4 border-b border-slate-800 flex justify-between items-start">
                <div className="flex-1 mr-4">
                  <h3 className="font-bold text-lg text-cyan-300 mb-1 truncate">{script.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Calendar size={12} />
                    {new Date(script.createdAt).toLocaleDateString('pt-BR')} às {new Date(script.createdAt).toLocaleTimeString('pt-BR')}
                  </div>
                </div>
                <div className="flex gap-2">
                  {onEditScript && (
                    <Button 
                      onClick={() => onEditScript(script)}
                      variant="primary"
                      className="!px-3 !py-1.5 text-xs h-8"
                      title="Continuar conversa no chat"
                    >
                      <MessageSquareCode size={16} className="mr-1" />
                      Chat
                    </Button>
                  )}
                  <button 
                    onClick={() => handleDelete(script.id)}
                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors h-8 w-8 flex items-center justify-center"
                    title="Excluir"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="bg-[#0d1117] p-2 relative group">
                 <div className="max-h-60 overflow-y-auto custom-scrollbar">
                    <CodeBlock code={script.code} />
                 </div>
                 <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#0d1117] to-transparent pointer-events-none" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};