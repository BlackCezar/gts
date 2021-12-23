var express = require('express');
const { Subscribers } = require('../db');
var router = express.Router();
const ObjectID = require('mongoose').Types.ObjectId

router.post('/', async function(req, res, next) {
  try {
    console.log(req.body)
    let subscriber = new Subscribers({
      ...req.body
    })
    subscriber = await subscriber.save()

    if (subscriber) {
      res.json(subscriber)
    } else res.sendStatus(403)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
});

router.put('/:id', async function(req, res, next) {
  try {
    console.log('update id ' + ObjectID(req.params.id))
    let result = await Subscribers.updateOne({_id: ObjectID(req.params.id)}, {
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
    let subscribers = await Subscribers.find()
    res.json(subscribers)
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

    let deleteStatus = await Subscribers.deleteOne({ _id: req.params.id })

    if (deleteStatus) {
      res.json(deleteStatus)
    } else res.sendStatus(403)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
});

module.exports = router;
