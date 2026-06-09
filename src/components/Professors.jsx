import { useState } from 'react';
import { Users, Plus, Trash2, X, Mail, FlaskConical, ChevronDown, ChevronUp, User } from 'lucide-react';

function ProfessorRow({ professor, onRemove }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="group border border-slate-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 transition-colors text-left"
      >
        <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
          <User size={13} className="text-indigo-600" />
        </div>
        <span className="flex-1 text-sm font-medium text-slate-800 truncate">{professor.name}</span>
        {expanded ? <ChevronUp size={14} className="text-slate-400 flex-shrink-0" /> : <ChevronDown size={14} className="text-slate-400 flex-shrink-0" />}
        <button
          onClick={e => { e.stopPropagation(); onRemove(professor.id); }}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-300 hover:text-red-500 flex-shrink-0 ml-1"
        >
          <Trash2 size={13} />
        </button>
      </button>

      {expanded && (
        <div className="px-3 pb-3 pt-1 border-t border-slate-100 bg-slate-50 space-y-1.5 fade-in">
          {professor.email && (
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Mail size={12} className="text-slate-400 flex-shrink-0" />
              <a href={`mailto:${professor.email}`} className="hover:text-indigo-600 hover:underline truncate">
                {professor.email}
              </a>
            </div>
          )}
          {professor.expertise && (
            <div className="flex items-start gap-2 text-xs text-slate-600">
              <FlaskConical size={12} className="text-slate-400 flex-shrink-0 mt-0.5" />
              <span>{professor.expertise}</span>
            </div>
          )}
          {professor.notes && (
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">{professor.notes}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function Professors({ professors = [], onChange }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', expertise: '', notes: '' });

  function handleAdd() {
    if (!form.name.trim()) return;
    onChange([...professors, {
      id: `p_${Date.now()}`,
      name: form.name.trim(),
      email: form.email.trim(),
      expertise: form.expertise.trim(),
      notes: form.notes.trim(),
    }]);
    setForm({ name: '', email: '', expertise: '', notes: '' });
    setShowForm(false);
  }

  function handleRemove(id) {
    onChange(professors.filter(p => p.id !== id));
  }

  return (
    <div className="column-card">
      <div className="section-header">
        <div className="flex items-center gap-2">
          <Users size={15} className="text-emerald-500" />
          <span className="column-title">Professors</span>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-ghost !px-2 !py-1">
          {showForm ? <X size={14} /> : <Plus size={14} />}
        </button>
      </div>

      {showForm && (
        <div className="bg-slate-50 rounded-lg p-3 space-y-2 border border-slate-200 fade-in">
          <div>
            <label className="label">Name <span className="text-red-400">*</span></label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Prof. Jane Smith"
              className="input text-xs"
              autoFocus
            />
          </div>
          <div>
            <label className="label">Email <span className="text-slate-400">(optional)</span></label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="jane.smith@university.edu"
              className="input text-xs"
            />
          </div>
          <div>
            <label className="label">Area of Expertise <span className="text-slate-400">(optional)</span></label>
            <input
              type="text"
              value={form.expertise}
              onChange={e => setForm(f => ({ ...f, expertise: e.target.value }))}
              placeholder="e.g. Machine Learning, NLP, Computer Vision"
              className="input text-xs"
            />
          </div>
          <div>
            <label className="label">Notes <span className="text-slate-400">(optional)</span></label>
            <textarea
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              placeholder="Research group, website, etc."
              className="input text-xs resize-none h-14"
            />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button onClick={() => setShowForm(false)} className="btn-ghost !py-1 !text-xs">Cancel</button>
            <button onClick={handleAdd} disabled={!form.name.trim()} className="btn-primary !py-1 !text-xs">Add Professor</button>
          </div>
        </div>
      )}

      {professors.length === 0 && !showForm ? (
        <div className="empty-state">
          <Users size={28} className="text-slate-200" />
          <p>No professors added yet</p>
          <button onClick={() => setShowForm(true)} className="btn-ghost !py-1 !text-xs mt-1">
            <Plus size={12} /> Add professor
          </button>
        </div>
      ) : (
        <div className="space-y-1.5">
          {professors.map(p => (
            <ProfessorRow key={p.id} professor={p} onRemove={handleRemove} />
          ))}
        </div>
      )}
    </div>
  );
}
