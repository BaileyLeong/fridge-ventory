const requireUserId = (req, res, next) => {
  const userId = req.query.user_id || req.body.user_id;
  if (!userId) {
    return res.status(400).json({ error: "User ID is required." });
  }
  req.user = { id: userId };
  next();
};

export default requireUserId;
