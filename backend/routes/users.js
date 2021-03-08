const router = require('express').Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
let User = require('../models/user.model');
let Challenge = require('../models/challenge.model');

// Load input validation
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");

//get all users
router.route('/').get((req, res) => {
  User.find()
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error: ' + err));
});

//get specific user object by objectID
router.route('/id/:id').get((req, res) => {
  User.findById(req.params.id)
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error: ' + err));
});

//get challenges from specific user by Name
router.route('/name/:name').get((req, res) => {
  User.findOne({username:req.params.name})
    .then(user => res.json(user.challenges)) 
    .catch(err => res.status(400).json('Error: ' + err));
});

//add challenges to specific user
router.route('/userChallenges/:name').post((req, res) => {
  User.findOne({username:req.params.name})
  .then(user => {

    //user.challenges.set(0,req.body.challengeName)
    //user.challenges.push(req.body.challengeName)
    const challengeName = req.body.challengeName;
    const challengeSuccess = req.body.challengeSuccess;

    user.challenges.push(new Challenge ({
      challengeName: challengeName,
      challengeSuccess: challengeSuccess
    }))
  
    user.save()
        .then(() => res.json(user.challenges))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
    
});

//Update user with URL
router.route('/url/:id').post((req,res) =>{
  User.findById(req.params.id)
  .then(user => {
    user.url = req.body.url;
    user.save()
    .then(() => res.json('User url updated!'))
    .catch(err => res.status(400).json('Error: '+ err));
  })
  .catch(err => res.status(400).json('Error: '+ err));
});

// @route POST users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
  // Form validation
const { errors, isValid } = validateRegisterInput(req.body);
// Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
      });
// Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {
  // Form validation
const { errors, isValid } = validateLoginInput(req.body);
// Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
const email = req.body.email;
  const password = req.body.password;
// Find user by email
  User.findOne({ email }).then(user => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    }
// Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: user.id,
          name: user.name
        };
// Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 31556926 // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Password incorrect" });
      }
    });
  });
});




module.exports = router;
