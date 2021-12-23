var express = require('express');
const { Users } = require('../db');
var router = express.Router();
const bcrypt  = require('bcrypt')


router.post('/', async function(req, res, next) {
  try {
    if (!req.body.password) throw {
      error: 403,
      message: 'no_password'
    } 
    let password = req.body.password 

    let user = new Users({
      name: req.body.username,
      email: req.body.email,
      admin: false,
      password: bcrypt.hashSync(password, 10)
    })
    user = await user.save()

    if (user) {
      res.json(user)
    } else res.send(403)
  } catch (err) {
    console.error(err)
    res.send(500)
  }
});


router.delete('/:id', async function(req, res, next) {
  try {
    if (!req.params.id) throw {
      error: 403,
      message: 'no_id'
    } 

    let user = await Users.deleteOne({ _id: req.params.id })

    if (user) {
      res.json(user)
    } else res.send(403)
  } catch (err) {
    console.error(err)
    res.send(500)
  }
});

module.exports = router;
