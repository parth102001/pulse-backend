const jwt = require("jsonwebtoken");
// const bcrypt = require("bcrypt");

const fetchuser = (req, res, next) => {
  try {
    const token = req.header("auth-token");
    if (!token) {
      res.status(401).send({ error: "Authentitation failed" });
    }
    const data = jwt.verify(token, process.env.SECRET_KEY);

    req.user = data.user;
    // console.log(req.user);
  } catch (error) {
    res.status(401).send({ error: "Authentitation failed" });
  }
  next();
};

module.exports = fetchuser;
