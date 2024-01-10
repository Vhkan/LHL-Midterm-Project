const express = require('express');
const { getCar, markCarAsSold } = require('../db/queries/cars');
const router = express.Router();


router.route('/:id')
  .get((req, res) => {
    const id = req.params.id;
    getCar(id)
      .then(data => {
        const carData = data.rows[0];
        res.render('seller_listing', { car: carData, admin: req.session.admin, user: req.session.user })
      })
      .catch((error) => {
        res.status(500).send('Internal Server Error', error);
      })
  })
  .post((req, res) => {
    const carId = req.body.itemId;
    markCarAsSold(carId)
      .then(data => {
        res.json(data);
      })
      .catch((error) => {
        res.status(500).send('Internal Server Error', error);
      })
  });

  module.exports = router;
