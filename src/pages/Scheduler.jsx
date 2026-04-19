import { useState, useCallback } from 'react';
import MeetingForm from '../components/MeetingForm';
import MeetingTable from '../components/MeetingTable';
import { getMeetings } from '../utils/storage';

const STATUS_FILTERS = ['All', 'Upcoming', 'Completed', 'Cancelled', 'Overdue'];

export default function Scheduler() {
  const [meetings, setMeetings]   = useState(() => getMeetings());
  const [editData, setEditData]   = useState(null);
  const [filterStatus, setFilter] = useState('All');
  const [showForm, setShowForm]   = useState(true);
  // BUG #3: track whether the form is dirty so we can warn before hiding
  const [formDirty, setFormDirty] = useState(false);

  const refresh = useCallback(() => {
    setMeetings(getMeetings());
  }, []);

  const handleSave = () => {
    refresh();
    setEditData(null);
    setFormDirty(false);
  };

  const handleEdit = meeting => {
    setEditData(meeting);
    setShowForm(true);
    setFormDirty(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // BUG #3: Warn before discarding unsaved edit via Hide Form button
  const handleToggleForm = () => {
    if (showForm && editData && formDirty) {
      if (!window.confirm('You have unsaved edits. Discard them and hide the form?')) return;
    }
    setShowForm(s => !s);
    setEditData(null);
    setFormDirty(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            {editData ? '✏️ Edit Meeting' : '📅 Schedule a Meeting'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {editData
              ? `Editing: ${editData.title}`
              : 'Fill in the details below to create a new meeting.'}
          </p>
        </div>
        <button
          id="toggle-form-btn"
          onClick={handleToggleForm}
          className="btn-secondary"
        >
          {showForm ? '🗂️ Hide Form' : '➕ Add Meeting'}
        </button>
      </div>

      {/* Form — pass setFormDirty so it can signal when edits happen */}
      {showForm && (
        <MeetingForm
          editData={editData}
          onSave={handleSave}
          onCancel={() => { setEditData(null); setFormDirty(false); }}
          onDirtyChange={setFormDirty}
        />
      )}

      {/* Table section */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <h2 className="text-xl font-bold text-gray-900">
            All Meetings <span className="text-gray-500 text-base font-normal">({meetings.length})</span>
          </h2>
          {/* Filter pills — BUG #7: includes Overdue filter */}
          <div id="status-filter" className="flex items-center gap-2 flex-wrap">
            {STATUS_FILTERS.map(f => (
              <button
                key={f}
                id={`filter-${f.toLowerCase()}`}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  filterStatus === f
                    ? 'bg-blue-600 text-white shadow-sm border-transparent'
                    : 'bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-300'
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
