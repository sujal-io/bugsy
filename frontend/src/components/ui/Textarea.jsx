export function Textarea({ className = '', ...props }) {
  return (
    <textarea
      className={`ui-textarea ${className}`.trim()}
      {...props}
    />
  );
}
