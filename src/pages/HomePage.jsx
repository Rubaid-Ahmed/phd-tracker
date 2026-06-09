import { useState } from 'react';
import { Plus, GraduationCap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import UniversityCard from '../components/UniversityCard';
import AddUniversityModal from '../components/AddUniversityModal';
import GlobalSearch from '../components/GlobalSearch';

export default function HomePage() {
  const { data } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const universities = data.universities;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              PhD Application Tracker
            </h1>
            <p className="text-slate-500 text-sm mt-2">
              Track universities, professors, deadlines, and opportunities in one place
            </p>
          </div>
          <GlobalSearch />
        </div>
      </div>

      {/* University grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              My Universities
              {universities.length > 0 && (
                <span className="ml-2 badge bg-indigo-100 text-indigo-700">{universities.length}</span>
              )}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Click a card to view details</p>
          </div>
          <button onClick={() => setShowAdd(true)} className="btn-primary">
            <Plus size={16} /> Add University
          </button>
        </div>

        {universities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
              <GraduationCap size={30} className="text-slate-300" />
            </div>
            <h3 className="text-slate-700 font-semibold mb-1">No universities yet</h3>
            <p className="text-slate-400 text-sm mb-5">
              Add universities from the QS World Rankings to start tracking
            </p>
            <button onClick={() => setShowAdd(true)} className="btn-primary">
              <Plus size={16} /> Add Your First University
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap gap-4">
            {universities.map(uni => (
              <UniversityCard key={uni.id} university={uni} />
            ))}
            <button
              onClick={() => setShowAdd(true)}
              className="w-44 min-h-[180px] flex flex-col items-center justify-center gap-2 rounded-xl
                         border-2 border-dashed border-slate-200 text-slate-400 hover:border-indigo-300
                         hover:text-indigo-500 hover:bg-indigo-50/50 transition-all cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full border-2 border-current flex items-center justify-center">
                <Plus size={18} />
              </div>
              <span className="text-xs font-medium">Add University</span>
            </button>
          </div>
        )}
      </div>

      {showAdd && <AddUniversityModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}
