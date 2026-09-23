const mongoose = require('mongoose');
const env = require('../config/env');
const AppError = require('../utils/AppError');
const HTTP_STATUS = require('../constants/httpStatus');

const normalizeError = (error) => {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return AppError.badRequest('Malformed JSON request body.');
  }

  if (error instanceof mongoose.Error.ValidationError) {
    return AppError.badRequest('Validation failed.', error.errors);
  }

  if (error instanceof mongoose.Error.CastError) {
    return AppError.badRequest('Invalid resource identifier.');
  }

  if (error && error.code === 11000) {
    return AppError.conflict('Duplicate resource conflict.');
  }

  return new AppError(
    'Internal server error',
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
    'INTERNAL_SERVER_ERROR'
  );
};

const errorHandler = (error, _req, res, _next) => {
  const normalizedError = normalizeError(error);
  const statusCode = normalizedError.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;

  const response = {
    success: false,
    error: {
      code: normalizedError.code,
      message: normalizedError.message,
    },
  };

  if (normalizedError.details && !env.app.isProduction) {
    response.error.details = normalizedError.details;
  }

  if (!env.app.isProduction && error.stack) {
    response.error.stack = error.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
