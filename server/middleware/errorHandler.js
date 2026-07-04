const logger = require('./logger');

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;
  logger.error( `${statusCode} - ${err.message} - ${req.orginalUrl} - ${req.method}`);

  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
  });
};

module.exports = errorHandler;