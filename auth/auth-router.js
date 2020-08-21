const router = require("express").Router();
const Auth = require("./auth-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secret = require("../constants/secret");

router.post("/register", (req, res) => {
  // implement registration
  const creds = req.body;

  const hash = bcrypt.hashSync(creds.password, process.env.BCRYPT_ROUNDS || 8);
  creds.password = hash;

  Auth.add(creds)
    .then((dbRes) => {
      res.status(201).json({ dbRes }).end();
    })
    .catch((error) =>
      res
        .status(500)
        .json({
          error:
            "There already exists a user with some of those unique properties.",
        })
        .end()
    );
});

router.post("/login", (req, res) => {
  // implement login
  const creds = req.body;
  Auth.getBy({ username: creds.username }).then((user) => {
    if (user && bcrypt.compareSync(creds.password, user.password)) {
      const token = signToken(user);
      res.status(200).json({ message: "Login successful!", token }).end();
    } else {
      res.status(401).json({ message: "Credentials incorrect!" }).end();
    }
  });
});

function signToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
  };

  const options = {
    expiresIn: "1d",
  };

  return jwt.sign(payload, secret, options);
}

module.exports = router;
