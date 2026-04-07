const errorHandler = (err, req, res, next) => {
  console.error(err.stack || err);

  res.status(500).json({
    message: err.message || "Server Error",
  });
};

export default errorHandler;