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
  id: "admin",
  email: "admin@email.com",
  password: "password"
};

//User login data
const userCredentials = {
  id: "user_1",
  email: "user_1@email.com",
  password: "123"
};


router.get('/', (req, res) => {

  let userType = req.session.admin ? 'admin' : req.session.user ? 'user' : null;

  if (userType) {
    getCars()
      .then(data => {
        if (userType === 'admin') {
          res.redirect('/inventory');
        } else if (userType === 'user') {
          res.redirect('/buyer_listing');
        } else {
          res.render('index', { data, admin: req.session.admin, user: req.session.user });
        }
      })
      .catch(error => {
        console.error("Error is:", error);
        res.status(500).send("Server Error");
      });
  } else {
    getCars()
      .then(data => {
        res.render('index', { data, admin: req.session.admin, user: req.session.user });
      })
      .catch(error => {
        console.error("Error is:", error);
        res.status(500).send("Server Error");
      });
  }
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
  res.render('about', { admin: req.session.admin, user: req.session.user });
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
    if (email === userCredentials.email && password === userCredentials.password) {
      req.session.user = true;
      return res.redirect('/buyer_listing');
    } else {
      res.send("Incorrect Password");
    }
  });

router.route('/logout')
  .post((req, res) => {
    req.session.admin = false;
    req.session.user = false;
    res.redirect('/');
  });

router.route('/contact_seller')
  .get((req, res) => {
    res.render('contact_seller', { admin: req.session.admin, user: req.session.user })
      .post((req, res) => {
        res.send('How can we help you?')
      });
  });

//Buyer listing route
router.route('/buyer_listing')
  .get((req, res) => {
    res.render('buyer_listing', { user: req.session.user, admin: req.session.admin })
  });


router.route('/join')
  .get((req, res) => {
    res.redirect('/contact', { admin: req.session.admin, user: req.session.user })
  });

module.exports = router;
