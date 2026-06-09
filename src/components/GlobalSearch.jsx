import { useState, useMemo } from 'react';
import { Search, X, Calendar, User, FlaskConical, Globe, MapPin, Trophy } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { format, parseISO, isValid } from 'date-fns';
import UniversityLogo from './UniversityLogo';

const TABS = [
  { id: 'all',       label: 'All',         icon: Search },
  { id: 'dates',     label: 'Dates',       icon: Calendar },
  { id: 'professors',label: 'Professors',  icon: User },
  { id: 'expertise', label: 'Expertise',   icon: FlaskConical },
  { id: 'countries', label: 'Countries',   icon: Globe },
];

export default function GlobalSearch() {
  const { data } = useApp();
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState('all');
  const navigate = useNavigate();

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];

    const out = [];
    for (const uni of data.universities) {
      if (tab === 'all' || tab === 'dates') {
        for (const d of (uni.admissionDates || [])) {
          if (d.label.toLowerCase().includes(q) || d.date.includes(q)) {
            out.push({ type: 'date', uni, item: d });
          }
        }
      }
      if (tab === 'all' || tab === 'professors') {
        for (const p of (uni.professors || [])) {
          if (p.name.toLowerCase().includes(q)) {
            out.push({ type: 'professor', uni, item: p });
          }
        }
      }
      if (tab === 'all' || tab === 'expertise') {
        for (const p of (uni.professors || [])) {
          if ((p.expertise || '').toLowerCase().includes(q)) {
            out.push({ type: 'expertise', uni, item: p });
          }
        }
      }
      if (tab === 'all' || tab === 'countries') {
        if (uni.country.toLowerCase().includes(q) || uni.city.toLowerCase().includes(q)) {
          out.push({ type: 'country', uni });
        }
      }
    }
    return out;
  }, [query, tab, data.universities]);

  function goToUni(id) {
    navigate(`/university/${id}`);
    setQuery('');
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex flex-wrap gap-1 mb-3 justify-center">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors
              ${tab === t.id
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
          >
            <t.icon size={11} />
            {t.label}
          </button>
        ))}
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={
            tab === 'dates'      ? 'Search admission dates…' :
            tab === 'professors' ? 'Search professor names…' :
            tab === 'expertise'  ? 'Search by area of expertise…' :
            tab === 'countries'  ? 'Search by country or city…' :
                                   'Search across all universities…'
          }
          className="w-full pl-11 pr-10 py-3 border border-slate-200 rounded-xl bg-white shadow-sm text-sm
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        {query && (
          <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500">
            <X size={16} />
          </button>
        )}
      </div>

      {query && (
        <div className="mt-2 bg-white border border-slate-200 rounded-xl shadow-card overflow-hidden fade-in">
          {results.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-sm">No results found</div>
          ) : (
            <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
              {results.map((r, i) => (
                <button
                  key={i}
                  onClick={() => goToUni(r.uni.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-indigo-50 text-left transition-colors"
                >
                  <UniversityLogo name={r.uni.name} domain={r.uni.domain} size={32} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800 truncate">{r.uni.shortName || r.uni.name}</p>
                    {r.type === 'date' && (
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <Calendar size={10} />
                        {r.item.label} — {isValid(parseISO(r.item.date)) ? format(parseISO(r.item.date), 'MMM d, yyyy') : r.item.date}
                      </p>
                    )}
                    {(r.type === 'professor' || r.type === 'expertise') && (
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <User size={10} />
                        {r.item.name}
                        {r.item.expertise && <span className="text-indigo-500 ml-1">· {r.item.expertise}</span>}
                      </p>
                    )}
                    {r.type === 'country' && (
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin size={10} /> {r.uni.city}, {r.uni.country}
                        <span className="ml-1 flex items-center gap-1 text-amber-500"><Trophy size={10} />#{r.uni.rank}</span>
                      </p>
                    )}
                  </div>
                  <span className="badge bg-slate-100 text-slate-500 text-xs capitalize">{r.type}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
