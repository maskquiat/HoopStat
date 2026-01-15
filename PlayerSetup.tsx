
import React, { useState, useEffect } from 'react';
import { Player } from '../types';

interface PlayerSetupProps {
  playerToEdit?: Player;
  onSave: (player: Player) => void;
  onBack: () => void;
}

export const PlayerSetup: React.FC<PlayerSetupProps> = ({ playerToEdit, onSave, onBack }) => {
  const [formData, setFormData] = useState({
    name: '',
    number: '',
    team: '',
    season: 'Fall 2025',
    photoUrl: ''
  });

  useEffect(() => {
    if (playerToEdit) {
      setFormData({
        name: playerToEdit.name,
        number: playerToEdit.number,
        team: playerToEdit.team,
        season: playerToEdit.season,
        photoUrl: playerToEdit.photoUrl || ''
      });
    }
  }, [playerToEdit]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.number) return;
    
    onSave({
      id: playerToEdit?.id || crypto.randomUUID(),
      ...formData,
      schedule: playerToEdit?.schedule || []
    });
    onBack();
  };

  const inputClasses = "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none";

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
      <h2 className="text-2xl font-black mb-6 dark:text-gray-100 italic uppercase">
        {playerToEdit ? 'Edit Player Profile' : 'Create Player Profile'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="flex-shrink-0 w-full md:w-auto flex justify-center">
            <div className="w-32 h-32 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-200 dark:border-gray-700 flex items-center justify-center relative overflow-hidden group hover:border-blue-400 transition-colors">
              {formData.photoUrl ? (
                <img src={formData.photoUrl} alt="Player" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-2">
                  <span className="text-3xl mb-1 block">📸</span>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-black tracking-widest">Add Photo</p>
                </div>
              )}
              <input 
                type="file" 
                accept="image/*" 
                onChange={handlePhotoUpload}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity pointer-events-none">
                <span className="text-white text-[10px] font-black uppercase">Change</span>
              </div>
            </div>
          </div>
          
          <div className="flex-1 space-y-4 w-full">
            <div>
              <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1.5 ml-1">Full Name</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g. Stephen Curry"
                className={inputClasses}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1.5 ml-1">Jersey #</label>
                <input 
                  type="text" 
                  required
                  value={formData.number}
                  onChange={e => setFormData(prev => ({ ...prev, number: e.target.value }))}
                  placeholder="30"
                  className={inputClasses}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1.5 ml-1">Team</label>
                <input 
                  type="text" 
                  required
                  value={formData.team}
                  onChange={e => setFormData(prev => ({ ...prev, team: e.target.value }))}
                  placeholder="Warriors"
                  className={inputClasses}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1.5 ml-1">Season</label>
              <select 
                value={formData.season}
                onChange={e => setFormData(prev => ({ ...prev, season: e.target.value }))}
                className={inputClasses}
              >
                <option value="Fall 2025">Fall 2025</option>
                <option value="Winter 2025">Winter 2025</option>
                <option value="Spring 2026">Spring 2026</option>
                <option value="Summer 2026">Summer 2026</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-50 dark:border-gray-800">
          <button 
            type="button"
            onClick={onBack}
            className="flex-1 py-4 text-gray-500 dark:text-gray-400 font-black uppercase text-xs tracking-widest hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl transition-all"
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="flex-[2] py-4 bg-blue-600 text-white font-black uppercase text-sm tracking-[0.1em] rounded-2xl shadow-xl shadow-blue-200 dark:shadow-none hover:bg-blue-700 active:scale-[0.98] transition-all"
          >
            {playerToEdit ? 'Save Changes' : 'Create Player Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};
