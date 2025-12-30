import { ErrorHandler } from "../utils/ErrorHandler.js";

const errorMiddleware = (err, req, res, next) => {
  console.error("\x1b[31m%s\x1b[0m", `[ERROR] ${err.message}`);
  if (process.env.NODE_ENV === "development") {
    console.error(err.stack);
  }

  let error = { ...err };
  error.message = err.message;

  // If the error is not an instance of our custom ErrorHandler,
  // we create a new one to keep the response structure consistent
  if (!(error instanceof ErrorHandler)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";
    error = new ErrorHandler(
      statusCode,
      message,
      error?.errors || [],
      err.stack
    );
  }

  const response = {
    success: error.success,
    message: error.message,
    errors: error.errors,
    ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {}),
  };

  res.status(error.statusCode || 500).json(response);
};

export { errorMiddleware };
