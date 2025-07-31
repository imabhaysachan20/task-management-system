const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

const adminAuthMiddleware = (req,res,next)=>{
    const {role} = req.user;
    if (!role) return res.status(401).json({error:"error"});
    if (role!=="admin") {
      return res.status(401).json({error:"access denined"});
    };
    next();
}

module.exports = {authMiddleware,adminAuthMiddleware};
