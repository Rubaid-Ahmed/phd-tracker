import { useState } from 'react';
import { Briefcase, Award, Plus, Trash2, X, ExternalLink } from 'lucide-react';

const TYPES = [
  { value: 'scholarship', label: 'Scholarship', color: 'bg-purple-100 text-purple-700' },
  { value: 'fellowship',  label: 'Fellowship',  color: 'bg-blue-100 text-blue-700' },
  { value: 'internship',  label: 'Internship',  color: 'bg-amber-100 text-amber-700' },
  { value: 'grant',       label: 'Grant',       color: 'bg-emerald-100 text-emerald-700' },
  { value: 'other',       label: 'Other',       color: 'bg-slate-100 text-slate-600' },
];

function typeStyle(t) {
  return TYPES.find(x => x.value === t)?.color || 'bg-slate-100 text-slate-600';
}
function typeLabel(t) {
  return TYPES.find(x => x.value === t)?.label || t;
}

export default function Opportunities({ opportunities = [], onChange }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ type: 'scholarship', name: '', description: '', url: '' });

  function handleAdd() {
    if (!form.name.trim()) return;
    onChange([...opportunities, { id: `op_${Date.now()}`, ...form, name: form.name.trim(), description: form.description.trim() }]);
    setForm({ type: 'scholarship', name: '', description: '', url: '' });
    setShowForm(false);
  }

  function handleRemove(id) {
    onChange(opportunities.filter(o => o.id !== id));
  }

  return (
    <div className="column-card">
      <div className="section-header">
        <div className="flex items-center gap-2">
          <Award size={15} className="text-purple-500" />
          <span className="column-title">Internships & Scholarships</span>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-ghost !px-2 !py-1">
          {showForm ? <X size={14} /> : <Plus size={14} />}
        </button>
      </div>

      {showForm && (
        <div className="bg-slate-50 rounded-lg p-3 space-y-2 border border-slate-200 fade-in">
          <div>
            <label className="label">Type</label>
            <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="input text-xs">
              {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Name / Title</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="e.g. NSF Graduate Research Fellowship"
              className="input text-xs"
            />
          </div>
          <div>
            <label className="label">Description <span className="text-slate-400">(optional)</span></label>
            <textarea
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Brief description, amount, eligibility…"
              className="input text-xs resize-none h-16"
            />
          </div>
          <div>
            <label className="label">Link <span className="text-slate-400">(optional)</span></label>
            <input
              type="url"
              value={form.url}
              onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
              placeholder="https://…"
              className="input text-xs"
            />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button onClick={() => setShowForm(false)} className="btn-ghost !py-1 !text-xs">Cancel</button>
            <button onClick={handleAdd} disabled={!form.name.trim()} className="btn-primary !py-1 !text-xs">Add</button>
          </div>
        </div>
      )}

      {opportunities.length === 0 && !showForm ? (
        <div className="empty-state">
          <Briefcase size={28} className="text-slate-200" />
          <p>No opportunities added yet</p>
          <button onClick={() => setShowForm(true)} className="btn-ghost !py-1 !text-xs mt-1">
            <Plus size={12} /> Add opportunity
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {opportunities.map(op => (
            <div key={op.id} className="group p-2.5 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`badge ${typeStyle(op.type)}`}>{typeLabel(op.type)}</span>
                    {op.url && (
                      <a href={op.url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                         className="text-indigo-500 hover:text-indigo-700">
                        <ExternalLink size={11} />
                      </a>
                    )}
                  </div>
                  <p className="text-xs font-medium text-slate-700">{op.name}</p>
                  {op.description && <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{op.description}</p>}
                </div>
                <button
                  onClick={() => handleRemove(op.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-300 hover:text-red-500 flex-shrink-0"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
