var express = require('express');
const { ATS, Admins } = require('../db');
var router = express.Router();
const ObjectId = require('mongoose').Types.ObjectId

router.post('/', async function(req, res, next) {
  try {
    let ats = new ATS({
      ...req.body,
      author: req.session.userid
    })
    ats = await ats.save()
    ats.author = await Admins.findById(req.session.userid)
    console.log(ats.author)
    if (ats) {
      res.json(ats)
    } else res.sendStatus(403)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
    res.statusMessage = err.message
  }
});

router.get('/', async (req, res) => {
  try {
    let ats = await ATS.find().populate('author')
    res.json(ats)
  } catch(err) {
    console.error(err)
    res.sendStatus(500)
    res.statusMessage = err.message
  }
})


router.delete('/:id', async function(req, res, next) {
  try {
    if (!req.params.id) throw {
      error: 403,
      message: 'Не задан ID'
    } 

    let ats = await ATS.deleteOne({ _id: req.params.id })

    if (ats) {
      res.json(ats)
    } else res.sendStatus(403)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
    res.statusMessage = err.message
  }
});

module.exports = router;
