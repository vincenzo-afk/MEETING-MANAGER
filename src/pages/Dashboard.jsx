import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMeetings } from '../utils/storage';

function StatCard({ icon, label, value, color }) {
  return (
    <div className={`card-hover p-6 flex items-center gap-5`}>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-slate-400 text-sm font-medium">{label}</p>
        <p className="text-3xl font-bold text-white mt-0.5">{value}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  if (status === 'Completed') return <span className="badge-completed">✅ Completed</span>;
  if (status === 'Cancelled') return <span className="badge-cancelled">❌ Cancelled</span>;
  return <span className="badge-upcoming">🔵 Upcoming</span>;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [meetings] = useState(() => getMeetings());

  const today = new Date().toISOString().split('T')[0];
  const todaysMeetings = meetings.filter(m => m.date === today);
  const upcoming  = meetings.filter(m => m.status === 'Upcoming').length;
  const completed = meetings.filter(m => m.status === 'Completed').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <button
          id="quick-add-meeting-btn"
          onClick={() => navigate('/scheduler')}
          className="btn-primary"
        >
          ➕ New Meeting
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard icon="📋" label="Total Meetings" value={meetings.length} color="bg-brand-600/20" />
        <StatCard icon="🔵" label="Upcoming"       value={upcoming}        color="bg-blue-600/20" />
        <StatCard icon="✅" label="Completed"      value={completed}       color="bg-emerald-600/20" />
      </div>

      {/* Today's meetings */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          📅 <span>Today's Meetings</span>
          <span className="text-sm font-normal text-slate-400">({todaysMeetings.length})</span>
        </h2>

        {todaysMeetings.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="text-5xl mb-4">🌟</div>
            <p className="text-slate-400 font-medium">No meetings scheduled for today</p>
            <p className="text-slate-600 text-sm mt-1">Enjoy a productive day or <button onClick={() => navigate('/scheduler')} className="text-brand-400 underline">schedule one now</button>.</p>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="text-left px-5 py-3.5 text-slate-400 font-semibold">Meeting</th>
                    <th className="text-left px-5 py-3.5 text-slate-400 font-semibold">Client</th>
                    <th className="text-left px-5 py-3.5 text-slate-400 font-semibold">Time</th>
                    <th className="text-left px-5 py-3.5 text-slate-400 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {todaysMeetings.map(m => (
                    <tr key={m.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                      <td className="px-5 py-4 font-medium text-slate-100">{m.title}</td>
                      <td className="px-5 py-4 text-slate-300">{m.clientName}</td>
                      <td className="px-5 py-4 text-slate-400">{m.time || '—'}</td>
                      <td className="px-5 py-4"><StatusBadge status={m.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
