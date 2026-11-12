export const notFound = (req, res) =>
  res.status(404).json({ message: `Route ${req.method} ${req.originalUrl} not found` });

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  if (err.status) {
    return res.status(err.status).json({ message: err.message });
  }
  if (err.name === "ValidationError") {
    return res.status(422).json({ message: err.message });
  }
  if (err.name === "CastError") {
    return res.status(400).json({ message: "Invalid id" });
  }
  if (err.code === 11000) {
    return res.status(409).json({ message: "Already exists" });
  }
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Malformed JSON body" });
  }

  console.error(err);
  return res.status(500).json({ message: "Unexpected error occurred" });
};
