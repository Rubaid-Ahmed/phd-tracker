import { useNavigate } from 'react-router-dom';
import { MapPin, Trophy, Trash2 } from 'lucide-react';
import UniversityLogo from './UniversityLogo';
import { useApp } from '../context/AppContext';

export default function UniversityCard({ university }) {
  const navigate = useNavigate();
  const { removeUniversity } = useApp();

  function handleRemove(e) {
    e.stopPropagation();
    if (confirm(`Remove ${university.name}?`)) removeUniversity(university.id);
  }

  return (
    <div
      onClick={() => navigate(`/university/${university.id}`)}
      className="group relative card p-5 flex flex-col items-center gap-3 cursor-pointer
                 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200
                 w-44 min-h-[180px] flex-shrink-0"
    >
      <button
        onClick={handleRemove}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity
                   p-1 rounded-md hover:bg-red-50 text-slate-300 hover:text-red-500"
        title="Remove university"
      >
        <Trash2 size={13} />
      </button>

      <UniversityLogo name={university.name} domain={university.domain} size={56} />

      <div className="w-full text-center">
        <p className="text-xs font-semibold text-slate-900 leading-tight line-clamp-2 min-h-[32px]">
          {university.shortName || university.name}
        </p>
        <div className="flex items-center justify-center gap-1 mt-1.5 text-slate-400">
          <MapPin size={10} />
          <span className="text-xs truncate max-w-[120px]">{university.city}, {university.country}</span>
        </div>
        <div className="flex items-center justify-center gap-1 mt-1 text-amber-500">
          <Trophy size={10} />
          <span className="text-xs font-medium">QS #{university.rank}</span>
        </div>
      </div>
    </div>
  );
}
