var express = require('express');
var router = express.Router();

require('../models/connection');
const User = require('../models/users');
const bcrypt = require('bcrypt');


router.post('/signup', (req, res) => {
  if(!req.body.email || !req.body.password || !req.body.confirmPassword) {
    res.json({result: false, error: "un champ de saisie est vide"})
    return
  } 
  if(!req.body.email.match(/.+\@.+\..+/)) {
    res.json({result: false, error: "Email invalid"})
    return
  }


  User.findOne({email: req.body.email}).then(data => {
    if (data !== null) {
        res.json({result: false, error: "email déjà existant"})
      } else {
        const hash = bcrypt.hashSync(req.body.password, 10);
        const newUser = new User({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          password: hash,
          phone: req.body.phone,
          address: req.body.address,
          city: req.body.city,
          zipcode: req.body.zipcode,
          usertype: req.body.usertype
        })
        newUser.save().then((newData) => {
          res.json({result: true, user: newData})
        })
      }
    })
    }
  )
    
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
