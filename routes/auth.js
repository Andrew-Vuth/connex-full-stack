const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");

const auth = require("../middleware/auth");

const User = require("../models/User");

// @route     GET api/auth
// @desc      Get logged in user
// @access    Private
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password")
      .populate("followers")
      .populate("followings");
    res.json({ user });
  } catch (error) {
    console.error(error.messsage);
    res.status(500).send("Server Error");
  }
});
// @route     GET api/auth
// @desc      Get Target user
// @access    Private
router.get("/:username", auth, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select("-password")
      .populate("followers")
      .populate("followings");
    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// @route     POST api/auth
// @desc      Auth user
// @access    Public
router.post(
  "/",
  [
    check("email", "Please input a valid email").isEmail(),
    check("password", "Password is required!").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res
        .status(400)
        .json({ errors: errors.array(), msg: "Wrong Credential!" });

    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ msg: "User not found!" });

      const isMatched = await bcrypt.compare(password, user.password);
      if (!isMatched) return res.status(400).json({ msg: "Wrong Credential!" });

      // Registering JWT

      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
      console.log("Login Success!");
    } catch (error) {
      console.error(error.messsage);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
