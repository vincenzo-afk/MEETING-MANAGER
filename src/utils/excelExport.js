import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// BUG #11: Sanitize filename — strip chars that break file paths
function slugify(str) {
  return (str || '').replace(/[^a-zA-Z0-9 \-]/g, '').trim().replace(/\s+/g, '_') || 'Unknown';
}

// BUG #12: Parse ISO date to JS Date so SheetJS writes a real date cell
function parseDate(isoDate) {
  if (!isoDate) return '';
  const [y, m, d] = isoDate.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function exportMeetingToExcel(meeting) {
  // BUG #23: Replace undefined/null with '' to avoid "undefined" text in cells
  const s = (v) => (v == null || v === undefined ? '' : String(v));

  // Sheet 1 — Meeting Info
  const sheet1Data = [
    ['Field', 'Value'],
    ['Meeting Title', s(meeting.title)],
    ['Date',         parseDate(meeting.date)],   // BUG #12: real date object
    ['Time',         s(meeting.time)],
    ['Participants', s(meeting.participants)],
    ['Agenda',       s(meeting.agenda)],
    ['Status',       s(meeting.status)],
  ];

  // Sheet 2 — Client & Business
  const sheet2Data = [
    ['Field', 'Value'],
    ['Client Name',      s(meeting.clientName)],
    ['Incharge Name',    s(meeting.inchargeName)],
    ['Incharge Ph.No',   s(meeting.inchargePh)],
    ['Address',          s(meeting.address)],
    ['RM Requirement',   s(meeting.rmRequirement)],
    ['Business Details', s(meeting.businessDetails)],
    ['Remarks',          s(meeting.remarks)],
  ];

  const wb = XLSX.utils.book_new();

  const ws1 = XLSX.utils.aoa_to_sheet(sheet1Data);
  // Format the date cell (row 2, col B → cell B2)
  ws1['!cols'] = [{ wch: 20 }, { wch: 40 }];
  if (ws1['B3']) {
    ws1['B3'].t = 'd';
    ws1['B3'].z = 'DD MMM YYYY';
  }
  XLSX.utils.book_append_sheet(wb, ws1, 'Meeting Info');

  const ws2 = XLSX.utils.aoa_to_sheet(sheet2Data);
  ws2['!cols'] = [{ wch: 20 }, { wch: 40 }];
  XLSX.utils.book_append_sheet(wb, ws2, 'Client & Business');

  // BUG #11: Safe filename
  const clientSlug = slugify(meeting.clientName || 'Client');
  const titleSlug  = slugify(meeting.title || 'Meeting');
  const filename   = `${clientSlug}_${titleSlug}_Report.xlsx`;

  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  saveAs(new Blob([wbout], { type: 'application/octet-stream' }), filename);
}

// BUG #25: Export ALL meetings to a multi-sheet Excel backup
export function exportAllMeetingsExcel(meetings) {
  if (!meetings || meetings.length === 0) return;
  const s = (v) => (v == null ? '' : String(v));

  const rows = [
    ['Title','Date','Time','Participants','Agenda','Status','Client','Incharge','Phone','Address','RM Req','Business','Remarks'],
    ...meetings.map(m => [
      s(m.title), s(m.date), s(m.time), s(m.participants), s(m.agenda), s(m.status),
      s(m.clientName), s(m.inchargeName), s(m.inchargePh), s(m.address),
      s(m.rmRequirement), s(m.businessDetails), s(m.remarks),
    ]),
  ];

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws['!cols'] = Array(13).fill({ wch: 20 });
  XLSX.utils.book_append_sheet(wb, ws, 'All Meetings');

  const date = new Date();
  const dateStr = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  saveAs(new Blob([wbout], { type: 'application/octet-stream' }), `MeetingManager_Backup_${dateStr}.xlsx`);
}
