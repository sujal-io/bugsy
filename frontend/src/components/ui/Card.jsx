export function Card({
  interactive = false,
  className = '',
  children,
  ...props
}) {
  const baseClass = interactive ? 'ui-card-interactive' : 'ui-card';

  return (
    <div className={`${baseClass} ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className = '', children, ...props }) {
  return (
    <div className={`ui-card-header ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className = '', children, ...props }) {
  return (
    <h2 className={`ui-card-title ${className}`.trim()} {...props}>
      {children}
    </h2>
  );
}

export function CardDescription({ className = '', children, ...props }) {
  return (
    <p className={`ui-card-description ${className}`.trim()} {...props}>
      {children}
    </p>
  );
}
