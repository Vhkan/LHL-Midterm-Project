/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into /users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const { getCars, filterResults } = require('../db/queries/cars');
const router = express.Router();

//Admin login data
const adminCredentials = {
  id: "superAdmin",
  email: "admin@email.com",
  password: "password"
};

router.get('/', (req, res) => {
  if (req.session.admin) {
    getCars()
      .then(() => {
        res.redirect('/inventory');
      })
  }
  getCars()
    .then(data => {
      res.render('index', { data, admin: req.session.admin })
    })
});

router.route('/filtered')
  .post((req, res) => {
    const data = req.body;
    filterResults(data)
      .then(data => {
        res.json(data);
      })
      .catch((err) => {
        res.status(500).json({ error: 'Internal Server Error' });
      });
  })

router.get('/about', (req, res) => {
  res.render('about', { admin: req.session.admin });
});


router.route('/login')
  .post((req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    //Checking users credentials
    if (email === '' || password === '') {
      return res.status(400).send('Email and password fields cannot be blank!');
    };
    if (email === adminCredentials.email && password === adminCredentials.password) {
      req.session.admin = true;
      return res.redirect('/inventory');
    }
    // res.send('LOGGED IN');
  });

router.route('/logout')
  .post((req, res) => {
    req.session.admin = false;
    res.redirect('/');
  });

router.route('/contact_seller')
  .get((req, res) => {
    res.render('contact_seller', { admin: req.session.admin })
  .post((req, res) => {
    res.send('How can we help you?')
    });
  });

router.route('/join')
  .get((req, res) => {
    res.redirect('/contact', { admin: req.session.admin })
  });

module.exports = router;
