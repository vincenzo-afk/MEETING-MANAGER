import { useState } from 'react';
import { deleteMeeting } from '../utils/storage';

function StatusBadge({ status }) {
  if (status === 'Completed') return <span className="badge-completed">✅ Completed</span>;
  if (status === 'Cancelled') return <span className="badge-cancelled">❌ Cancelled</span>;
  return <span className="badge-upcoming">🔵 Upcoming</span>;
}

export default function MeetingTable({ meetings, onEdit, onRefresh, filterStatus }) {
  const [confirmDelete, setConfirmDelete] = useState(null);

  const filtered = filterStatus && filterStatus !== 'All'
    ? meetings.filter(m => m.status === filterStatus)
    : meetings;

  const handleDelete = id => {
    deleteMeeting(id);
    setConfirmDelete(null);
    onRefresh?.();
  };

  if (filtered.length === 0) {
    return (
      <div className="card p-12 text-center">
        <div className="text-5xl mb-4">📭</div>
        <p className="text-slate-400 font-medium">No meetings found</p>
        <p className="text-slate-600 text-sm mt-1">Add a new meeting to get started.</p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="text-left px-5 py-3.5 text-slate-400 font-semibold">#</th>
              <th className="text-left px-5 py-3.5 text-slate-400 font-semibold">Meeting</th>
              <th className="text-left px-5 py-3.5 text-slate-400 font-semibold">Client</th>
              <th className="text-left px-5 py-3.5 text-slate-400 font-semibold">Date & Time</th>
              <th className="text-left px-5 py-3.5 text-slate-400 font-semibold">Status</th>
              <th className="text-left px-5 py-3.5 text-slate-400 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m, idx) => (
              <tr
                key={m.id}
                className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors duration-150"
              >
                <td className="px-5 py-4 text-slate-500">{idx + 1}</td>
                <td className="px-5 py-4">
                  <p className="font-medium text-slate-100">{m.title}</p>
                  <p className="text-slate-500 text-xs mt-0.5 truncate max-w-[180px]">{m.agenda || '—'}</p>
                </td>
                <td className="px-5 py-4">
                  <p className="text-slate-200">{m.clientName}</p>
                  <p className="text-slate-500 text-xs">{m.inchargeName || '—'}</p>
                </td>
                <td className="px-5 py-4">
                  <p className="text-slate-200">{m.date || '—'}</p>
                  <p className="text-slate-500 text-xs">{m.time || '—'}</p>
                </td>
                <td className="px-5 py-4">
                  <StatusBadge status={m.status} />
                </td>
                <td className="px-5 py-4">
                  {confirmDelete === m.id ? (
                    <div className="flex items-center gap-2">
                      <button
                        id={`confirm-delete-${m.id}`}
                        onClick={() => handleDelete(m.id)}
                        className="btn-danger"
                      >
                        Confirm
                      </button>
                      <button onClick={() => setConfirmDelete(null)} className="btn-secondary text-xs px-2 py-1">
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        id={`edit-btn-${m.id}`}
                        onClick={() => onEdit?.(m)}
                        className="btn-edit"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        id={`delete-btn-${m.id}`}
                        onClick={() => setConfirmDelete(m.id)}
                        className="btn-danger"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
