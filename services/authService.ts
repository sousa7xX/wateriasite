import { User, ScriptItem } from '../types';

const USERS_KEY = 'water_ia_users';
const SCRIPTS_KEY = 'water_ia_scripts';
const CURRENT_USER_KEY = 'water_ia_current_user';

// Mock delay to simulate network
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
  login: async (username: string): Promise<User> => {
    await delay(600);
    const user = { username, id: `user_${username}` }; // Simple mock logic
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return user;
  },

  logout: async () => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  getCurrentUser: (): User | null => {
    const stored = localStorage.getItem(CURRENT_USER_KEY);
    return stored ? JSON.parse(stored) : null;
  }
};

export const dbService = {
  saveScript: async (user: User, title: string, code: string): Promise<ScriptItem> => {
    await delay(400);
    const scriptsRaw = localStorage.getItem(SCRIPTS_KEY);
    const scripts: ScriptItem[] = scriptsRaw ? JSON.parse(scriptsRaw) : [];
    
    const newScript: ScriptItem = {
      id: Date.now().toString(),
      title,
      code,
      createdAt: Date.now(),
      userId: user.id
    };
    
    scripts.unshift(newScript);
    localStorage.setItem(SCRIPTS_KEY, JSON.stringify(scripts));
    return newScript;
  },

  getUserScripts: async (userId: string): Promise<ScriptItem[]> => {
    await delay(300);
    const scriptsRaw = localStorage.getItem(SCRIPTS_KEY);
    const scripts: ScriptItem[] = scriptsRaw ? JSON.parse(scriptsRaw) : [];
    return scripts.filter(s => s.userId === userId);
  },

  deleteScript: async (scriptId: string): Promise<void> => {
    await delay(200);
    const scriptsRaw = localStorage.getItem(SCRIPTS_KEY);
    const scripts: ScriptItem[] = scriptsRaw ? JSON.parse(scriptsRaw) : [];
    const filtered = scripts.filter(s => s.id !== scriptId);
    localStorage.setItem(SCRIPTS_KEY, JSON.stringify(filtered));
  }
};