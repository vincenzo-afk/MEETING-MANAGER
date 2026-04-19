import { useState, useCallback } from 'react';
import MeetingForm from '../components/MeetingForm';
import MeetingTable from '../components/MeetingTable';
import { getMeetings } from '../utils/storage';

const STATUS_FILTERS = ['All', 'Upcoming', 'Completed', 'Cancelled'];

export default function Scheduler() {
  const [meetings, setMeetings]       = useState(() => getMeetings());
  const [editData, setEditData]       = useState(null);
  const [filterStatus, setFilter]     = useState('All');
  const [showForm, setShowForm]       = useState(true);

  const refresh = useCallback(() => {
    setMeetings(getMeetings());
  }, []);

  const handleSave = () => {
    refresh();
    setEditData(null);
    setShowForm(true);
  };

  const handleEdit = meeting => {
    setEditData(meeting);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">
            {editData ? '✏️ Edit Meeting' : '📅 Schedule a Meeting'}
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {editData ? `Editing: ${editData.title}` : 'Fill in the details below to create a new meeting.'}
          </p>
        </div>
        <button
          id="toggle-form-btn"
          onClick={() => { setShowForm(s => !s); setEditData(null); }}
          className="btn-secondary"
        >
          {showForm ? '🗂️ Hide Form' : '➕ New Meeting'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <MeetingForm
          editData={editData}
          onSave={handleSave}
          onCancel={() => { setEditData(null); }}
        />
      )}

      {/* Table section */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <h2 className="text-xl font-bold text-white">
            All Meetings <span className="text-slate-500 text-base font-normal">({meetings.length})</span>
          </h2>
          {/* Filter pills */}
          <div id="status-filter" className="flex items-center gap-2 flex-wrap">
            {STATUS_FILTERS.map(f => (
              <button
                key={f}
                id={`filter-${f.toLowerCase()}`}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  filterStatus === f
                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <MeetingTable
          meetings={meetings}
          filterStatus={filterStatus}
          onEdit={handleEdit}
          onRefresh={refresh}
        />
      </div>
    </div>
  );
}
