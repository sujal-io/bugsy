import { ChevronDown } from 'lucide-react';

export function Select({ className = '', children, ...props }) {
  return (
    <div className="relative">
      <select
        className={`ui-select ${className}`.trim()}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-content-muted"
        aria-hidden
      />
    </div>
  );
}
