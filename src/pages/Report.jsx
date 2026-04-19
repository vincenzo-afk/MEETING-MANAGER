import { useState } from 'react';
import { getMeetings } from '../utils/storage';
import MeetingCard from '../components/MeetingCard';
import ExportButton from '../components/ExportButton';

export default function Report() {
  const meetings = getMeetings();
  const [selectedId, setSelectedId] = useState('');

  const selected = meetings.find(m => m.id === selectedId) || null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white">📄 Meeting Reports</h1>
        <p className="text-slate-400 text-sm mt-1">Select a meeting to view its full report and download Excel.</p>
      </div>

      {/* Selector + export */}
      <div className="card p-6 flex flex-wrap items-end gap-4">
        <div className="flex-1 min-w-[220px]">
          <label className="label">Select Meeting</label>
          <select
            id="report-meeting-select"
            value={selectedId}
            onChange={e => setSelectedId(e.target.value)}
            className="input"
          >
            <option value="">— Choose a meeting —</option>
            {meetings.map(m => (
              <option key={m.id} value={m.id}>
                {m.title} ({m.clientName}) — {m.date || 'No date'}
              </option>
            ))}
          </select>
        </div>
        <ExportButton meeting={selected} />
      </div>

      {/* No meetings */}
      {meetings.length === 0 && (
        <div className="card p-12 text-center">
          <div className="text-5xl mb-4">📭</div>
          <p className="text-slate-400 font-medium">No meetings yet</p>
          <p className="text-slate-600 text-sm mt-1">Go to Scheduler and add your first meeting.</p>
        </div>
      )}

      {/* Placeholder */}
      {meetings.length > 0 && !selected && (
        <div className="card p-12 text-center">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-slate-400 font-medium">Select a meeting above to view its report</p>
        </div>
      )}

      {/* Report card */}
      {selected && <MeetingCard meeting={selected} />}
    </div>
  );
}
