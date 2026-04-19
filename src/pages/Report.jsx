import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getMeetings } from '../utils/storage';
import { formatDate, deriveStatus } from '../utils/formatters';
import { exportAllMeetingsExcel } from '../utils/excelExport';
import MeetingCard from '../components/MeetingCard';
import ExportButton from '../components/ExportButton';

function StatusBadge({ status }) {
  if (status === 'Completed') return <span className="badge-completed">✅</span>;
  if (status === 'Cancelled') return <span className="badge-cancelled">❌</span>;
  if (status === 'Overdue')   return <span className="badge-overdue">🔴</span>;
  return <span className="badge-upcoming">🔵</span>;
}

export default function Report() {
  // BUG #13: persist selectedId via URL query param ?id=...
  const [searchParams, setSearchParams] = useSearchParams();
  const meetings = getMeetings();

  // BUG #14: sort meetings by date descending (newest first)
  const sortedMeetings = [...meetings].sort((a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return b.date.localeCompare(a.date);
  });

  const initialId = searchParams.get('id') || '';
  const [selectedId, setSelectedId] = useState(initialId);

  // Keep URL in sync
  const handleSelect = (id) => {
    setSelectedId(id);
    if (id) setSearchParams({ id });
    else setSearchParams({});
  };

  // BUG #13: on mount, if URL has ?id= and it matches a meeting, use it
  useEffect(() => {
    const urlId = searchParams.get('id');
    if (urlId && meetings.find(m => m.id === urlId)) {
      setSelectedId(urlId);
    }
  }, []);

  const selected = meetings.find(m => m.id === selectedId) || null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">📄 Meeting Reports</h1>
          <p className="text-gray-500 text-sm mt-1">Select a meeting to view its full report and download Excel.</p>
        </div>
        {/* BUG #25: Export All button */}
        {meetings.length > 0 && (
          <button
            id="export-all-btn"
            onClick={() => exportAllMeetingsExcel(meetings)}
            className="btn-secondary"
          >
            🗂️ Export All (Excel)
          </button>
        )}
      </div>

      {/* Selector + export */}
      <div className="card p-6 flex flex-wrap items-end gap-4">
        <div className="flex-1 min-w-[220px]">
          <label className="label">Select Meeting</label>
          <select
            id="report-meeting-select"
            value={selectedId}
            onChange={e => handleSelect(e.target.value)}
            className="input"
          >
            <option value="">— Choose a meeting —</option>
            {/* BUG #14: sorted newest first */}
            {sortedMeetings.map(m => {
              const ds = deriveStatus(m);
              return (
                <option key={m.id} value={m.id}>
                  {m.title} ({m.clientName}) — {formatDate(m.date)} {ds === 'Overdue' ? '🔴' : ds === 'Completed' ? '✅' : ds === 'Cancelled' ? '❌' : '🔵'}
                </option>
              );
            })}
          </select>
        </div>
        <ExportButton meeting={selected} />
      </div>

      {/* No meetings */}
      {meetings.length === 0 && (
        <div className="card p-12 text-center bg-blue-50 border-blue-100">
          <div className="text-5xl mb-4 text-blue-500">📭</div>
          <p className="text-blue-800 font-medium text-lg">No meetings yet</p>
          <p className="text-blue-600 text-sm mt-1">Go to Scheduler and add your first meeting.</p>
        </div>
      )}

      {/* Placeholder */}
      {meetings.length > 0 && !selected && (
        <div className="card p-12 text-center bg-blue-50 border-blue-100">
          <div className="text-5xl mb-4 text-blue-500">🔍</div>
          <p className="text-blue-800 font-medium text-lg">Select a meeting above to view its report</p>
        </div>
      )}

      {/* Report card */}
      {selected && <MeetingCard meeting={selected} />}
    </div>
  );
}
