import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMeetings, getLocalDateString } from '../utils/storage';
import { formatTime, deriveStatus } from '../utils/formatters';

function StatCard({ icon, label, value, color, textColor }) {
  return (
    <div className="card-hover p-6 flex items-center gap-5">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-gray-500 text-sm font-medium">{label}</p>
        <p className={`text-3xl font-bold mt-0.5 ${textColor}`}>{value}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  if (status === 'Completed') return <span className="badge-completed">✅ Completed</span>;
  if (status === 'Cancelled') return <span className="badge-cancelled">❌ Cancelled</span>;
  if (status === 'Overdue')   return <span className="badge-overdue">🔴 Overdue</span>;
  return <span className="badge-upcoming">🔵 Upcoming</span>;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [meetings] = useState(() => getMeetings());

  // BUG #6: local date string (not UTC via toISOString)
  const today = getLocalDateString();
  const todaysMeetings = meetings.filter(m => m.date === today);
  const upcoming  = meetings.filter(m => m.status === 'Upcoming').length;
  const completed = meetings.filter(m => m.status === 'Completed').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <button
          id="quick-add-meeting-btn"
          onClick={() => navigate('/scheduler')}
          className="btn-primary"
        >
          ➕ Add Meeting
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard icon="📋" label="Total Meetings" value={meetings.length} color="bg-blue-100 text-blue-600"    textColor="text-blue-600" />
        <StatCard icon="⌛" label="Upcoming"       value={upcoming}        color="bg-amber-100 text-amber-600"  textColor="text-amber-500" />
        <StatCard icon="✅" label="Completed"      value={completed}       color="bg-emerald-100 text-emerald-600" textColor="text-emerald-600" />
      </div>

      {/* Today's meetings */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          📅 <span>Today's Meetings</span>
          <span className="text-sm font-normal text-gray-500">({todaysMeetings.length})</span>
        </h2>

        {todaysMeetings.length === 0 ? (
          <div className="card p-12 text-center bg-blue-50 border-blue-100">
            <div className="text-5xl mb-4">🌟</div>
            <p className="text-blue-800 font-medium text-lg">No meetings scheduled for today</p>
            <p className="text-blue-600 text-sm mt-1">
              Enjoy a productive day or{' '}
              <button onClick={() => navigate('/scheduler')} className="text-blue-500 underline hover:text-blue-700">
                schedule one now
              </button>.
            </p>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left px-5 py-3.5 text-gray-500 font-semibold">Meeting</th>
                    <th className="text-left px-5 py-3.5 text-gray-500 font-semibold">Client</th>
                    <th className="text-left px-5 py-3.5 text-gray-500 font-semibold">Time</th>
                    <th className="text-left px-5 py-3.5 text-gray-500 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {todaysMeetings.map(m => {
                    const displayStatus = deriveStatus(m); // BUG #7
                    return (
                      // BUG #20: clicking a row goes to /report?id=...
                      <tr
                        key={m.id}
                        className="border-b border-gray-100 hover:bg-blue-50 transition-colors cursor-pointer"
                        title="Click to view full report"
                        onClick={() => navigate(`/report?id=${m.id}`)}
                      >
                        <td className="px-5 py-4 font-medium text-gray-900">{m.title}</td>
                        <td className="px-5 py-4 text-gray-600">{m.clientName}</td>
                        {/* BUG #5: 12h time format */}
                        <td className="px-5 py-4 text-gray-500">{formatTime(m.time)}</td>
                        <td className="px-5 py-4"><StatusBadge status={displayStatus} /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
