
import React, { useState } from 'react';
import { Player, GameStats, ScheduledGame } from '../types';

interface GameTrackerProps {
  player: Player;
  schedule: ScheduledGame[];
  onSave: (stats: GameStats) => void;
  onCancel: () => void;
}

export const GameTracker: React.FC<GameTrackerProps> = ({ player, schedule, onSave, onCancel }) => {
  const [gameInfo, setGameInfo] = useState({
    opponent: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [counters, setCounters] = useState({
    ftm: 0, fta: 0,
    two_pm: 0, two_pa: 0,
    three_pm: 0, three_pa: 0,
    off_reb: 0, def_reb: 0,
    ast: 0, stl: 0, blk: 0,
    deflections: 0, to: 0, pf: 0
  });

  const increment = (key: keyof typeof counters) => {
    setCounters(prev => ({ ...prev, [key]: prev[key] + 1 }));
  };

  const decrement = (key: keyof typeof counters) => {
    setCounters(prev => ({ ...prev, [key]: Math.max(0, prev[key] - 1) }));
  };

  const calculatePoints = () => (counters.ftm * 1) + (counters.two_pm * 2) + (counters.three_pm * 3);

  const handleSave = () => {
    if (!gameInfo.opponent) {
      alert("Please enter an opponent name.");
      return;
    }
    const finalStats: GameStats = {
      id: crypto.randomUUID(),
      gameId: crypto.randomUUID(),
      playerId: player.id,
      ...gameInfo,
      ...counters
    };
    onSave(finalStats);
  };

  const selectFromSchedule = (game: ScheduledGame) => {
    let formattedDate = game.date;
    try {
      const d = new Date(game.date);
      if (!isNaN(d.getTime())) {
        formattedDate = d.toISOString().split('T')[0];
      }
    } catch(e) {}
    
    setGameInfo({ opponent: game.opponent, date: formattedDate });
  };

  const inputClasses = "w-full px-4 py-3 rounded-xl border border-gray-400 bg-white text-gray-900 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-100 outline-none focus:ring-2 focus:ring-blue-500 transition-all block appearance-none placeholder-gray-400";

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 transition-colors">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-600 dark:text-gray-500 uppercase tracking-widest mb-1 ml-1">Opponent</label>
              <input 
                type="text"
                value={gameInfo.opponent}
                onChange={e => setGameInfo(prev => ({ ...prev, opponent: e.target.value }))}
                placeholder="Vs. Opponent Name"
                className={inputClasses}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-600 dark:text-gray-500 uppercase tracking-widest mb-1 ml-1">Game Date</label>
              <input 
                type="date"
                value={gameInfo.date}
                onChange={e => setGameInfo(prev => ({ ...prev, date: e.target.value }))}
                className={inputClasses}
              />
            </div>
          </div>
          
          {schedule.length > 0 && (
            <div>
               <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-500 uppercase tracking-widest mb-2 ml-1">Select From Player Schedule</label>
               <div className="flex gap-2 overflow-x-auto py-1 scrollbar-hide">
                {schedule.slice(0, 10).map(game => (
                  <button
                    key={game.id}
                    onClick={() => selectFromSchedule(game)}
                    className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                      gameInfo.opponent === game.opponent ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-300'
                    }`}
                  >
                    {game.opponent} ({game.date})
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="space-y-6">
          <div className="md:sticky md:top-6 z-10">
            <div className="bg-gray-900 border-b-4 border-blue-600 dark:border-blue-500 rounded-2xl p-6 text-white text-center shadow-xl transform transition-transform hover:scale-[1.02]">
              <p className="text-[10px] font-black uppercase text-blue-400 tracking-[0.2em] mb-1">Live Score</p>
              <div className="flex items-center justify-center gap-2">
                <p className="text-6xl font-black text-white tabular-nums">{calculatePoints()}</p>
                <span className="text-blue-400 font-black text-2xl italic uppercase">pts</span>
              </div>
              <div className="mt-4 flex justify-around border-t border-white/10 pt-4">
                <div className="text-center">
                  <p className="text-[9px] font-black text-gray-500 uppercase">2PT</p>
                  <p className="text-sm font-bold">{counters.two_pm}/{counters.two_pa}</p>
                </div>
                <div className="text-center">
                  <p className="text-[9px] font-black text-gray-500 uppercase">3PT</p>
                  <p className="text-sm font-bold">{counters.three_pm}/{counters.three_pa}</p>
                </div>
                <div className="text-center">
                  <p className="text-[9px] font-black text-gray-500 uppercase">FT</p>
                  <p className="text-sm font-bold">{counters.ftm}/{counters.fta}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase text-gray-400 dark:text-gray-500 tracking-widest ml-1">Shooting</h3>
            
            <StatPad 
              label="Free Throws" 
              made={counters.ftm} 
              att={counters.fta}
              onMade={() => { increment('ftm'); increment('fta'); }}
              onMiss={() => increment('fta')}
              onUndoMade={() => { decrement('ftm'); decrement('fta'); }}
              onUndoMiss={() => decrement('fta')}
            />
            
            <StatPad 
              label="2PT Field Goals" 
              made={counters.two_pm} 
              att={counters.two_pa}
              onMade={() => { increment('two_pm'); increment('two_pa'); }}
              onMiss={() => increment('two_pa')}
              onUndoMade={() => { decrement('two_pm'); decrement('two_pa'); }}
              onUndoMiss={() => decrement('two_pa')}
            />

            <StatPad 
              label="3PT Field Goals" 
              made={counters.three_pm} 
              att={counters.three_pa}
              onMade={() => { increment('three_pm'); increment('three_pa'); }}
              onMiss={() => increment('three_pa')}
              onUndoMade={() => { decrement('three_pm'); decrement('three_pa'); }}
              onUndoMiss={() => decrement('three_pa')}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase text-gray-400 dark:text-gray-500 tracking-widest ml-1">Gameplay</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <Counter label="Off Rebound" val={counters.off_reb} onAdd={() => increment('off_reb')} onSub={() => decrement('off_reb')} />
            <Counter label="Def Rebound" val={counters.def_reb} onAdd={() => increment('def_reb')} onSub={() => decrement('def_reb')} />
            <Counter label="Assists" val={counters.ast} onAdd={() => increment('ast')} onSub={() => decrement('ast')} />
            <Counter label="Steals" val={counters.stl} onAdd={() => increment('stl')} onSub={() => decrement('stl')} />
            <Counter label="Blocks" val={counters.blk} onAdd={() => increment('blk')} onSub={() => decrement('blk')} />
            <Counter label="Deflections" val={counters.deflections} onAdd={() => increment('deflections')} onSub={() => decrement('deflections')} />
            <Counter label="Turnovers" val={counters.to} onAdd={() => increment('to')} onSub={() => decrement('to')} color="red" />
            <Counter label="Fouls" val={counters.pf} onAdd={() => increment('pf')} onSub={() => decrement('pf')} color={counters.pf >= 4 ? "red" : "gray"} />
          </div>
        </div>
      </div>

      <div className="sticky bottom-4 md:static flex gap-4 mt-8 no-print">
        <button 
          onClick={onCancel}
          className="flex-1 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-bold rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm"
        >
          Discard Game
        </button>
        <button 
          onClick={handleSave}
          className="flex-[2] py-4 bg-green-600 text-white font-bold rounded-2xl shadow-lg shadow-green-200 dark:shadow-none hover:bg-green-700 active:scale-95 transition-all"
        >
          Save Game Stats
        </button>
      </div>
    </div>
  );
};

const StatPad = ({ label, made, att, onMade, onMiss, onUndoMade, onUndoMiss }: any) => {
  const pct = att > 0 ? Math.round((made / att) * 100) : 0;
  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col gap-3 transition-all hover:border-blue-200 dark:hover:border-blue-800">
      <div className="flex justify-between items-center">
        <span className="text-sm font-black text-gray-700 dark:text-gray-200">{label}</span>
        <div className="flex gap-2 items-center bg-gray-50 dark:bg-gray-800 px-3 py-1 rounded-full">
          <span className="text-xs font-bold text-gray-400 dark:text-gray-500">{made}/{att}</span>
          <span className={`text-xs font-black ${pct > 60 ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'}`}>{pct}%</span>
        </div>
      </div>
      
      <div className="flex gap-2">
        <div className="flex-1 flex flex-col gap-1">
          <button 
            onClick={onMade}
            className="flex-1 py-5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-xl font-black text-lg border-2 border-green-200 dark:border-green-800 active:bg-green-600 active:text-white transition-all select-none"
          >
            MAKE
          </button>
          <button 
            onClick={onUndoMade}
            className="py-2 bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 rounded-lg text-[10px] font-bold hover:bg-gray-100 dark:hover:bg-gray-700 uppercase"
          >
            Undo Make
          </button>
        </div>
        
        <div className="flex-1 flex flex-col gap-1">
          <button 
            onClick={onMiss}
            className="flex-1 py-5 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-xl font-black text-lg border-2 border-red-200 dark:border-red-800 active:bg-red-600 active:text-white transition-all select-none"
          >
            MISS
          </button>
          <button 
            onClick={onUndoMiss}
            className="py-2 bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 rounded-lg text-[10px] font-bold hover:bg-gray-100 dark:hover:bg-gray-700 uppercase"
          >
            Undo Miss
          </button>
        </div>
      </div>
    </div>
  );
};

const Counter = ({ label, val, onAdd, onSub, color = "blue" }: any) => {
  const isRed = color === 'red';
  return (
    <div className={`p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col items-center gap-2 bg-white dark:bg-gray-900 transition-all hover:border-blue-200 dark:hover:border-blue-800`}>
      <span className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 text-center leading-none h-4 tracking-tighter">{label}</span>
      <span className={`text-3xl font-black ${isRed ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-gray-100'} tabular-nums`}>{val}</span>
      <div className="flex gap-1 w-full mt-1">
        <button onClick={onSub} className="flex-1 py-3 bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 font-bold transition-colors">-</button>
        <button 
          onClick={onAdd} 
          className={`flex-[2] py-3 ${isRed ? 'bg-red-600 dark:bg-red-500' : 'bg-blue-600 dark:bg-blue-500'} text-white rounded-lg font-bold shadow-md dark:shadow-none active:scale-95 transition-all`}
        >
          +
        </button>
      </div>
    </div>
  );
};
