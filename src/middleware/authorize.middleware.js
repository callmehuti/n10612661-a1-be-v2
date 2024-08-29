const { verify } = require("jsonwebtoken");
const authorize = (req, res, next) => {
  try {
    // console.log(req.headers.authorization);
    if (!req.headers.authorization) throw Error("not access");
    const token = req.headers.authorization.split(" ")[1];
    const isVerified = verify(token, process.env.JWT_KEY);
    // console.log(isVerified);
    if (!isVerified?.username) throw Error("not access");
    req.username = isVerified.username;
    next();
  } catch (error) {
    res.status(401).send(error.message);
  }
};

module.exports = authorize;
