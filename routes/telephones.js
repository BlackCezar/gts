var express = require('express');
const { Telephones, ATS, Subscribers } = require('../db');
var router = express.Router();
const ObjectID = require('mongoose').Types.ObjectId


router.post('/', async function(req, res, next) {
  try {
    let tax = new Telephones({
      ...req.body
    })
    tax = await tax.save()
    tax.ats = await ATS.findById(req.body.ats)
    console.log(req.body.phoneOwner)
    if (req.body.phoneOwner) tax.phoneOwner = await Subscribers.findById(req.body.phoneOwner)
 
    if (tax) {
      res.json(tax)
    } else res.send(403)
  } catch (err) {
    console.error(err)
    res.send(500)
  }
});

router.put('/:id', async function(req, res, next) {
  try {
    console.log('update id ' + ObjectID(req.params.id))
    let result = await Telephones.updateOne({_id: ObjectID(req.params.id)}, {
      $set: {
        ...req.body
      }
    })

    if (result) {
      res.json(result)
    } else res.sendStatus(403)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
});

router.get('/', async (req, res) => {
  try {
    let telephones = await Telephones.find({
      isPublic: req.query.public === 'true' ? true : false
    }).populate('ats').populate('phoneOwner')
    res.json(telephones)
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
      message: 'no_id'
    } 

    let telephones = await Telephones.deleteOne({ _id: req.params.id })

    if (telephones) {
      res.json(telephones)
    } else res.sendStatus(403)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
});

module.exports = router;
