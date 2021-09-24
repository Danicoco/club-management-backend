const jwt = require('jsonwebtoken');
const { User } = require('../models');

const isAuthenticated = async (req, res, next) => {
  const token = req.header('x-auth-token');
  try {
    if (!token || token === null) return res.status(401).json({ success: false, message: "Invalid Token" });

    //decode jwt
    const decoded = jwt.verify(token, process.env.JWTSEC);

    //verify user from db
    const user = await User.findByPk(decoded.id);
    if (!user || user === null) return res.status(400).json({ success: false, message: "Invalid User" });
    req.user = {
      id: user.id
    }
    return next();
  } catch (error) {
    return res.status(500).json({ success: false, message: "Session expired. Please sign in." });
  }
}

module.exports = isAuthenticated;