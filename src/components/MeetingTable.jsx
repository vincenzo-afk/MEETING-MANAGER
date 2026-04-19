import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteMeeting } from '../utils/storage';
import { formatDate, formatTime, deriveStatus } from '../utils/formatters';

// BUG #7: includes Overdue as a possible derived status
function StatusBadge({ status }) {
  if (status === 'Completed') return <span className="badge-completed">✅ Completed</span>;
  if (status === 'Cancelled') return <span className="badge-cancelled">❌ Cancelled</span>;
  if (status === 'Overdue')   return <span className="badge-overdue">🔴 Overdue</span>;
  return <span className="badge-upcoming">🔵 Upcoming</span>;
}

// BUG #9: Full-width delete confirmation bar rendered as a separate row
function DeleteConfirmRow({ colSpan, onConfirm, onCancel }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-5 py-3 bg-red-50 border-b border-red-100">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-red-700 text-sm font-medium">⚠️ Are you sure you want to delete this meeting?</span>
          <button
            onClick={onConfirm}
            className="btn-danger"
          >
            Yes, Delete
          </button>
          <button onClick={onCancel} className="btn-secondary text-sm px-3 py-1.5">
            Keep It
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function MeetingTable({ meetings, onEdit, onRefresh, filterStatus }) {
  const navigate = useNavigate();
  const [confirmDelete, setConfirmDelete] = useState(null);

  const filtered = filterStatus && filterStatus !== 'All'
    ? meetings.filter(m => deriveStatus(m) === filterStatus || m.status === filterStatus)
    : meetings;

  const handleDelete = id => {
    deleteMeeting(id);
    setConfirmDelete(null);
    onRefresh?.();
  };

  if (filtered.length === 0) {
    return (
      <div className="card p-12 text-center bg-blue-50 border-blue-100">
        <div className="text-5xl mb-4 text-blue-500">📭</div>
        {/* BUG #19: mention active filter in empty state */}
        <p className="text-blue-800 font-medium text-lg">
          {filterStatus && filterStatus !== 'All'
            ? `No "${filterStatus}" meetings found`
            : 'No meetings found'}
        </p>
        <p className="text-blue-600 text-sm mt-1">
          {filterStatus && filterStatus !== 'All'
            ? 'Try a different filter or add a new meeting.'
            : 'Add a new meeting to get started.'}
        </p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      {/* BUG #10: overflow-x-auto to allow horizontal scroll on mobile */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left px-5 py-3.5 text-gray-500 font-semibold">#</th>
              <th className="text-left px-5 py-3.5 text-gray-500 font-semibold">Meeting</th>
              <th className="text-left px-5 py-3.5 text-gray-500 font-semibold">Client</th>
              <th className="text-left px-5 py-3.5 text-gray-500 font-semibold">Date & Time</th>
              <th className="text-left px-5 py-3.5 text-gray-500 font-semibold">Status</th>
              {/* BUG #10: sticky Actions column */}
              <th className="text-left px-5 py-3.5 text-gray-500 font-semibold sticky right-0 bg-gray-50 z-10 shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.06)]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m, idx) => {
              const displayStatus = deriveStatus(m); // BUG #7
              return (
                <React.Fragment key={m.id}>
                  <tr
                    key={m.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                    onClick={() => navigate(`/report?id=${m.id}`)} // BUG #20
                  >
                    <td className="px-5 py-4 text-gray-500" onClick={e => e.stopPropagation()}>{idx + 1}</td>
                    <td className="px-5 py-4 max-w-[200px]" onClick={e => e.stopPropagation()}>
                      {/* BUG #8: break-words on long titles */}
                      <p className="font-medium text-gray-900 break-words">{m.title}</p>
                      <p className="text-gray-500 text-xs mt-0.5 line-clamp-1">{m.agenda || '—'}</p>
                    </td>
                    <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                      <p className="text-gray-700 break-words">{m.clientName}</p>
                      <p className="text-gray-500 text-xs">{m.inchargeName || '—'}</p>
                    </td>
                    <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                      {/* BUG #4 + BUG #5: formatted date and time */}
                      <p className="text-gray-700">{formatDate(m.date)}</p>
                      <p className="text-gray-500 text-xs">{formatTime(m.time)}</p>
                    </td>
                    <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                      <StatusBadge status={displayStatus} />
                    </td>
                    {/* BUG #10: sticky actions column */}
                    <td
                      className="px-5 py-4 sticky right-0 bg-white group-hover:bg-gray-50 z-10 shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.06)]"
                      onClick={e => e.stopPropagation()}
                    >
                      <div className="flex items-center gap-2">
                        <button
                          id={`edit-btn-${m.id}`}
                          onClick={() => onEdit?.(m)}
                          className="btn-edit whitespace-nowrap"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          id={`delete-btn-${m.id}`}
                          onClick={() => setConfirmDelete(confirmDelete === m.id ? null : m.id)}
                          className="btn-danger whitespace-nowrap"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                  {/* BUG #9: Full-width delete confirmation bar below the row */}
                  {confirmDelete === m.id && (
                    <DeleteConfirmRow
                      key={`confirm-${m.id}`}
                      colSpan={6}
                      onConfirm={() => handleDelete(m.id)}
                      onCancel={() => setConfirmDelete(null)}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
