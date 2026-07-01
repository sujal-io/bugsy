import {
  getPriorityBadgeClass,
  getRoleBadgeClass,
  getStatusBadgeClass,
} from '../../lib/badges';

const kindGetters = {
  status: getStatusBadgeClass,
  priority: getPriorityBadgeClass,
  role: getRoleBadgeClass,
};

export function Badge({ kind, value, className = '', children, ...props }) {
  const getter = kind ? kindGetters[kind] : null;
  const tokenClass = getter && value != null ? getter(value) : 'ui-badge bg-surface text-content-secondary border-border';

  return (
    <span className={`${tokenClass} ${className}`.trim()} {...props}>
      {children ?? value}
    </span>
  );
}
