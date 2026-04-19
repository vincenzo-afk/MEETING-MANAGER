import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { addMeeting, updateMeeting } from '../utils/storage';

const EMPTY = {
  title: '', date: '', time: '', participants: '', agenda: '', status: 'Upcoming',
  clientName: '', inchargeName: '', inchargePh: '', address: '',
  rmRequirement: '', businessDetails: '', remarks: '',
};

export default function MeetingForm({ editData, onSave, onCancel }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editData) setForm(editData);
    else setForm(EMPTY);
  }, [editData]);

  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.title.trim())      errs.title      = 'Meeting title is required';
    if (!form.date)              errs.date       = 'Date is required';
    if (!form.clientName.trim()) errs.clientName = 'Client name is required';
    return errs;
  };

  const handleSubmit = e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    if (editData) {
      updateMeeting(editData.id, form);
    } else {
      addMeeting({ ...form, id: uuidv4() });
    }
    setForm(EMPTY);
    onSave?.();
  };

  const Field = ({ label, name, type = 'text', placeholder, required }) => (
    <div>
      <label className="label">{label}{required && <span className="text-red-400 ml-0.5">*</span>}</label>
      <input
        id={`field-${name}`}
        name={name}
        type={type}
        value={form[name]}
        onChange={onChange}
        placeholder={placeholder}
        className={`input ${errors[name] ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
      />
      {errors[name] && <p className="text-red-400 text-xs mt-1">{errors[name]}</p>}
    </div>
  );

  const TextArea = ({ label, name, placeholder }) => (
    <div>
      <label className="label">{label}</label>
      <textarea
        id={`field-${name}`}
        name={name}
        value={form[name]}
        onChange={onChange}
        placeholder={placeholder}
        rows={3}
        className="input resize-none"
      />
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Section 1: Meeting Info */}
      <div className="card p-6 space-y-4">
        <p className="section-title">
          <span className="w-5 h-5 rounded bg-brand-600/30 flex items-center justify-center text-xs">📅</span>
          Meeting Info
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Meeting Title" name="title" placeholder="e.g. Project Kickoff" required />
          <div>
            <label className="label">Status</label>
            <select id="field-status" name="status" value={form.status} onChange={onChange} className="input">
              <option>Upcoming</option>
              <option>Completed</option>
              <option>Cancelled</option>
            </select>
          </div>
          <Field label="Date" name="date" type="date" required />
          <Field label="Time" name="time" type="time" />
          <div className="sm:col-span-2">
            <Field label="Participants" name="participants" placeholder="e.g. John, Mary, Ravi" />
          </div>
          <div className="sm:col-span-2">
            <TextArea label="Agenda" name="agenda" placeholder="Meeting agenda or key topics..." />
          </div>
        </div>
      </div>

      {/* Section 2: Client Details */}
      <div className="card p-6 space-y-4">
        <p className="section-title">
          <span className="w-5 h-5 rounded bg-brand-600/30 flex items-center justify-center text-xs">👤</span>
          Client Details
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Client Name" name="clientName" placeholder="e.g. ABC Corp" required />
          <Field label="Incharge Name" name="inchargeName" placeholder="e.g. Ravi Kumar" />
          <Field label="Incharge Ph.No" name="inchargePh" type="tel" placeholder="e.g. 9876543210" />
          <Field label="Address" name="address" placeholder="City, State" />
        </div>
      </div>

      {/* Section 3: Business Info */}
      <div className="card p-6 space-y-4">
        <p className="section-title">
          <span className="w-5 h-5 rounded bg-brand-600/30 flex items-center justify-center text-xs">💼</span>
          Business Info
        </p>
        <div className="grid grid-cols-1 gap-4">
          <Field label="RM Requirement" name="rmRequirement" placeholder="e.g. 2 BHK near metro" />
          <TextArea label="Business Details" name="businessDetails" placeholder="Commercial or residential details..." />
          <TextArea label="Remarks" name="remarks" placeholder="Follow-up notes, special instructions..." />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button type="submit" className="btn-primary">
          {editData ? '✏️ Update Meeting' : '➕ Save Meeting'}
        </button>
        {editData && (
          <button type="button" onClick={() => { setForm(EMPTY); onCancel?.(); }} className="btn-secondary">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
