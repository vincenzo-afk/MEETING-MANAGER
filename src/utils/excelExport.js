import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export function exportMeetingToExcel(meeting) {
  // Sheet 1 — Meeting Info
  const sheet1Data = [
    ['Field', 'Value'],
    ['Meeting Title', meeting.title || ''],
    ['Date', meeting.date || ''],
    ['Time', meeting.time || ''],
    ['Participants', meeting.participants || ''],
    ['Agenda', meeting.agenda || ''],
    ['Status', meeting.status || ''],
  ];

  // Sheet 2 — Client & Business
  const sheet2Data = [
    ['Field', 'Value'],
    ['Client Name', meeting.clientName || ''],
    ['Incharge Name', meeting.inchargeName || ''],
    ['Incharge Ph.No', meeting.inchargePh || ''],
    ['Address', meeting.address || ''],
    ['RM Requirement', meeting.rmRequirement || ''],
    ['Business Details', meeting.businessDetails || ''],
    ['Remarks', meeting.remarks || ''],
  ];

  const wb = XLSX.utils.book_new();

  const ws1 = XLSX.utils.aoa_to_sheet(sheet1Data);
  ws1['!cols'] = [{ wch: 20 }, { wch: 40 }];
  XLSX.utils.book_append_sheet(wb, ws1, 'Meeting Info');

  const ws2 = XLSX.utils.aoa_to_sheet(sheet2Data);
  ws2['!cols'] = [{ wch: 20 }, { wch: 40 }];
  XLSX.utils.book_append_sheet(wb, ws2, 'Client & Business');

  const clientSlug = (meeting.clientName || 'Client').replace(/\s+/g, '_');
  const titleSlug = (meeting.title || 'Meeting').replace(/\s+/g, '_');
  const filename = `${clientSlug}_${titleSlug}_Report.xlsx`;

  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  saveAs(new Blob([wbout], { type: 'application/octet-stream' }), filename);
}
