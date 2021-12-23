var express = require('express');
const { Sessions, Films, Halls } = require('../db');
var router = express.Router();


router.post('/', async function(req, res, next) {
  try {
    if (!req.body.sessionFilm) throw {
      error: 403,
      message: 'no_film'
    } 

    let session = new Sessions({
      film: req.body.sessionFilm,
      hall: req.body.sessionHall,
      time: req.body.sessionTime,
      date: req.body.sessionDate,
      price: Number(req.body.sessionPrice)
    })
    session = await session.save()
    session.film = await Films.findOne({_id: session.film})
    session.hall = await Halls.findOne({_id: session.hall})

    if (session) {
      res.json(session)
    } else res.sendStatus(403)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
});


router.delete('/:id', async function(req, res, next) {
  try {
    if (!req.params.id) throw {
      error: 403,
      message: 'no_id'
    } 

    let user = await Sessions.deleteOne({ _id: req.params.id })

    if (user) {
      res.json(user)
    } else res.sendStatus(403)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
});

module.exports = router;
