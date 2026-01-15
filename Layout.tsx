
import React from 'react';
import { AppView, Player } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: AppView;
  setView: (view: AppView) => void;
  activePlayer?: Player;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, setView, activePlayer, darkMode, setDarkMode }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 md:flex-row transition-colors duration-200">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
        <div className="p-6">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-xl font-bold text-blue-700 dark:text-blue-500">HoopStat</h1>
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              title="Toggle Dark Mode"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 uppercase tracking-widest font-semibold">Track the Game</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          <NavItem icon="📊" label="Dashboard" active={currentView === 'dashboard'} onClick={() => setView('dashboard')} />
          <NavItem icon="🏀" label="Live Track" active={currentView === 'tracking'} onClick={() => setView('tracking')} />
          <NavItem icon="📅" label="Schedule" active={currentView === 'schedule'} onClick={() => setView('schedule')} />
          <NavItem icon="📜" label="Player History" active={currentView === 'history'} onClick={() => setView('history')} />
          <NavItem icon="💎" label="Player Card" active={currentView === 'cards'} onClick={() => setView('cards')} />
          <NavItem icon="👤" label="Setup Player" active={currentView === 'setup'} onClick={() => setView('setup')} />
        </nav>

        {activePlayer && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 m-4 rounded-xl border border-blue-100 dark:border-blue-900/50">
            <div className="flex items-center gap-3">
              {activePlayer.photoUrl ? (
                <img src={activePlayer.photoUrl} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-gray-800 shadow-sm" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-200 dark:bg-blue-700 flex items-center justify-center text-blue-600 dark:text-blue-100 font-bold">
                  {activePlayer.name[0]}
                </div>
              )}
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-blue-900 dark:text-blue-200 truncate">{activePlayer.name}</p>
                <p className="text-xs text-blue-600 dark:text-blue-400">#{activePlayer.number}</p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 no-print">
        <header className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between sticky top-0 z-10 transition-colors duration-200">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-blue-700 dark:text-blue-500">HoopStat</h1>
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
          {activePlayer && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{activePlayer.name}</span>
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-200 font-bold text-sm overflow-hidden">
                {activePlayer.photoUrl ? (
                  <img src={activePlayer.photoUrl} alt="" className="w-full h-full object-cover" />
                ) : activePlayer.name[0]}
              </div>
            </div>
          )}
        </header>

        <div className="flex-1 p-4 md:p-8 overflow-y-auto pb-24 md:pb-8 no-print">
          {children}
        </div>

        {/* Bottom Nav - Mobile */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex justify-around items-center h-16 px-2 z-20 no-print transition-colors duration-200">
          <MobileNavItem icon="📊" label="Home" active={currentView === 'dashboard'} onClick={() => setView('dashboard')} />
          <MobileNavItem icon="🏀" label="Track" active={currentView === 'tracking'} onClick={() => setView('tracking')} />
          <MobileNavItem icon="📅" label="Sched" active={currentView === 'schedule'} onClick={() => setView('schedule')} />
          <MobileNavItem icon="📜" label="History" active={currentView === 'history'} onClick={() => setView('history')} />
          <MobileNavItem icon="💎" label="Card" active={currentView === 'cards'} onClick={() => setView('cards')} />
        </nav>
      </main>

      {/* Hidden container for printing only */}
      <div className="hidden no-print">
        {/* React renders into children, but we may need a specific print-only div if complex */}
      </div>
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick }: { icon: string, label: string, active: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
      active 
        ? 'bg-blue-600 text-white shadow-md dark:shadow-blue-900/20' 
        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
    }`}
  >
    <span className="text-xl">{icon}</span>
    {label}
  </button>
);

const MobileNavItem = ({ icon, label, active, onClick }: { icon: string, label: string, active: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center flex-1 h-full gap-1 ${
      active ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'
    }`}
  >
    <span className="text-xl">{icon}</span>
    <span className="text-[10px] font-bold uppercase">{label}</span>
  </button>
);
