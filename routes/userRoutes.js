
const router = require("express").Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
// const { users } = require("./database");
const userModal = require("../models/userModel");

// require("dotenv").config();
const ACCESS_TOKEN_SECRET="klasdjfk12312klasdj"


router.post(
  "/signup",
  [
    check("email", "Invalid email").isEmail(),
    check("password", "Password must be at least 6 chars long").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const { email, password } = req.body;

    // Validate user input
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    
   
          const user = await userModal.findOne({ email});


    if (user) {
      
      return res.status(230).json({
        errors: [
          {
            email: user.email,
            msg: "The user already exists",
          },
        ],
      });
    }

  
    const salt = await bcrypt.genSalt(10);
    console.log("salt:", salt);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log("hashed password:", hashedPassword);

        const newUser = new userModal({ email,  password:hashedPassword});
    await newUser.save();

    // Do not include sensitive information in JWT

    const accessToken = await JWT.sign(
      { email },
    ACCESS_TOKEN_SECRET,
      {
        expiresIn: "600m",
      }
    );

    res.json({
      accessToken,
    });
  }
);




router.get("/users", (req, res) => {
  res.json(users);
});


router.post("/login", async (req, res) => {
  const { email, password } = req.body;

 
  const user = await userModal.findOne({ email});

  // If user not found, send error message
  if (!user) {
    return res.status(400).json({
      errors: [
        {
          msg: "Invalid credentials",
        },
      ],
    });
  }

  let isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({
      errors: [
        {
          msg: "Email or password is invalid",
        },
      ],
    });
  }

  // Send JWT access token
  const accessToken = await JWT.sign(
    { email },
    ACCESS_TOKEN_SECRET,
    {
      expiresIn: "100m",
    }
  );



  res.json({
    accessToken,
  
  });
});



module.exports = router;
