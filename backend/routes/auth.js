const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPass,
    });

    const user = await newUser.save();

    // Generate a token for the user
    const token = jwt.sign({ id: user._id, username: user.username }, "secretKey", {
      expiresIn: "1h",
    });

    const { password, ...others } = user._doc;
    res.status(200).json({ user: others, token });
  } catch (err) {
    res.status(500).json(err);
  }
});


//LOGIN
// LOGIN
router.post("/login", async (req, res) => {
  try {
    // Find user by username
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(400).json("Wrong credentials!");
    }

    // Validate password
    const validated = await bcrypt.compare(req.body.password, user.password);
    if (!validated) {
      return res.status(400).json("Wrong credentials!");
    }

    // Generate a token for the user
    const token = jwt.sign({ id: user._id, username: user.username }, "secretKey", {
      expiresIn: "1h",
    });

    // Exclude password from the response and include the token
    const { password, ...others } = user._doc;
    res.status(200).json({ user: others, token });
  } catch (err) {
    res.status(500).json(err);
  }
});



module.exports = router;