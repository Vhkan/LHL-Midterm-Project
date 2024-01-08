const express = require('express');
const { getCars, deleteCar, addCar } = require('../db/queries/cars');
const router = express.Router();


router.route('/')
  .get((req, res) => {
    getCars()
      .then(data => {
        res.render('inventory', { data, admin: req.session.admin })
      })
  })
  .post((req, res) => {
    const itemToDel = req.body.itemId;
    deleteCar(itemToDel)
    .then(() => {
      res.redirect('/inventory');
    })
    .catch(err => {
      res.status(500).send({success: false, error: err.message});
    });
  })
   .delete((req, res) => {
    res.status(500).send('Method is not allowed')
  });

router.route('/list_new')
  .get((req, res) => {
    req.session.admin
    res.render('list_new', { admin: req.session.admin});
  })
  .post((req, res) => {
    const formData = req.body;
    addCar(formData);
    console.log(req.body);
    console.log('success');
    res.redirect('/inventory');
  });

  module.exports = router;
