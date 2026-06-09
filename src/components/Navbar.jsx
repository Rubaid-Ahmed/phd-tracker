import { useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Settings2, RefreshCw, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import CollaborationModal from './CollaborationModal';

export default function Navbar() {
  const { syncing, syncError, githubConfig, loadFromGitHub } = useApp();
  const [showCollab, setShowCollab] = useState(false);

  return (
    <>
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 text-slate-900 hover:text-indigo-600 transition-colors">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <GraduationCap size={18} className="text-white" />
            </div>
            <span className="text-lg font-semibold tracking-tight">PhD Tracker</span>
          </Link>

          <div className="flex items-center gap-3">
            {githubConfig && (
              <div className="flex items-center gap-2">
                {syncing ? (
                  <span className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Loader2 size={13} className="animate-spin" /> Syncing…
                  </span>
                ) : syncError ? (
                  <span className="flex items-center gap-1.5 text-xs text-red-500" title={syncError}>
                    <AlertCircle size={13} /> Sync error
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-xs text-emerald-600">
                    <CheckCircle size={13} /> Synced
                  </span>
                )}
                <button onClick={loadFromGitHub} className="btn-ghost !px-2 !py-1" title="Refresh from GitHub">
                  <RefreshCw size={14} />
                </button>
              </div>
            )}
            <button
              onClick={() => setShowCollab(true)}
              className="btn-secondary text-xs"
            >
              <Settings2 size={14} />
              Collaboration
            </button>
          </div>
        </div>
      </nav>

      {showCollab && <CollaborationModal onClose={() => setShowCollab(false)} />}
    </>
  );
}
