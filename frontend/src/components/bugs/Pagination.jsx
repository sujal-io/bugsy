function Pagination({ page, setPage, totalPages = 1 }) {
  return (
    <div className="flex justify-center mt-6 gap-3">

      {/* Prev Button */}
      <button
        className="px-4 py-2 rounded-xl bg-background-secondary border border-border hover:border-border-strong text-content-primary transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
      >
        Prev
      </button>

      {/* Page Number */}
      <span className="px-4 py-2 text-content-secondary text-sm">
        Page {page} / {totalPages}
      </span>

      {/* Next Button */}
      <button
        className="px-4 py-2 rounded-xl bg-background-secondary border border-border hover:border-border-strong text-content-primary transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={page >= totalPages}
        onClick={() => setPage(page + 1)}
      >
        Next
      </button>

    </div>
  );
}

export default Pagination;