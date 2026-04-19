import { formatDate, formatTime, deriveStatus } from '../utils/formatters';

// BUG #24: overflow-wrap on value span
function Row({ label, value }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 py-2.5 border-b border-gray-100 last:border-0">
      <span className="text-gray-500 text-sm font-medium w-40 flex-shrink-0">{label}</span>
      <span className="text-gray-900 text-sm break-words overflow-wrap-anywhere max-w-full">
        {value || <span className="text-gray-400 italic">—</span>}
      </span>
    </div>
  );
}

function StatusBadge({ status }) {
  if (status === 'Completed') return <span className="badge-completed">✅ Completed</span>;
  if (status === 'Cancelled') return <span className="badge-cancelled">❌ Cancelled</span>;
  if (status === 'Overdue')   return <span className="badge-overdue">🔴 Overdue</span>;
  return <span className="badge-upcoming">🔵 Upcoming</span>;
}

export default function MeetingCard({ meeting }) {
  if (!meeting) return null;

  const displayStatus = deriveStatus(meeting); // BUG #7

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-6 border-l-4 border-l-gray-800">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 break-words">{meeting.title}</h2>
            <p className="text-gray-500 text-sm mt-1">
              {meeting.clientName} — {formatDate(meeting.date)} {meeting.time && `at ${formatTime(meeting.time)}`}
            </p>
          </div>
          {/* Status shown in header only */}
          <StatusBadge status={displayStatus} />
        </div>
      </div>

      {/* Meeting Info — BUG #17: Status row removed (already in header) */}
      <div className="card p-6 border-l-4 border-l-blue-500">
        <p className="section-title">
          <span className="text-blue-500">📅</span> Meeting Info
        </p>
        {/* BUG #4: formatted date */}
        <Row label="Date"         value={formatDate(meeting.date)} />
        {/* BUG #5: 12h time */}
        <Row label="Time"         value={formatTime(meeting.time)} />
        <Row label="Participants" value={meeting.participants} />
        <Row label="Agenda"       value={meeting.agenda} />
        {/* BUG #17: Status removed from here — shown in header card */}
      </div>

      {/* Client Details */}
      <div className="card p-6 border-l-4 border-l-emerald-500">
        <p className="section-title text-emerald-600">
          <span className="text-emerald-500">👤</span> Client Details
        </p>
        <Row label="Client Name"   value={meeting.clientName} />
        <Row label="Incharge Name" value={meeting.inchargeName} />
        <Row label="Incharge Ph."  value={meeting.inchargePh} />
        {/* BUG #24: break-words applies via Row */}
        <Row label="Address"       value={meeting.address} />
      </div>

      {/* Business Info */}
      <div className="card p-6 border-l-4 border-l-amber-500">
        <p className="section-title text-amber-600">
          <span className="text-amber-500">💼</span> Business Info
        </p>
        <Row label="RM Requirement"   value={meeting.rmRequirement} />
        <Row label="Business Details" value={meeting.businessDetails} />
        <Row label="Remarks"          value={meeting.remarks} />
      </div>
    </div>
  );
}
