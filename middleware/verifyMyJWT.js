require("dotenv").config();
const jwt = require("jsonwebtoken");

const verifyJWT = (req, resp, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return resp.sendStatus(401);
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET, 
    (err, decoded) => {
      if (err) {
        return resp.sendStatus(403); 
      }
      req.user = decoded.UserInfo.username;
      req.roles = decoded.UserInfo.roles
      next();
    }
  );
};

module.exports = verifyJWT;
