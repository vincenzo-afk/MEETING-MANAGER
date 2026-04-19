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
