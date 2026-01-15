
import React from 'react';
import { GameStats, Player } from '../types';

interface StatsHistoryProps {
  stats: GameStats[];
  player: Player;
}

export const StatsHistory: React.FC<StatsHistoryProps> = ({ stats, player }) => {
  if (stats.length === 0) {
    return (
      <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 transition-colors">
        <p className="text-gray-400 dark:text-gray-500 font-medium">No game stats logged yet for {player.name}.</p>
      </div>
    );
  }

  const sortedStats = [...stats].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Elite Game Logic: Double-Double or Triple-Double (10+ in at least 2 of Pts, Reb, Ast, Stl, Blk)
  const checkEliteStatus = (game: GameStats) => {
    const pts = game.ftm + (game.two_pm * 2) + (game.three_pm * 3);
    const reb = game.off_reb + game.def_reb;
    const categories = [pts, reb, game.ast, game.stl, game.blk];
    const doubleDigits = categories.filter(val => val >= 10).length;
    return {
      isElite: doubleDigits >= 2,
      isTriple: doubleDigits >= 3,
      count: doubleDigits
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-2xl font-black text-gray-800 dark:text-gray-100 italic uppercase">Player History</h2>
        <div className="text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full uppercase tracking-widest">{stats.length} Games Played</div>
      </div>

      <div className="space-y-4">
        {sortedStats.map((game) => {
          const pts = (game.ftm) + (game.two_pm * 2) + (game.three_pm * 3);
          const reb = game.off_reb + game.def_reb;
          const { isElite, isTriple, count } = checkEliteStatus(game);
          
          return (
            <div key={game.id} className={`bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border transition-all hover:shadow-md group ${isElite ? 'border-blue-500 dark:border-blue-600' : 'border-gray-100 dark:border-gray-800'}`}>
              <div className="flex justify-between items-center mb-5 border-b border-gray-50 dark:border-gray-800 pb-4">
                <div className="flex items-center gap-4">
                  <div className="bg-gray-900 dark:bg-gray-800 text-white w-14 h-14 rounded-2xl flex flex-col items-center justify-center shadow-lg border-b-4 border-blue-600 dark:border-blue-500 overflow-hidden">
                    {player.photoUrl ? (
                      <img src={player.photoUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center">
                        <span className="text-xl font-black leading-none">{player.number}</span>
                        <span className="text-[8px] font-black uppercase tracking-widest text-blue-400">#NO</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-black text-lg text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      vs {game.opponent}
                      {isElite && <span className="text-blue-500">{isTriple ? '💎' : '⭐'}</span>}
                    </h4>
                    <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{new Date(game.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end">
                   <div className="flex gap-2">
                     <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${isElite ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'}`}>
                       {isTriple ? 'Triple-Double' : isElite ? 'Double-Double' : 'Standard Game'}
                     </span>
                   </div>
                </div>
              </div>
              
              <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
                <StatMini label="PTS" val={pts} color={pts >= 10 ? "blue" : "gray"} />
                <StatMini label="REB" val={reb} color={reb >= 10 ? "blue" : "gray"} />
                <StatMini label="AST" val={game.ast} color={game.ast >= 10 ? "blue" : "gray"} />
                <StatMini label="STL" val={game.stl} color={game.stl >= 10 ? "blue" : "gray"} />
                <StatMini label="BLK" val={game.blk} color={game.blk >= 10 ? "blue" : "gray"} />
                <StatMini label="3PM" val={game.three_pm} />
                <StatMini label="TO" val={game.to} color="red" />
                <StatMini label="PF" val={game.pf} color={game.pf >= 5 ? "red" : "gray"} />
              </div>

              <div className="mt-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 flex justify-around text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-tighter">
                <div>FG: {game.two_pm + game.three_pm}/{game.two_pa + game.three_pa}</div>
                <div>3PT: {game.three_pm}/{game.three_pa}</div>
                <div>FT: {game.ftm}/{game.fta}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const StatMini = ({ label, val, color = "gray" }: any) => {
  const textColor = color === 'red' ? 'text-red-600 dark:text-red-400' : color === 'blue' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-100';
  return (
    <div className="text-center">
      <p className={`text-sm font-black tabular-nums ${textColor}`}>{val}</p>
      <p className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-tighter">{label}</p>
    </div>
  );
};
