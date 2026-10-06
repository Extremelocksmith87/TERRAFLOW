import React, { useState } from 'react';
import { FLOOD_GUIDE_DOS, FLOOD_GUIDE_DONTS } from '../data/floodGuideData';
import { GuideItem, DontItem } from '../types/flood';
import { ShieldCheck, AlertOctagon, CheckSquare, Square, X, Filter, BookOpen, HeartHandshake, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FloodGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FloodGuideModal: React.FC<FloodGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'dos' | 'donts'>('dos');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  if (!isOpen) return null;

  const toggleCheck = (id: number) => {
    const updated = { ...checkedItems, [id]: !checkedItems[id] };
    setCheckedItems(updated);

    const checkedCount = Object.values(updated).filter(Boolean).length;
    if (checkedCount === 30) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const completedCount = Object.values(checkedItems).filter(Boolean).length;

  const filteredDos = FLOOD_GUIDE_DOS.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border-4 border-sky-300 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-sky-400 via-sky-500 to-cyan-500 p-5 sm:p-6 text-white flex items-start justify-between relative overflow-hidden">
          <div className="relative z-10 space-y-1">
            <span className="font-fun text-xs font-bold bg-white/20 px-3 py-1 rounded-full backdrop-blur-md inline-block uppercase tracking-wider text-sky-50">
              Civil Protection & Emergency Readiness
            </span>
            <h2 className="font-fun text-2xl sm:text-3xl font-extrabold tracking-tight">
              Flood Guide: 30 To-Dos & 10 Never-Dos
            </h2>
            <p className="text-xs sm:text-sm text-sky-100 max-w-xl">
              Official life-saving instructions for surviving flash floods, dam breaks, and storm surge inundations.
            </p>
          </div>

          <button
            onClick={onClose}
            className="relative z-10 p-2 rounded-2xl bg-white/20 hover:bg-white/30 text-white transition-colors"
            title="Close guide"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Switcher & Progress Bar */}
        <div className="bg-sky-50/80 px-5 py-3 border-b-2 border-sky-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('dos')}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'dos'
                  ? 'btn-cartoon-emerald text-white'
                  : 'btn-cartoon-white text-slate-700'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>30 Vital To-Dos ({completedCount}/30 Ready)</span>
            </button>

            <button
              onClick={() => setActiveTab('donts')}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'donts'
                  ? 'btn-cartoon-rose text-white'
                  : 'btn-cartoon-white text-slate-700'
              }`}
            >
              <AlertOctagon className="w-4 h-4" />
              <span>10 Dangerous Never-Dos</span>
            </button>
          </div>

          {activeTab === 'dos' && (
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-white px-3 py-1.5 rounded-xl border border-sky-200 shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Readiness Score: {Math.round((completedCount / 30) * 100)}%</span>
            </div>
          )}
        </div>

        {/* Sub-Filters for To-Dos */}
        {activeTab === 'dos' && (
          <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap gap-2 text-xs">
            <span className="font-bold text-slate-500 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Phase:
            </span>
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 rounded-xl font-bold transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-sky-600 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-200'
              }`}
            >
              All 30 To-Dos
            </button>
            <button
              onClick={() => setSelectedCategory('prepare')}
              className={`px-3 py-1 rounded-xl font-bold transition-colors ${
                selectedCategory === 'prepare'
                  ? 'bg-sky-600 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-200'
              }`}
            >
              Pre-Flood Prep (1-10)
            </button>
            <button
              onClick={() => setSelectedCategory('warning')}
              className={`px-3 py-1 rounded-xl font-bold transition-colors ${
                selectedCategory === 'warning'
                  ? 'bg-sky-600 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-200'
              }`}
            >
              Warning / Imminent (11-18)
            </button>
            <button
              onClick={() => setSelectedCategory('evacuate')}
              className={`px-3 py-1 rounded-xl font-bold transition-colors ${
                selectedCategory === 'evacuate'
                  ? 'bg-sky-600 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-200'
              }`}
            >
              During Flood / Evac (19-24)
            </button>
            <button
              onClick={() => setSelectedCategory('recovery')}
              className={`px-3 py-1 rounded-xl font-bold transition-colors ${
                selectedCategory === 'recovery' || selectedCategory === 'health'
                  ? 'bg-sky-600 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-200'
              }`}
            >
              Recovery & Health (25-30)
            </button>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'dos' ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Check off completed emergency actions to track your family preparedness:</span>
                <span className="font-mono font-bold text-sky-700">
                  {completedCount} of 30 Complete
                </span>
              </div>

              {filteredDos.map((item) => {
                const isChecked = !!checkedItems[item.id];

                return (
                  <div
                    key={item.id}
                    onClick={() => toggleCheck(item.id)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5 select-none ${
                      isChecked
                        ? 'bg-emerald-50/70 border-emerald-300 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-sky-300 shadow-xs'
                    }`}
                  >
                    <button
                      className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors shrink-0"
                      aria-label="Toggle completed"
                    >
                      {isChecked ? (
                        <CheckSquare className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-400" />
                      )}
                    </button>

                    <div className="flex-1 space-y-1">
                      <div className="flex flex-wrap items-center justify-between gap-1">
                        <span className="font-fun font-bold text-sm text-slate-900 flex items-center gap-2">
                          <span className="font-mono text-xs text-sky-600 bg-sky-100 px-2 py-0.5 rounded-lg">
                            #{item.id}
                          </span>
                          <span className={isChecked ? 'line-through text-slate-500' : ''}>
                            {item.title}
                          </span>
                        </span>

                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            item.priority === 'critical'
                              ? 'bg-rose-100 text-rose-700'
                              : item.priority === 'high'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-sky-100 text-sky-700'
                          }`}
                        >
                          {item.priority}
                        </span>
                      </div>

                      <p className={`text-xs leading-relaxed ${isChecked ? 'text-slate-500' : 'text-slate-600'}`}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* 10 NEVER-DOS TAB */
            <div className="space-y-4">
              <div className="bg-rose-50 border-2 border-rose-300 p-4 rounded-2xl flex items-center gap-3">
                <AlertOctagon className="w-6 h-6 text-rose-600 shrink-0" />
                <p className="text-xs text-rose-900 leading-relaxed font-medium">
                  <strong>Critical Warning:</strong> The following 10 actions are responsible for more than 85% of preventable flood fatalities worldwide. Memorize and strictly avoid these hazards.
                </p>
              </div>

              <div className="space-y-3">
                {FLOOD_GUIDE_DONTS.map((dont) => (
                  <div
                    key={dont.id}
                    className="p-4 rounded-2xl border-2 border-rose-200 bg-white hover:border-rose-400 transition-all shadow-sm space-y-2"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-rose-600 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
                        {dont.id}
                      </span>
                      <h4 className="font-fun font-bold text-base text-rose-700">
                        {dont.rule}
                      </h4>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed pl-8">
                      <strong className="text-slate-900">Why It's Deadly:</strong> {dont.dangerExplanation}
                    </p>

                    <div className="ml-8 bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span><strong>Safe Action:</strong> {dont.safeAlternative}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t-2 border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-slate-500 font-medium">
            TerraFlow Emergency Education Standard · Always adhere to local civil defense alerts
          </span>

          <button
            onClick={onClose}
            className="btn-cartoon-primary px-6 py-2 rounded-2xl text-xs font-bold text-white shadow-md"
          >
            Done Reading
          </button>
        </div>
      </div>
    </div>
  );
};
