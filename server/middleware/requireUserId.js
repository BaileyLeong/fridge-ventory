const requireUserId = (req, res, next) => {
  const userId = req.headers["user-id"];

  if (!userId || isNaN(parseInt(userId, 10))) {
    return res.status(401).json({ error: "Invalid or missing User ID." });
  }

  req.user = { id: parseInt(userId, 10) };
  next();
};

export default requireUserId;
