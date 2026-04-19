export default function Logo({ className = "w-8 h-8", textColor = "text-blue-600" }) {
  return (
    <div className="flex items-center gap-3">
      <svg
        className={className}
        viewBox="0 0 100 100"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        style={{ color: '#2563EB' }}
      >
        {/* Briefcase Handle */}
        <path d="M 35 25 L 35 15 C 35 12 37 10 40 10 L 60 10 C 63 10 65 12 65 15 L 65 25" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        
        {/* Briefcase Main Body */}
        <path d="M 20 25 C 14.477 25 10 29.477 10 35 L 10 75 C 10 80.523 14.477 85 20 85 L 80 85 C 85.523 85 90 80.523 90 75 L 90 35 C 90 29.477 85.523 25 80 25 Z" fill="currentColor" />
        
        {/* Flap & Checkmark Area */}
        <path d="M 10 35 L 50 55 L 90 35 L 90 45 L 82 45 L 82 60 L 50 75 L 18 60 L 18 45 L 10 45 Z" fill="#F9FAFB" />
        
        {/* Checkmark Box on the Flap */}
        <rect x="50" y="40" width="18" height="18" rx="2" fill="currentColor" />
        
        {/* White Checkmark inside the box */}
        <path d="M 54 48 L 57 52 L 64 44" fill="none" stroke="#F9FAFB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        
        {/* Latch under the flap */}
        <rect x="42" y="65" width="16" height="5" rx="2" fill="currentColor" />

        {/* Adjusting the top loop of the flap */}
        <path d="M 12 35 C 14 36 20 38 50 52 C 80 38 86 36 88 35" fill="none" stroke="#F9FAFB" strokeWidth="2.5" />
      </svg>
      {/* We can include the text as well if needed, but often the text is separate. */}
    </div>
  );
}
