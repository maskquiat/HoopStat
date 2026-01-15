
import React, { useState, useEffect } from 'react';
import { ScheduledGame } from '../types';
import { parseSchedule } from '../geminiService';

interface ScheduleManagerProps {
  onUpdateSchedule: (schedule: ScheduledGame[]) => void;
  existingSchedule: ScheduledGame[];
  playerName: string;
}

export const ScheduleManager: React.FC<ScheduleManagerProps> = ({ onUpdateSchedule, existingSchedule, playerName }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [newGame, setNewGame] = useState({ opponent: '', date: '', time: '' });
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);

  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        const result = await parseSchedule(base64, file.type);
        if (result.games) {
          const formattedGames = result.games.map((g: any) => ({
            id: crypto.randomUUID(),
            ...g
          }));
          onUpdateSchedule([...existingSchedule, ...formattedGames]);
          setSuccessMsg(`${formattedGames.length} games added to ${playerName}'s schedule!`);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Failed to parse schedule", error);
      alert("Could not extract schedule. Please try a clearer image.");
    } finally {
      setIsProcessing(false);
    }
  };

  const addManualGame = () => {
    if (!newGame.opponent || !newGame.date) return;
    const gameId = crypto.randomUUID();
    onUpdateSchedule([...existingSchedule, { id: gameId, ...newGame }]);
    setLastAddedId(gameId);
    setSuccessMsg(`Game against ${newGame.opponent} added!`);
    setNewGame({ opponent: '', date: '', time: '' });
    
    setTimeout(() => setLastAddedId(null), 2000);
  };

  const removeGame = (id: string) => {
    onUpdateSchedule(existingSchedule.filter(g => g.id !== id));
  };

  // High contrast input classes for light mode: White BG, Dark Text, Visible Border
  const inputClasses = "w-full px-4 py-3 rounded-xl border border-gray-400 bg-white text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none block placeholder-gray-500";

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-black mb-1 dark:text-gray-100 italic uppercase">Schedule for {playerName}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Upload or enter games specific to this player.</p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100 dark:border-blue-800">
            Private Schedule
          </div>
        </div>

        {successMsg && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-700 dark:text-green-300 text-sm font-bold flex items-center gap-2 animate-bounce">
            <span className="text-lg">✅</span> {successMsg}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-4">
             <label className="block text-[10px] font-black uppercase text-gray-500 dark:text-gray-500 tracking-widest">Smart Extract (PDF/IMG)</label>
             <div className={`relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all ${isProcessing ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' : 'border-gray-200 dark:border-gray-800 hover:border-blue-400 dark:hover:border-blue-700'}`}>
               {isProcessing ? (
                 <div className="text-center space-y-4">
                   <div className="animate-spin text-4xl">🔄</div>
                   <p className="text-sm font-bold text-blue-600 dark:text-blue-400">HoopStat is processing schedule...</p>
                 </div>
               ) : (
                 <>
                   <span className="text-4xl mb-2">📄</span>
                   <p className="text-sm font-bold text-gray-700 dark:text-gray-300">Drop schedule here</p>
                   <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Extract dates automatically</p>
                   <input 
                     type="file" 
                     className="absolute inset-0 opacity-0 cursor-pointer"
                     onChange={handleFileUpload}
                     accept="image/*,.pdf"
                   />
                 </>
               )}
             </div>
          </div>

          {/* Manual Entry */}
          <div className="space-y-4">
             <label className="block text-[10px] font-black uppercase text-gray-500 dark:text-gray-400 tracking-widest">Manual Entry</label>
             <div className="space-y-4 bg-gray-50 dark:bg-gray-800/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-800">
               <div>
                 <span className="text-[9px] font-bold text-gray-700 dark:text-gray-300 block mb-1.5 ml-1">OPPONENT NAME</span>
                 <input 
                   type="text" 
                   placeholder="e.g. Lakers Academy" 
                   value={newGame.opponent}
                   onChange={e => setNewGame(prev => ({ ...prev, opponent: e.target.value }))}
                   className={inputClasses} 
                 />
               </div>
               <div>
                 <span className="text-[9px] font-bold text-gray-700 dark:text-gray-300 block mb-1.5 ml-1">GAME DATE</span>
                 <input 
                   type="date" 
                   value={newGame.date}
                   onChange={e => setNewGame(prev => ({ ...prev, date: e.target.value }))}
                   className={inputClasses} 
                 />
               </div>
               <button 
                 onClick={addManualGame}
                 className="w-full py-4 bg-blue-600 text-white font-black uppercase text-xs tracking-widest rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 dark:shadow-none mt-2 active:scale-[0.98]"
               >
                 Add to Schedule
               </button>
             </div>
          </div>
        </div>
      </div>

      {/* List Section */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden transition-colors">
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 flex justify-between items-center">
          <h3 className="text-sm font-black uppercase text-gray-500 dark:text-gray-400 tracking-widest">Upcoming Matchups</h3>
          <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded text-[10px] font-black uppercase">{existingSchedule.length} total</span>
        </div>
        <div className="divide-y divide-gray-50 dark:divide-gray-800">
          {existingSchedule.length > 0 ? (
            existingSchedule.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(game => (
              <div key={game.id} className={`p-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group ${lastAddedId === game.id ? 'bg-green-50 dark:bg-green-900/10' : ''}`}>
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-xl text-blue-600 dark:text-blue-400 ${lastAddedId === game.id ? 'bg-green-100 dark:bg-green-900/30' : 'bg-blue-100 dark:bg-blue-900/30'}`}>
                    <span className="text-xl">{lastAddedId === game.id ? '✅' : '🏀'}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 dark:text-gray-200">vs {game.opponent}</h4>
                    <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">{game.date} {game.time && `• ${game.time}`}</p>
                  </div>
                </div>
                <button 
                  onClick={() => removeGame(game.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 transition-all"
                  title="Remove Game"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-gray-400 dark:text-gray-600 text-sm italic">
              No games scheduled yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
