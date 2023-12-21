const errorMiddleware = async (err, req, res, next) => {
  if (!err) {
    next();
    return;
  }
  console.log(err.message);
  res.status(err.statusCode || 500);
  res
    .json({
      errors: err.message,
    })
    .end();
};

export default errorMiddleware;
