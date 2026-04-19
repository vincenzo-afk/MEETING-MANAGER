function Row({ label, value }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 py-2.5 border-b border-slate-800/50 last:border-0">
      <span className="text-slate-500 text-sm font-medium w-40 flex-shrink-0">{label}</span>
      <span className="text-slate-100 text-sm">{value || <span className="text-slate-600 italic">—</span>}</span>
    </div>
  );
}

function StatusBadge({ status }) {
  if (status === 'Completed') return <span className="badge-completed">✅ Completed</span>;
  if (status === 'Cancelled') return <span className="badge-cancelled">❌ Cancelled</span>;
  return <span className="badge-upcoming">🔵 Upcoming</span>;
}

export default function MeetingCard({ meeting }) {
  if (!meeting) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white">{meeting.title}</h2>
            <p className="text-slate-400 text-sm mt-1">{meeting.clientName} — {meeting.date} {meeting.time && `at ${meeting.time}`}</p>
          </div>
          <StatusBadge status={meeting.status} />
        </div>
      </div>

      {/* Meeting Info */}
      <div className="card p-6">
        <p className="section-title">
          <span>📅</span> Meeting Info
        </p>
        <Row label="Title"        value={meeting.title} />
        <Row label="Date"         value={meeting.date} />
        <Row label="Time"         value={meeting.time} />
        <Row label="Participants" value={meeting.participants} />
        <Row label="Agenda"       value={meeting.agenda} />
        <Row label="Status"       value={<StatusBadge status={meeting.status} />} />
      </div>

      {/* Client Details */}
      <div className="card p-6">
        <p className="section-title">
          <span>👤</span> Client Details
        </p>
        <Row label="Client Name"   value={meeting.clientName} />
        <Row label="Incharge Name" value={meeting.inchargeName} />
        <Row label="Incharge Ph."  value={meeting.inchargePh} />
        <Row label="Address"       value={meeting.address} />
      </div>

      {/* Business Info */}
      <div className="card p-6">
        <p className="section-title">
          <span>💼</span> Business Info
        </p>
        <Row label="RM Requirement"   value={meeting.rmRequirement} />
        <Row label="Business Details" value={meeting.businessDetails} />
        <Row label="Remarks"          value={meeting.remarks} />
      </div>
    </div>
  );
}
