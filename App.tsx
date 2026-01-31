import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Generator } from './pages/Generator';
import { Library } from './pages/Library';
import { Login } from './pages/Login';
import { AppView, User, ScriptItem } from './types';
import { authService } from './services/authService';

function App() {
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  
  // State to hold the script being edited
  const [activeScript, setActiveScript] = useState<ScriptItem | null>(null);

  useEffect(() => {
    // Check for persisted session
    const checkAuth = async () => {
      const storedUser = authService.getCurrentUser();
      if (storedUser) {
        setUser(storedUser);
      }
      setLoadingAuth(false);
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
    setCurrentView(AppView.HOME);
  };

  const handleEditScript = (script: ScriptItem) => {
    setActiveScript(script);
    setCurrentView(AppView.GENERATOR);
  };

  const handleViewChange = (view: AppView) => {
    // If navigating to Generator manually, clear the active script so it starts fresh
    if (view === AppView.GENERATOR && currentView !== AppView.GENERATOR) {
      setActiveScript(null);
    }
    setCurrentView(view);
  };

  if (loadingAuth) {
    return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-cyan-500">Carregando Water IA...</div>;
  }

  return (
    <div className="min-h-screen text-slate-200 selection:bg-cyan-500/30">
      <Navbar 
        currentView={currentView} 
        setView={handleViewChange} 
        user={user}
        onLogout={handleLogout}
      />

      <main className="relative z-10">
        {/* Removed heavy SVG overlay for better performance */}
        <div className="relative z-10">
          {currentView === AppView.HOME && <Home onChangeView={handleViewChange} />}
          
          {currentView === AppView.GENERATOR && (
            <Generator 
              user={user} 
              setView={handleViewChange} 
              initialScript={activeScript}
            />
          )}
          
          {currentView === AppView.LIBRARY && (
            user ? (
              <Library user={user} onEditScript={handleEditScript} /> 
            ) : (
              <Login onLogin={setUser} setView={handleViewChange} />
            )
          )}
          
          {currentView === AppView.LOGIN && (
            <Login onLogin={setUser} setView={handleViewChange} />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;