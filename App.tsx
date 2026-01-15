
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { PlayerSetup } from './components/PlayerSetup';
import { GameTracker } from './components/GameTracker';
import { StatsHistory } from './components/StatsHistory';
import { TradingCardView } from './components/TradingCardView';
import { ScheduleManager } from './components/ScheduleManager';
import { Dashboard } from './components/Dashboard';
import { Player, GameStats, ScheduledGame, AppView } from './types';

const STORAGE_KEY_PLAYERS = 'hoop_stats_players';
const STORAGE_KEY_STATS = 'hoop_stats_data';
const STORAGE_KEY_DARKMODE = 'hoop_stats_darkmode';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('dashboard');
  const [players, setPlayers] = useState<Player[]>([]);
  const [stats, setStats] = useState<GameStats[]>([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEY_DARKMODE) === 'true';
  });

  useEffect(() => {
    const savedPlayers = localStorage.getItem(STORAGE_KEY_PLAYERS);
    const savedStats = localStorage.getItem(STORAGE_KEY_STATS);

    if (savedPlayers) {
      const parsed = JSON.parse(savedPlayers);
      setPlayers(parsed);
      if (parsed.length > 0 && !selectedPlayerId) {
        setSelectedPlayerId(parsed[0].id);
      }
    }
    if (savedStats) setStats(JSON.parse(savedStats));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PLAYERS, JSON.stringify(players));
  }, [players]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_DARKMODE, String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const addPlayer = (player: Player) => {
    setPlayers(prev => [...prev, { ...player, schedule: [] }]);
    setSelectedPlayerId(player.id);
  };

  const updatePlayer = (updatedPlayer: Player) => {
    setPlayers(prev => prev.map(p => p.id === updatedPlayer.id ? { ...p, ...updatedPlayer } : p));
    setView('dashboard');
  };

  const updatePlayerSchedule = (playerId: string, schedule: ScheduledGame[]) => {
    setPlayers(prev => prev.map(p => p.id === playerId ? { ...p, schedule } : p));
  };

  const addStats = (newStats: GameStats) => {
    setStats(prev => [...prev, newStats]);
    setView('history');
  };

  const activePlayer = players.find(p => p.id === selectedPlayerId);

  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return (
          <Dashboard 
            players={players} 
            stats={stats} 
            selectedPlayerId={selectedPlayerId}
            onSelectPlayer={setSelectedPlayerId}
            onNavigate={setView}
          />
        );
      case 'setup':
        return <PlayerSetup onSave={addPlayer} onBack={() => setView('dashboard')} />;
      case 'edit-player':
        return activePlayer ? (
          <PlayerSetup 
            playerToEdit={activePlayer} 
            onSave={updatePlayer} 
            onBack={() => setView('dashboard')} 
          />
        ) : null;
      case 'tracking':
        return activePlayer ? (
          <GameTracker 
            player={activePlayer} 
            schedule={activePlayer.schedule || []}
            onSave={addStats} 
            onCancel={() => setView('dashboard')} 
          />
        ) : (
          <div className="text-center p-8">
            <p className="text-gray-500 mb-4 dark:text-gray-400">Please select or create a player first.</p>
            <button 
              onClick={() => setView('setup')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Add Player
            </button>
          </div>
        );
      case 'history':
        return activePlayer ? (
          <StatsHistory stats={stats.filter(s => s.playerId === activePlayer.id)} player={activePlayer} />
        ) : null;
      case 'cards':
        return activePlayer ? (
          <TradingCardView player={activePlayer} stats={stats.filter(s => s.playerId === activePlayer.id)} />
        ) : null;
      case 'schedule':
        return activePlayer ? (
          <ScheduleManager 
            onUpdateSchedule={(sched) => updatePlayerSchedule(activePlayer.id, sched)} 
            existingSchedule={activePlayer.schedule || []} 
            playerName={activePlayer.name}
          />
        ) : (
          <div className="text-center p-8 text-gray-400">Please select a player to manage their schedule.</div>
        );
      default:
        return <Dashboard players={players} stats={stats} selectedPlayerId={selectedPlayerId} onSelectPlayer={setSelectedPlayerId} onNavigate={setView} />;
    }
  };

  return (
    <Layout 
      currentView={view} 
      setView={setView} 
      activePlayer={activePlayer}
      darkMode={darkMode}
      setDarkMode={setDarkMode}
    >
      {renderView()}
    </Layout>
  );
};

export default App;
