var express = require('express');
const { Admins, ATS } = require('../db');
var router = express.Router();
const bcrypt  = require('bcrypt')

/* Страница авторизации */
router.get('/signin', function(req, res, next) {
  if (!req.session.auth) {
    res.render('auth', { title: 'Авторизация', auth: req.session });
  } else {
    res.redirect('/')
  }
});


/* Авторизация */
router.post('/auth', async function(req, res, next) {
  try {
    if (!req.body.password) throw {
      error: 403,
      message: 'no_password'
    } 

    let password = req.body.password 
    const user = await Admins.findOne({
      email: req.body.email
    })
    
    if (user) {
      console.log(user)
      let result = await bcrypt.compare(password, user.password)
       
      if (result) {
        req.session.userid = user._id
        req.session.auth = true
        req.session.admin = user.ats ? false : true
        console.log('Success auth')
        
        res.redirect('/')

      } else res.send(401)
    } else res.send(404)
  } catch (err) {
    console.error(err)
    res.send(500)
  }
});

/* Регистрация */
router.post('/', async function(req, res, next) {
  try {
    if (!req.body.password) throw {
      error: 403,
      message: 'no_password'
    } 
    let password = req.body.password 

    let user = new Admins({
      name: req.body.name,
      email: req.body.email,
      admin: false,
      password: bcrypt.hashSync(password, 10),
      ats: req.body.ats
    })
    user = await user.save()
    user.ats = await ATS.findById(req.body.ats)

    if (user) {
      res.json(user)
    } else res.send(403)
  } catch (err) {
    console.error(err)
    res.send(500)
  }
});


router.get('/', async (req, res) => {
  try {
    let ats = await Admins.find().populate('ats')
    res.json(ats)
  } catch(err) {
    console.error(err)
    res.sendStatus(500)
    res.statusMessage = err.message
  }
})


/* Удаление */
router.delete('/:id', async function(req, res, next) {
  try {
    if (!req.params.id) throw {
      error: 403,
      message: 'no_id'
    } 

    let user = await Admins.deleteOne({ _id: req.params.id })

    if (user) {
      res.json(user)
    } else res.send(403)
  } catch (err) {
    console.error(err)
    res.send(500)
  }
});


module.exports = router;