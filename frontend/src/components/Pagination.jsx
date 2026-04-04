function Pagination({ page, setPage }) {
  return (
    <div className="flex justify-center mt-6 gap-3">

      {/* Prev Button */}
      <button
        className="btn btn-sm"
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
      >
        Prev
      </button>

      {/* Page Number */}
      <span className="px-4 py-2">
        Page {page}
      </span>

      {/* Next Button */}
      <button
        className="btn btn-sm"
        onClick={() => setPage(page + 1)}
      >
        Next
      </button>

    </div>
  );
}

export default Pagination;