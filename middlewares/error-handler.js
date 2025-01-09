const errorHandler = (req, res, next, err) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "An error occurred on the server";
  console.error(`[${statusCode}] ${message}`);
};

module.exports = errorHandler;
