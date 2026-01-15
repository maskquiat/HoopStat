
import React from 'react';
import { Player, GameStats, AppView } from '../types';

interface DashboardProps {
  players: Player[];
  stats: GameStats[];
  selectedPlayerId: string | null;
  onSelectPlayer: (id: string) => void;
  onNavigate: (view: AppView) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ players, stats, selectedPlayerId, onSelectPlayer, onNavigate }) => {
  if (players.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-4xl mb-6">⛹️‍♂️</div>
        <h2 className="text-2xl font-black text-gray-800 dark:text-gray-100 mb-2">Welcome to HoopStat</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm">Track basketball performance. Start by creating your first player profile.</p>
        <button 
          onClick={() => onNavigate('setup')}
          className="px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-100 dark:shadow-none active:scale-95 transition-all"
        >
          Create Player Profile
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Active Players Select */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xs font-black uppercase text-gray-400 dark:text-gray-500 tracking-widest px-1">Active Players</h2>
          <button 
            onClick={() => onNavigate('setup')}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 uppercase tracking-widest"
          >
            + Add Player
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {players.map(player => {
            const isSelected = player.id === selectedPlayerId;
            return (
              <button
                key={player.id}
                onClick={() => onSelectPlayer(player.id)}
                className={`flex items-center gap-4 p-5 rounded-2xl transition-all text-left group border-2 ${
                  isSelected 
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-600 dark:border-blue-500 ring-4 ring-blue-100 dark:ring-blue-900/40' 
                    : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-800'
                }`}
              >
                <div className={`w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 ${isSelected ? 'ring-2 ring-blue-400 dark:ring-blue-600' : 'bg-gray-50 dark:bg-gray-800'}`}>
                  {player.photoUrl ? (
                    <img src={player.photoUrl} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-black text-2xl">{player.name[0]}</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`font-black truncate ${isSelected ? 'text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-gray-100'}`}>{player.name}</h3>
                  <p className={`text-xs font-bold uppercase ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`}>#{player.number} • {player.team}</p>
                  {isSelected && (
                    <div className="mt-1 flex items-center gap-1">
                      <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase">Selected</span>
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse"></div>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Quick Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-900 rounded-[32px] p-8 text-white relative overflow-hidden shadow-xl border-b-8 border-blue-600 dark:border-blue-500">
          <div className="holographic absolute inset-0 opacity-10"></div>
          <div className="relative z-10">
            <h3 className="text-[10px] font-black uppercase text-blue-400 tracking-widest mb-1">HoopStat Analytics</h3>
            <p className="text-4xl font-black mb-6 italic uppercase">Stats Recap</p>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase">Games Logged</p>
                <p className="text-2xl font-black tabular-nums">{stats.length}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase">Total Points</p>
                <p className="text-2xl font-black tabular-nums">
                  {stats.reduce((acc, curr) => acc + (curr.ftm) + (curr.two_pm * 2) + (curr.three_pm * 3), 0)}
                </p>
              </div>
            </div>
            <button 
              onClick={() => onNavigate('history')}
              className="mt-8 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl text-sm font-bold transition-all border border-white/10"
            >
              View Full Player History
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-[32px] border border-gray-100 dark:border-gray-800 p-8 shadow-sm">
           <h3 className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-widest mb-1">Quick Actions</h3>
           <p className="text-3xl font-black text-gray-900 dark:text-gray-100 mb-6 uppercase italic">Pro Tools</p>
           <div className="space-y-3">
             <ActionBtn label="Start Game Tracking" sub="Live thumb-friendly entry" onClick={() => onNavigate('tracking')} />
             <ActionBtn label="Update Player Schedule" sub="Individual schedule management" onClick={() => onNavigate('schedule')} />
             <ActionBtn label="Edit Player Profile" sub="Update photo, team, or jersey #" onClick={() => onNavigate('edit-player')} />
             <ActionBtn label="Generate Player Card" sub="Premium color collectible" onClick={() => onNavigate('cards')} />
           </div>
        </div>
      </section>
    </div>
  );
};

const ActionBtn = ({ label, sub, onClick }: any) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors text-left group border border-transparent hover:border-blue-100 dark:hover:border-blue-800"
  >
    <div>
      <p className="font-bold text-gray-800 dark:text-gray-100">{label}</p>
      <p className="text-xs text-gray-400 dark:text-gray-500">{sub}</p>
    </div>
    <span className="text-xl group-hover:translate-x-1 transition-transform text-gray-400 dark:text-gray-600">→</span>
  </button>
);
