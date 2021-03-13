const router = require('express').Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
let User = require('../models/user.model');
let Challenge = require('../models/challenge.model');

const Heroku = require('heroku-client')
const heroku = new Heroku({ token: 'a53d4fa8-2d50-4897-aa8d-dc3dde79b52d' })

//get all users
router.route('/build').get((req, res) => {
    heroku.request({
        method: 'POST',
        path: '/app-setups',
        body: {
            "source_blob": {"url":"https://api.github.com/repos/BdGress/VirtualHackathon/tarball/master"}
        },
        parseJSON: false
      }).then(response => {console.log(response)})
  });


