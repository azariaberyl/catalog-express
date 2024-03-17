const errorMiddleware = async (err, req, res, next) => {
  if (!err) {
    next();
    return;
  }
  res.status(err.statusCode || 500);
  res.json({
    errors: err.message,
  });
  console.log(err);
  res.end();
};

export default errorMiddleware;
