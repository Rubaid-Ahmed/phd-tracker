import { useState } from 'react';
import { Calendar, Plus, Trash2, X } from 'lucide-react';
import { format, parseISO, isValid } from 'date-fns';

export default function AdmissionDates({ dates = [], onChange }) {
  const [showForm, setShowForm] = useState(false);
  const [label, setLabel] = useState('');
  const [date, setDate]   = useState('');

  function handleAdd() {
    if (!label.trim() || !date) return;
    const newDates = [...dates, { id: `d_${Date.now()}`, label: label.trim(), date }];
    newDates.sort((a, b) => new Date(a.date) - new Date(b.date));
    onChange(newDates);
    setLabel(''); setDate(''); setShowForm(false);
  }

  function handleRemove(id) {
    onChange(dates.filter(d => d.id !== id));
  }

  const today = new Date();

  function statusColor(dateStr) {
    const d = parseISO(dateStr);
    if (!isValid(d)) return 'bg-slate-100 text-slate-500';
    const diff = Math.ceil((d - today) / 86400000);
    if (diff < 0) return 'bg-slate-100 text-slate-400 line-through';
    if (diff <= 30) return 'bg-red-100 text-red-700';
    if (diff <= 90) return 'bg-amber-100 text-amber-700';
    return 'bg-emerald-100 text-emerald-700';
  }

  function daysLabel(dateStr) {
    const d = parseISO(dateStr);
    if (!isValid(d)) return '';
    const diff = Math.ceil((d - today) / 86400000);
    if (diff < 0) return 'Passed';
    if (diff === 0) return 'Today!';
    return `${diff}d left`;
  }

  return (
    <div className="column-card">
      <div className="section-header">
        <div className="flex items-center gap-2">
          <Calendar size={15} className="text-indigo-500" />
          <span className="column-title">Admission Dates</span>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-ghost !px-2 !py-1">
          {showForm ? <X size={14} /> : <Plus size={14} />}
        </button>
      </div>

      {showForm && (
        <div className="bg-slate-50 rounded-lg p-3 space-y-2 border border-slate-200 fade-in">
          <div>
            <label className="label">Label</label>
            <input
              type="text"
              value={label}
              onChange={e => setLabel(e.target.value)}
              placeholder="e.g. Application Deadline"
              className="input text-xs"
            />
          </div>
          <div>
            <label className="label">Date</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="input text-xs"
            />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button onClick={() => { setShowForm(false); setLabel(''); setDate(''); }} className="btn-ghost !py-1 !text-xs">Cancel</button>
            <button onClick={handleAdd} disabled={!label.trim() || !date} className="btn-primary !py-1 !text-xs">Add Date</button>
          </div>
        </div>
      )}

      {dates.length === 0 && !showForm ? (
        <div className="empty-state">
          <Calendar size={28} className="text-slate-200" />
          <p>No dates added yet</p>
          <button onClick={() => setShowForm(true)} className="btn-ghost !py-1 !text-xs mt-1">
            <Plus size={12} /> Add date
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {dates.map(d => (
            <div key={d.id} className="group flex items-center gap-3 p-2.5 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-700 truncate">{d.label}</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isValid(parseISO(d.date)) ? format(parseISO(d.date), 'MMM d, yyyy') : d.date}
                </p>
              </div>
              <span className={`badge text-xs ${statusColor(d.date)}`}>{daysLabel(d.date)}</span>
              <button
                onClick={() => handleRemove(d.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-300 hover:text-red-500"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
