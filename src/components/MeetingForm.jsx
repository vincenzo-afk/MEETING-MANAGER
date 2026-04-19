import { useState, useEffect, useRef, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLocation } from 'react-router-dom';
import { addMeeting, updateMeeting, getLocalDateString } from '../utils/storage';

const EMPTY = {
  title: '', date: '', time: '', participants: '', agenda: '', status: 'Upcoming',
  clientName: '', inchargeName: '', inchargePh: '', address: '',
  rmRequirement: '', businessDetails: '', remarks: '',
};

// BUG #4/#5: format stored date for display in past-date warning
function isDateInPast(dateStr) {
  if (!dateStr) return false;
  return dateStr < getLocalDateString();
}

// ── Toast component ─────────────────────────────────────────────────────────
function Toast({ message, type, onDismiss }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3500);
    return () => clearTimeout(t);
  }, [onDismiss]);

  const colors =
    type === 'success' ? 'bg-emerald-600 text-white' :
    type === 'error'   ? 'bg-red-600 text-white' :
                         'bg-blue-600 text-white';

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg text-sm font-semibold animate-slide-in ${colors}`}
    >
      <span>{type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
      <span>{message}</span>
      <button onClick={onDismiss} className="ml-2 opacity-70 hover:opacity-100 text-lg leading-none">×</button>
    </div>
  );
}

// Extracted stateless Field component
const Field = ({ label, name, type = 'text', placeholder, required, maxLength, inputmode, pattern, hint, form, errors, onChange }) => (
  <div>
    <label className="label">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
    <input
      id={`field-${name}`}
      name={name}
      type={type}
      value={form[name]}
      onChange={onChange}
      placeholder={placeholder}
      maxLength={maxLength}
      inputMode={inputmode}
      pattern={pattern}
      className={`input ${errors[name] ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
    />
    {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
    {hint && !errors[name] && <p className="text-gray-400 text-xs mt-1">{hint}</p>}
  </div>
);

// Extracted stateless TextArea component
const TextArea = ({ label, name, placeholder, maxLength, form, onChange }) => (
  <div>
    <label className="label">{label}</label>
    <textarea
      id={`field-${name}`}
      name={name}
      value={form[name]}
      onChange={onChange}
      placeholder={placeholder}
      rows={3}
      maxLength={maxLength}
      className="input resize-y min-h-[80px]"
    />
  </div>
);

export default function MeetingForm({ editData, onSave, onCancel, onDirtyChange }) {
  const [form, setForm]           = useState(EMPTY);
  const [errors, setErrors]       = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast]         = useState(null);
  const [isDirty, setIsDirty]     = useState(false);

  // Fallback: at least block window unload
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  useEffect(() => {
    setForm(editData ? editData : EMPTY);
    setIsDirty(false);
    setErrors({});
  }, [editData]);

  const onChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setIsDirty(true);
    onDirtyChange?.(true);
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim())      errs.title      = 'Meeting title is required';
    if (!form.date)              errs.date       = 'Date is required';
    if (!form.clientName.trim()) errs.clientName = 'Client name is required';
    if (form.inchargePh && !/^[\d\s\+\-\(\)]{7,15}$/.test(form.inchargePh.trim())) {
      errs.inchargePh = 'Enter a valid phone number';
    }
    return errs;
  };

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type, key: Date.now() });
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    if (isSubmitting) return;
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setIsSubmitting(true);
    try {
      if (editData) {
        updateMeeting(editData.id, form);
        showToast('Meeting updated successfully!', 'success');
      } else {
        addMeeting({ ...form, id: uuidv4() });
        showToast('Meeting saved successfully!', 'success');
      }
      setForm(EMPTY);
      setIsDirty(false);
      onDirtyChange?.(false);
      onSave?.();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (isDirty && editData) {
      if (!window.confirm('You have unsaved changes. Discard them?')) return;
    }
    setForm(EMPTY);
    setIsDirty(false);
    onCancel?.();
  };

  return (
    <>
      {toast && (
        <Toast
          key={toast.key}
          message={toast.message}
          type={toast.type}
          onDismiss={() => setToast(null)}
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-8" noValidate>
        {/* Section 1: Meeting Info */}
        <div className="card p-6 space-y-4">
          <p className="section-title">
            <span className="w-6 h-6 rounded bg-blue-100 flex items-center justify-center text-sm">📅</span>
            Meeting Info
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Meeting Title" name="title" placeholder="e.g. Project Kickoff" required maxLength={80} form={form} errors={errors} onChange={onChange} />
            <div>
              <label className="label">Status</label>
              <select id="field-status" name="status" value={form.status} onChange={onChange} className="input">
                <option>Upcoming</option>
                <option>Completed</option>
                <option>Cancelled</option>
              </select>
            </div>
            <div>
              <Field label="Date" name="date" type="date" required form={form} errors={errors} onChange={onChange} />
              {form.date && isDateInPast(form.date) && (
                <p className="text-amber-600 text-xs mt-1 flex items-center gap-1">
                  ⚠️ This date is in the past. Meeting will appear as Overdue.
                </p>
              )}
            </div>
            <Field label="Time" name="time" type="time" form={form} errors={errors} onChange={onChange} />
            <div className="sm:col-span-2">
              <Field label="Participants" name="participants" placeholder="e.g. John, Mary, Ravi (comma-separated)" maxLength={200} form={form} errors={errors} onChange={onChange} />
            </div>
            <div className="sm:col-span-2">
              <TextArea label="Agenda" name="agenda" placeholder="Meeting agenda or key topics..." maxLength={1000} form={form} onChange={onChange} />
            </div>
          </div>
        </div>

        {/* Section 2: Client Details */}
        <div className="card p-6 space-y-4">
          <p className="section-title">
            <span className="w-6 h-6 rounded bg-blue-100 flex items-center justify-center text-sm">👤</span>
            Client Details
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Client Name" name="clientName" placeholder="e.g. ABC Corp" required maxLength={80} form={form} errors={errors} onChange={onChange} />
            <Field label="Incharge Name" name="inchargeName" placeholder="e.g. Ravi Kumar" maxLength={80} form={form} errors={errors} onChange={onChange} />
            <Field
              label="Incharge Ph.No"
              name="inchargePh"
              type="tel"
              placeholder="e.g. 9876543210"
              inputmode="numeric"
              pattern="[\d\s\+\-\(\)]{7,15}"
              maxLength={15}
              hint="Digits only, 7–15 characters"
              form={form} errors={errors} onChange={onChange}
            />
            <Field label="Address" name="address" placeholder="City, State" maxLength={200} form={form} errors={errors} onChange={onChange} />
          </div>
        </div>

        {/* Section 3: Business Info */}
        <div className="card p-6 space-y-4">
          <p className="section-title">
            <span className="w-6 h-6 rounded bg-blue-100 flex items-center justify-center text-sm">💼</span>
            Business Info
          </p>
          <div className="grid grid-cols-1 gap-4">
            <Field label="RM Requirement" name="rmRequirement" placeholder="e.g. 2 BHK near metro" maxLength={200} form={form} errors={errors} onChange={onChange} />
            <TextArea label="Business Details" name="businessDetails" placeholder="Commercial or residential details..." maxLength={1000} form={form} onChange={onChange} />
            <TextArea label="Remarks" name="remarks" placeholder="Follow-up notes, special instructions..." maxLength={500} form={form} onChange={onChange} />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`btn-primary ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            {isSubmitting
              ? '⏳ Saving…'
              : editData ? '✏️ Update Meeting' : '➕ Save Meeting'}
          </button>
          {editData && (
            <button type="button" onClick={handleCancel} className="btn-secondary">
              Cancel
            </button>
          )}
        </div>
      </form>
    </>
  );
}
