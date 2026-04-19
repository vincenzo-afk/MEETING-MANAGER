// localStorage helpers for meetings
const STORAGE_KEY = 'meeting_manager_meetings';

export function getMeetings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveMeetings(meetings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(meetings));
}

export function addMeeting(meeting) {
  const meetings = getMeetings();
  meetings.push(meeting);
  saveMeetings(meetings);
}

export function updateMeeting(id, updated) {
  const meetings = getMeetings().map(m => m.id === id ? { ...m, ...updated } : m);
  saveMeetings(meetings);
}

export function deleteMeeting(id) {
  saveMeetings(getMeetings().filter(m => m.id !== id));
}

export function getMeetingById(id) {
  return getMeetings().find(m => m.id === id) || null;
}

// BUG #25: Export all meetings to JSON backup
export function exportAllMeetingsJSON() {
  const meetings = getMeetings();
  const blob = new Blob([JSON.stringify(meetings, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `MeetingManager_Backup_${getLocalDateString()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// BUG #6: Local date string (YYYY-MM-DD) using local timezone, not UTC
export function getLocalDateString(dateObj = new Date()) {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, '0');
  const d = String(dateObj.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
