module.exports = (req, res, next) => {
  const { imageName } = req.body;
  const dateRegex = /\d{4}-\d{2}-\d{2}/;
  if (!dateRegex.test(imageName)) {
    return res.status(400).json({ message: 'Image name must contain a date (YYYY-MM-DD)' });
  }
  next();
};
