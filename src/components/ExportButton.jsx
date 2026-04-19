import { exportMeetingToExcel } from '../utils/excelExport';

export default function ExportButton({ meeting }) {
  if (!meeting) return null;
  return (
    <button
      id="export-excel-btn"
      onClick={() => exportMeetingToExcel(meeting)}
      className="btn-success"
    >
      ⬇️ Download Excel
    </button>
  );
}
