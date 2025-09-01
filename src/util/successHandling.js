const successResponse = (res, statusCode, data) => {
  return res.status(statusCode).json({
    success: true,
    data,
  });
};

module.exports = {
  successResponse,
};
