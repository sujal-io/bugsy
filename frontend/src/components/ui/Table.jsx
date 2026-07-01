export function Table({ className = '', children, ...props }) {
  return (
    <div className={`ui-table-wrap ${className}`.trim()} {...props}>
      <table className="ui-table">{children}</table>
    </div>
  );
}

export function TableHead({ children, ...props }) {
  return <thead {...props}>{children}</thead>;
}

export function TableBody({ children, ...props }) {
  return <tbody {...props}>{children}</tbody>;
}

export function TableRow({ children, ...props }) {
  return <tr {...props}>{children}</tr>;
}

export function TableHeaderCell({ children, ...props }) {
  return <th {...props}>{children}</th>;
}

export function TableCell({ children, ...props }) {
  return <td {...props}>{children}</td>;
}

export function TableEmpty({ children = 'No data', ...props }) {
  return (
    <tr {...props}>
      <td colSpan={100} className="ui-table-empty">
        {children}
      </td>
    </tr>
  );
}
