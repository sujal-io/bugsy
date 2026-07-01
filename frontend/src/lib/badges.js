export const statusBadge = {
  Open: 'ui-badge bg-primary-muted text-primary border-primary/20',
  'In Progress': 'ui-badge bg-warning-muted text-warning border-warning/20',
  Fixed: 'ui-badge bg-success-muted text-success border-success/20',
};

export const priorityBadge = {
  Low: 'ui-badge bg-success-muted text-success border-success/20',
  Medium: 'ui-badge bg-warning-muted text-warning border-warning/20',
  High: 'ui-badge bg-danger-muted text-danger border-danger/20',
};

export const roleBadge = {
  Admin: 'ui-badge bg-primary-muted text-primary border-primary/20',
  Member: 'ui-badge bg-surface text-content-secondary border-border',
};

export function getStatusBadgeClass(status) {
  return statusBadge[status] ?? 'ui-badge bg-surface text-content-secondary border-border';
}

export function getPriorityBadgeClass(priority) {
  return priorityBadge[priority] ?? 'ui-badge bg-surface text-content-secondary border-border';
}

export function getRoleBadgeClass(role) {
  return roleBadge[role] ?? 'ui-badge bg-surface text-content-secondary border-border';
}
