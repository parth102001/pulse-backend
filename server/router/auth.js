const express = require("express");
const { body, validationResult } = require("express-validator");
const cors = require("cors");
const app = express();

app.use(cors());
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");

require("../db/conn");
const User = require("../model/userSchema");

// Route 1: create user using: POST "/api/auth/register"
router.post("/register", async (req, res, next) => {
  try {
    const { name, email, phone, password, cpassword, work } = req.body;

    console.log(req.body);
    if (!name || !email || !phone || !password || !cpassword || !work) {
      return res.status(422).json({ error: "Please fill all field" });
    }
    const userExist = await User.findOne({ email: email });

    if (userExist) {
      return res.status(422).json({ error: "user already registered" });
    } else if (password != cpassword) {
      return res.status(400).json({ error: "password does not match" });
    }

    // secure password using brycptjs
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);
    const user = new User({
      name,
      email,
      phone,
      password: secPass,
      cpassword,
      work,
    });

    await user.save();
    res.status(201).json({ message: "User registered succesfully" });
  } catch (error) {
    console.log(error);
  }
});

// Route 2: Login user using: POST "/api/auth/login"
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(422).json({ error: "please fill all field" });
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ error: "Invalid username or password" });
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    console.log(passwordCompare);
    if (!passwordCompare) {
      return res.status(400).json({ error: "Invalid username or password" });
    }
    const data = {
      user: {
        id: user.id,
      },
    };
    const authtoken = jwt.sign(data, process.env.SECRET_KEY);
    return res.json({ authtoken, message: "Login successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route 3: Get loggedin user details using: POST "/api/auth/getuser". Login required
router.get("/getuser", fetchuser, async (req, res) => {
  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
