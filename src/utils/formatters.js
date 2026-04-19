// BUG #4: Format ISO date string to "19 Apr 2025"
export function formatDate(isoDate) {
  if (!isoDate) return '—';
  // Parse as local date to avoid timezone shifting
  const [y, m, d] = isoDate.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

// BUG #5: Format HH:MM to "2:30 PM"
export function formatTime(hhmm) {
  if (!hhmm) return '—';
  const [h, min] = hhmm.split(':').map(Number);
  const date = new Date();
  date.setHours(h, min, 0, 0);
  return date.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true });
}

// BUG #7: Auto-derive "Overdue" if meeting date is in the past and status is Upcoming
export function deriveStatus(meeting) {
  if (meeting.status !== 'Upcoming') return meeting.status;
  if (!meeting.date) return 'Upcoming';
  const [y, m, d] = meeting.date.split('-').map(Number);
  const meetingDate = new Date(y, m - 1, d);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (meetingDate < today) return 'Overdue';
  return 'Upcoming';
}
