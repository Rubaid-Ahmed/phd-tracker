import { useState, useMemo } from 'react';
import { X, Search, Plus, Trophy, MapPin } from 'lucide-react';
import { QS_UNIVERSITIES } from '../data/qsRankings';
import { useApp } from '../context/AppContext';
import UniversityLogo from './UniversityLogo';
import toast from 'react-hot-toast';

export default function AddUniversityModal({ onClose }) {
  const { addUniversity, data } = useApp();
  const [query, setQuery] = useState('');

  const addedIds = useMemo(() => new Set(data.universities.map(u => u.rank)), [data.universities]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return QS_UNIVERSITIES.slice(0, 60);
    return QS_UNIVERSITIES.filter(
      u =>
        u.name.toLowerCase().includes(q) ||
        u.country.toLowerCase().includes(q) ||
        u.city.toLowerCase().includes(q)
    ).slice(0, 60);
  }, [query]);

  function handleAdd(uni) {
    if (addedIds.has(uni.rank)) return toast.error('Already added');
    addUniversity({
      id: `uni_${uni.rank}_${Date.now()}`,
      name: uni.name,
      shortName: uni.name.replace(/\(.*?\)/g, '').trim(),
      country: uni.country,
      city: uni.city,
      rank: uni.rank,
      domain: uni.domain,
      admissionDates: [],
      opportunities: [],
      professors: [],
    });
    toast.success(`${uni.name} added!`);
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box max-w-xl fade-in">
        <div className="modal-header">
          <h2 className="text-base font-semibold text-slate-900">Add University</h2>
          <button onClick={onClose} className="btn-ghost !p-1.5"><X size={18} /></button>
        </div>

        <div className="px-6 pt-4 pb-2">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by university name, country, or city…"
              className="input pl-9"
              autoFocus
            />
          </div>
          {!query && (
            <p className="text-xs text-slate-400 mt-2">Showing top 60 — type to search all 300+</p>
          )}
        </div>

        <div className="modal-body !pt-2 space-y-1">
          {filtered.length === 0 ? (
            <p className="text-center text-slate-400 text-sm py-8">No universities found</p>
          ) : (
            filtered.map(uni => {
              const added = addedIds.has(uni.rank);
              return (
                <button
                  key={uni.rank}
                  onClick={() => handleAdd(uni)}
                  disabled={added}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors
                    ${added
                      ? 'opacity-50 cursor-not-allowed bg-slate-50'
                      : 'hover:bg-indigo-50 hover:border-indigo-100 cursor-pointer'
                    }`}
                >
                  <UniversityLogo name={uni.name} domain={uni.domain} size={36} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{uni.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="flex items-center gap-1 text-xs text-slate-400">
                        <MapPin size={10} /> {uni.city}, {uni.country}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500 flex-shrink-0">
                    <Trophy size={12} />
                    <span className="text-xs font-semibold">#{uni.rank}</span>
                  </div>
                  {added ? (
                    <span className="text-xs text-slate-400 flex-shrink-0">Added</span>
                  ) : (
                    <Plus size={16} className="text-indigo-500 flex-shrink-0" />
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
