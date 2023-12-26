/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into /users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const { getCars, getCar } = require('../db/queries/cars');
const router  = express.Router();

router.get('/', (req, res) => {
  getCars()
  .then(data => {
   res.render('index', {data})
  })
});

router.get('/about', (req, res) => {
  res.render('about');
});

/* we are able to chain routes using ".route" like below to avoid duplicating lines of code and avoid typos. Article is near the bottom of the page. Link to documentation
https://expressjs.com/en/guide/routing.html*/

router.route('/login')
  .get((req, res) => {
    res.render('login');
  })
  .post((req, res) => {
    res.send('LOGGED IN');
  });

router.route('/register')
  .get((req, res) => {
    res.render('register');
  })
  .post((req, res) => {
    res.send('REGISTERED');
  });

router.route('/inventory')
  .get((req, res) => {
  res.render('inventory')
  .post((req, res) => {
    res.send('CAR DETAILS PAGE');
  });
});

router.route('/buy')
  .get((req, res) => {
  res.render('buy')
  .post((req, res) => {
    res.send('CAR PURCHASED');
  });
});

router.route('/sell/:id')
  .get((req, res) => {
    const id = req.params.id;
    getCar(id)
      .then(data => {
        const carData = data.rows[0];
        res.render('seller_listing', {car: carData});
      })
      .catch((error) => {
        res.status(500).send('Internal Server Error');
      })
  })
  .post((req, res) => {
    res.send('CAR SOLD');
  });

router.route('/service')
  .get((req, res) => {
  res.render('service')
  .post((req, res) => {
    res.send('CAR FIXED');
  });
});

router.route('/contact')
  .get((req, res) => {
  res.render('contact')
  .post((req, res) => {
    res.send('THANKS FOR THE REVIEW');
  });
});

router.route('/contact_seller')
  .get((req, res) => {
    res.render('contact_seller')
  .post((req, res) => {
    res.send('How can we help you?')
  });  
});

router.route('/join')
  .get((req, res) => {
  res.redirect('/contact')
  .post((req, res) => {
    res.resend('YOU GOT A JOB');
  })
});

module.exports = router;
