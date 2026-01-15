
import React, { useState, useRef } from 'react';
import { Player, GameStats } from '../types';

interface TradingCardViewProps {
  player: Player;
  stats: GameStats[];
}

export const TradingCardView: React.FC<TradingCardViewProps> = ({ player, stats }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isFlipped || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    const rotateX = (y - 0.5) * -30;
    const rotateY = (x - 0.5) * 30;
    
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const handleShare = async () => {
    const shareText = `Check out ${player.name}'s HoopStat Player Card! AVG: ${averages.pts} PPG.`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${player.name} - HoopStat`,
          text: shareText,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(shareText + " " + window.location.href);
      alert("Summary copied to clipboard!");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getPts = (g: GameStats) => (g.ftm) + (g.two_pm * 2) + (g.three_pm * 3);
  const getReb = (g: GameStats) => g.off_reb + g.def_reb;

  // Elite Game Logic: Double-Double or Triple-Double (10+ in at least 2 of Pts, Reb, Ast, Stl, Blk)
  const checkEliteStatus = (game: GameStats) => {
    const pts = getPts(game);
    const reb = getReb(game);
    const categories = [pts, reb, game.ast, game.stl, game.blk];
    const doubleDigits = categories.filter(val => val >= 10).length;
    return {
      isElite: doubleDigits >= 2,
      isTriple: doubleDigits >= 3,
      count: doubleDigits
    };
  };

  // Aggregated Stats
  const totalGames = stats.length;
  const totals = stats.reduce((acc, curr) => {
    const pts = getPts(curr);
    const reb = getReb(curr);
    return {
      pts: acc.pts + pts,
      reb: acc.reb + reb,
      ast: acc.ast + curr.ast,
      stl: acc.stl + curr.stl,
      blk: acc.blk + curr.blk,
      fga: acc.fga + curr.two_pa + curr.three_pa,
      fgm: acc.fgm + curr.two_pm + curr.three_pm,
      fta: acc.fta + curr.fta,
      ftm: acc.ftm + curr.ftm,
      tpa: acc.tpa + curr.three_pa,
      tpm: acc.tpm + curr.three_pm,
      maxPts: Math.max(acc.maxPts, pts),
    };
  }, { pts: 0, reb: 0, ast: 0, stl: 0, blk: 0, fga: 0, fgm: 0, fta: 0, ftm: 0, tpa: 0, tpm: 0, maxPts: 0 });

  const averages = {
    pts: totalGames ? (totals.pts / totalGames).toFixed(1) : '0.0',
    reb: totalGames ? (totals.reb / totalGames).toFixed(1) : '0.0',
    ast: totalGames ? (totals.ast / totalGames).toFixed(1) : '0.0',
    stl: totalGames ? (totals.stl / totalGames).toFixed(1) : '0.0',
    blk: totalGames ? (totals.blk / totalGames).toFixed(1) : '0.0',
  };

  const percentages = {
    fg: totals.fga > 0 ? Math.round((totals.fgm / totals.fga) * 100) + '%' : '0%',
    ft: totals.fta > 0 ? Math.round((totals.ftm / totals.fta) * 100) + '%' : '0%',
    tp: totals.tpa > 0 ? Math.round((totals.tpm / totals.tpa) * 100) + '%' : '0%',
  };

  // Notable Game Log: Top 3 statistical performances based on impact score (Pts + Reb + Ast + Stl + Blk)
  const notableGames = [...stats]
    .map(g => ({
      ...g,
      impactScore: getPts(g) + getReb(g) + g.ast + g.stl + g.blk
    }))
    .sort((a, b) => b.impactScore - a.impactScore)
    .slice(0, 3);

  return (
    <div className="flex flex-col items-center gap-8 py-8 no-print">
      <div className="text-center no-print">
        <h2 className="text-2xl font-black text-gray-800 dark:text-gray-100 italic uppercase tracking-tighter">HoopStat Collectible</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Tap to flip • Hover for Hologram</p>
      </div>

      <div 
        ref={cardRef}
        className="relative perspective-1000 w-[320px] h-[480px] cursor-pointer printable-card"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div 
          className="relative w-full h-full duration-700 preserve-3d shadow-2xl rounded-[32px] transition-transform"
          style={{ 
            transform: isFlipped ? 'rotateY(180deg)' : `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` 
          }}
        >
          {/* Card Front */}
          <div 
            className="absolute inset-0 backface-hidden rounded-[32px] bg-gray-900 overflow-hidden border-4 border-white shadow-[0_0_15px_rgba(0,0,0,0.5)]"
            style={{ transform: 'translateZ(1px)' }}
          >
            <div className="holographic absolute inset-0 z-[5]"></div>
            <div className="card-shine z-[25]"></div>
            
            <div className="absolute inset-0 z-10">
              {player.photoUrl ? (
                <img src={player.photoUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-blue-900 flex items-center justify-center text-8xl font-black text-blue-700 opacity-30">
                  {player.name[0]}
                </div>
              )}
            </div>

            <div className="absolute inset-x-0 bottom-0 p-6 z-20 bg-gradient-to-t from-black via-black/80 to-transparent">
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="text-white text-3xl font-black italic uppercase leading-none drop-shadow-lg">{player.name}</h3>
                  <p className="text-blue-400 font-bold uppercase tracking-widest text-xs mt-1">{player.team}</p>
                </div>
                <div className="text-right">
                  <span className="text-white text-5xl font-black opacity-40 italic drop-shadow-md">#{player.number}</span>
                </div>
              </div>
            </div>

            <div className="absolute top-6 left-6 z-20">
              <div className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/30 shadow-lg">
                <span className="text-[10px] font-black text-white uppercase tracking-tighter">{player.season}</span>
              </div>
            </div>
          </div>

          {/* Card Back - Professional Blank Canvas Statistics Side */}
          <div 
            className="absolute inset-0 backface-hidden rounded-[32px] bg-white border-4 border-gray-900 p-6 flex flex-col shadow-2xl overflow-hidden"
            style={{ transform: 'rotateY(180deg) translateZ(1px)' }}
          >
             {/* Subtle Pattern Background */}
             <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
               <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '15px 15px' }}></div>
             </div>

             <div className="relative z-10 flex flex-col h-full overflow-hidden">
                {/* Back Header */}
                <div className="border-b-2 border-gray-900 pb-3 mb-4 flex justify-between items-end">
                  <div>
                    <h3 className="text-xl font-black uppercase text-gray-900 leading-none">{player.name}</h3>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1.5">Official Statistics • Series 1</p>
                  </div>
                  <div className="text-right flex items-center gap-1.5">
                    <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white text-xs font-black italic">#{player.number}</div>
                  </div>
                </div>

                {/* Main Averages Section */}
                <div className="grid grid-cols-3 gap-y-4 gap-x-2 mb-6">
                  <StatDisplay label="AVG PTS" val={averages.pts} />
                  <StatDisplay label="AVG REB" val={averages.reb} />
                  <StatDisplay label="AVG AST" val={averages.ast} />
                  <StatDisplay label="AVG STL" val={averages.stl} />
                  <StatDisplay label="AVG BLK" val={averages.blk} />
                  <StatDisplay label="GAMES" val={totalGames} />
                </div>

                {/* Percentages Box */}
                <div className="bg-gray-900 rounded-2xl p-4 mb-6 shadow-xl relative overflow-hidden shrink-0">
                  <div className="absolute top-0 right-0 p-2 opacity-10">
                    <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4.5-9h-9c-.28 0-.5.22-.5.5s.22.5.5.5h9c.28 0 .5-.22.5-.5s-.22-.5-.5-.5z"/></svg>
                  </div>
                  <div className="flex justify-between items-center relative z-10">
                    <ShootingStat label="FG%" val={percentages.fg} />
                    <div className="w-[1px] bg-white/20 h-6"></div>
                    <ShootingStat label="3P%" val={percentages.tp} />
                    <div className="w-[1px] bg-white/20 h-6"></div>
                    <ShootingStat label="FT%" val={percentages.ft} />
                  </div>
                </div>

                {/* Season Highlights Divider */}
                <div className="mb-4 flex items-center gap-3 shrink-0">
                   <div className="flex-1 h-[1px] bg-gray-100"></div>
                   <span className="text-[8px] font-black text-gray-300 uppercase tracking-[0.2em]">Season High {totals.maxPts} Pts</span>
                   <div className="flex-1 h-[1px] bg-gray-100"></div>
                </div>

                {/* Notable Game Log - Static Display of Top 3 Games */}
                <div className="flex-1 min-h-0 flex flex-col">
                  <div className="flex items-center justify-between mb-2 px-1">
                    <h4 className="text-[10px] font-black uppercase text-gray-900 tracking-widest">Notable Game Log</h4>
                    <span className="text-[7px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded">Top Performances</span>
                  </div>
                  <div className="rounded-xl border border-gray-100 overflow-hidden bg-white">
                    <table className="w-full text-[9px] font-bold text-gray-900 border-collapse">
                      <thead className="bg-gray-50 text-gray-400 uppercase text-[7px] tracking-widest">
                        <tr>
                          <th className="py-2 px-2 text-left">DATE</th>
                          <th className="py-2 px-2 text-left">OPP</th>
                          <th className="py-2 px-2 text-center">PTS</th>
                          <th className="py-2 px-2 text-center">REB</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {notableGames.length > 0 ? notableGames.map((g, idx) => {
                          const pts = getPts(g);
                          const reb = getReb(g);
                          const { isElite, isTriple } = checkEliteStatus(g);
                          return (
                            <tr key={idx} className={`transition-colors ${isElite ? 'bg-blue-50/40' : ''}`}>
                              <td className="py-2 px-2 text-gray-400 tabular-nums">{new Date(g.date).toLocaleDateString(undefined, {month:'numeric', day:'numeric'})}</td>
                              <td className="py-2 px-2 truncate max-w-[90px] font-black flex items-center gap-1 uppercase">
                                {g.opponent}
                                {isElite && (
                                  <span title={isTriple ? "Triple-Double" : "Double-Double"} className="text-blue-500 text-[10px]">
                                    {isTriple ? '💎' : '⭐'}
                                  </span>
                                )}
                              </td>
                              <td className={`py-2 px-2 text-center tabular-nums ${isElite ? 'text-blue-600 font-black' : ''}`}>{pts}</td>
                              <td className="py-2 px-2 text-center tabular-nums">{reb}</td>
                            </tr>
                          );
                        }) : (
                          <tr><td colSpan={4} className="py-8 text-center text-gray-300 italic">No games logged</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  {notableGames.length > 0 && (
                     <p className="text-[7px] text-gray-300 mt-2 italic px-1 text-center">Based on Impact Score (Pts+Reb+Ast+Stl+Blk)</p>
                  )}
                </div>

                {/* Footer Seal */}
                <div className="mt-auto pt-4 border-t border-gray-100 text-center shrink-0">
                  <p className="text-[7px] font-black text-gray-300 uppercase tracking-[0.4em]">HoopStat Authentic • 2025</p>
                  <div className="flex justify-center mt-2 gap-0.5 opacity-20">
                    {[...Array(15)].map((_, i) => <div key={i} className="w-[1px] h-2 bg-black"></div>)}
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 no-print">
        <button 
          onClick={(e) => { e.stopPropagation(); handlePrint(); }}
          className="px-8 py-4 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-2xl font-bold shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <span>Print Physical Card</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); handleShare(); }}
          className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <span>Share Stats Card</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
        </button>
      </div>
    </div>
  );
};

const StatDisplay = ({ label, val }: any) => (
  <div className="text-center">
    <p className="text-[7px] font-black text-gray-400 uppercase tracking-tighter mb-0.5">{label}</p>
    <p className="text-xl font-black text-gray-900 tabular-nums italic leading-none">{val}</p>
  </div>
);

const ShootingStat = ({ label, val }: any) => (
  <div className="flex-1 text-center">
    <p className="text-[7px] font-black text-blue-400 uppercase tracking-widest mb-0.5">{label}</p>
    <p className="text-sm font-black text-white tabular-nums leading-none">{val}</p>
  </div>
);
