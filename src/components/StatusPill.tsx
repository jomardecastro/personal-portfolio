interface StatusPillProps {
  status: 'production' | 'staging';
  label: string;
  className?: string;
}

/** Status is never flattened: production carries client links, staging never claims client use. */
const StatusPill = ({ status, label, className = '' }: StatusPillProps) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
      status === 'production'
        ? 'border-success/40 bg-success/10 text-success'
        : 'border-border bg-muted text-muted-foreground'
    } ${className}`}
  >
    <span
      aria-hidden
      className={`h-1.5 w-1.5 rounded-full ${status === 'production' ? 'bg-success' : 'bg-muted-foreground'}`}
    />
    {label}
  </span>
);

export default StatusPill;
