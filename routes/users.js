var express = require('express');
var router = express.Router();

require('../models/connection');
const User = require('../models/users');
const bcrypt = require('bcrypt');

router.post('/signup', (req, res) => {
  if(!req.body.email || !req.body.password || !req.body.confirmPassword) {
    res.json({result: false, error: "un champ de saisie est vide"})

    const hash = bcrypt.hashSync(req.body.password, 10);

  } else {
    const hash = bcrypt.hashSync(req.body.password, 10);
    const newUser = new User({
      email: req.body.email,
      password: hash,
    })
    newUser.save().then((newData) => {
      res.json({result: true})
    })
  }
})

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
