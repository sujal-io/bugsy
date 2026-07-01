const variants = {
  primary: 'ui-btn-primary',
  secondary: 'ui-btn-secondary',
  ghost: 'ui-btn-ghost',
  danger: 'ui-btn-danger',
};

export function Button({
  variant = 'primary',
  size,
  loading = false,
  className = '',
  children,
  ...props
}) {
  const sizeClass = size === 'sm' ? 'ui-btn-sm' : '';
  const loadingClass = loading ? 'ui-btn-loading' : '';

  return (
    <button
      type="button"
      className={`${variants[variant]} ${sizeClass} ${loadingClass} ${className}`.trim()}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && (
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
}
