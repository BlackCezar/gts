var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
  if (req.session.auth) {
    res.render('index', { title: 'ГТС', auth: req.session });
  } else {
    res.redirect('/admin/signin')
  }
});


router.get('/logout', async (req, res) => {
  req.session.userid = null
  req.session.auth = null
  res.redirect('/admin/signin')
})


module.exports = router;
