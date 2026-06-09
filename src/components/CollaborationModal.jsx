import { useState, useEffect } from 'react';
import { X, GitBranch, Eye, EyeOff, Loader2, CheckCircle, UserPlus, Trash2, ExternalLink } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getAuthenticatedUser, createRepo, addCollaborator } from '../services/githubService';
import toast from 'react-hot-toast';

export default function CollaborationModal({ onClose }) {
  const { githubConfig, setGitBranchConfig, loadFromGitHub } = useApp();
  const [token, setToken] = useState(githubConfig?.token || '');
  const [repo, setRepo]   = useState(githubConfig?.repo || 'phd-tracker-data');
  const [showToken, setShowToken] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [collabUsername, setCollabUsername] = useState('');
  const [addingCollab, setAddingCollab] = useState(false);

  useEffect(() => {
    if (githubConfig?.token) verifyToken(githubConfig.token);
  }, []);

  async function verifyToken(t = token) {
    if (!t) return;
    setLoading(true);
    try {
      const u = await getAuthenticatedUser(t);
      setUser(u);
    } catch {
      toast.error('Invalid token or cannot reach GitHub');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleConnect() {
    if (!token || !repo) return toast.error('Token and repository name are required');
    setLoading(true);
    try {
      const u = await getAuthenticatedUser(token);
      setUser(u);
      // Try to create repo if it doesn't exist
      try {
        await createRepo(token, repo);
        toast.success('Data repository created!');
      } catch (e) {
        if (!e.message.includes('already exists')) throw e;
      }
      const config = { token, owner: u.login, repo };
      setGitBranchConfig(config);
      await loadFromGitHub();
      toast.success(`Connected as ${u.login}`);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddCollaborator() {
    if (!collabUsername.trim()) return;
    setAddingCollab(true);
    try {
      await addCollaborator(token, githubConfig.owner, githubConfig.repo, collabUsername.trim());
      toast.success(`Invitation sent to ${collabUsername}`);
      setCollabUsername('');
    } catch (e) {
      toast.error(e.message);
    } finally {
      setAddingCollab(false);
    }
  }

  function handleDisconnect() {
    setGitBranchConfig(null);
    setUser(null);
    setToken('');
    toast.success('Disconnected from GitHub');
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box max-w-lg fade-in">
        <div className="modal-header">
          <div className="flex items-center gap-2">
            <GitBranch size={20} className="text-slate-700" />
            <h2 className="text-base font-semibold text-slate-900">GitHub Collaboration</h2>
          </div>
          <button onClick={onClose} className="btn-ghost !p-1.5"><X size={18} /></button>
        </div>

        <div className="modal-body space-y-5">
          {!githubConfig ? (
            <>
              <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 text-sm text-indigo-800">
                <p className="font-medium mb-1">How GitHub sync works</p>
                <ol className="list-decimal list-inside space-y-1 text-indigo-700 text-xs">
                  <li>Create a GitHub Personal Access Token with <strong>repo</strong> scope</li>
                  <li>Enter it below — we'll create a <code className="bg-indigo-100 px-1 rounded">phd-tracker-data</code> repo</li>
                  <li>All your data is stored as JSON in that repo</li>
                  <li>Share access with collaborators using their GitHub username</li>
                </ol>
                <a
                  href="https://github.com/settings/tokens/new?scopes=repo&description=PhD+Tracker"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-2 text-indigo-600 font-medium text-xs hover:underline"
                >
                  Create token on GitHub <ExternalLink size={11} />
                </a>
              </div>

              <div>
                <label className="label">Personal Access Token</label>
                <div className="relative">
                  <input
                    type={showToken ? 'text' : 'password'}
                    value={token}
                    onChange={e => setToken(e.target.value)}
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                    className="input pr-10"
                  />
                  <button
                    onClick={() => setShowToken(!showToken)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showToken ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="label">Data Repository Name</label>
                <input
                  type="text"
                  value={repo}
                  onChange={e => setRepo(e.target.value)}
                  placeholder="phd-tracker-data"
                  className="input"
                />
                <p className="text-xs text-slate-400 mt-1">Will be created in your GitHub account if it doesn't exist.</p>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-100 rounded-lg">
                {user?.avatar_url && (
                  <img src={user.avatar_url} alt="" className="w-9 h-9 rounded-full border border-emerald-200" />
                )}
                <div>
                  <p className="text-sm font-semibold text-slate-900">{user?.name || user?.login}</p>
                  <p className="text-xs text-slate-500">
                    Syncing to <span className="font-mono text-emerald-700">{githubConfig.owner}/{githubConfig.repo}</span>
                  </p>
                </div>
                <CheckCircle size={18} className="text-emerald-500 ml-auto flex-shrink-0" />
              </div>

              <div>
                <label className="label">Add Collaborator</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={collabUsername}
                    onChange={e => setCollabUsername(e.target.value)}
                    placeholder="GitHub username"
                    className="input flex-1"
                    onKeyDown={e => e.key === 'Enter' && handleAddCollaborator()}
                  />
                  <button
                    onClick={handleAddCollaborator}
                    disabled={addingCollab || !collabUsername.trim()}
                    className="btn-primary"
                  >
                    {addingCollab ? <Loader2 size={14} className="animate-spin" /> : <UserPlus size={14} />}
                    Invite
                  </button>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  The invited user must also connect their own GitHub token and set repo to <span className="font-mono">{githubConfig.owner}/{githubConfig.repo}</span>.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                <p className="text-xs font-medium text-slate-700 mb-1">For collaborators to connect</p>
                <p className="text-xs text-slate-500">They should enter their own GitHub token and set the repository to:</p>
                <code className="text-xs bg-white border border-slate-200 rounded px-2 py-1 mt-1 block font-mono text-slate-700">
                  {githubConfig.owner}/{githubConfig.repo}
                </code>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          {githubConfig ? (
            <>
              <button onClick={handleDisconnect} className="btn-danger mr-auto">
                <Trash2 size={14} /> Disconnect
              </button>
              <button onClick={onClose} className="btn-secondary">Close</button>
            </>
          ) : (
            <>
              <button onClick={onClose} className="btn-secondary">Cancel</button>
              <button onClick={handleConnect} disabled={loading || !token || !repo} className="btn-primary">
                {loading ? <Loader2 size={14} className="animate-spin" /> : <GitBranch size={14} />}
                Connect GitHub
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
