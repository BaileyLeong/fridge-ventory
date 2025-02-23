const requireUserId = (req, res, next) => {
  console.log("🔍 Headers received:", req.headers);

  const userId = req.headers["user-id"]; // Ensure lowercase
  if (!userId) {
    console.log("❌ Missing user-id header");
    return res.status(401).json({ error: "User ID is required" });
  }

  req.user = { id: Number(userId) };
  console.log("✅ User authenticated:", req.user);
  next();
};

export default requireUserId;
