export function Input({ className = '', size, ...props }) {
  const sizeClass = size === 'lg' ? 'ui-input-lg' : '';

  return (
    <input
      className={`ui-input ${sizeClass} ${className}`.trim()}
      {...props}
    />
  );
}
