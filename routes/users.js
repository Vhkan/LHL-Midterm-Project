/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into /users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const { getCars, getCar, filterResults } = require('../db/queries/cars');
const router  = express.Router();

//Admin login data
const adminCredentials = {
  id: "superAdmin",
  email: "admin@email.com",
  password: "password"
};


router.get('/', (req, res) => {
  if (req.session.admin) {
    getCars()
      .then(data => {
        res.redirect('/inventory');
      })
  }
  getCars()
  .then(data => {
   res.render('index', {data, admin: req.session.admin})
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
        res.status(500).json({error: 'Internal Server Error'});
      });
  })

router.get('/about', (req, res) => {
  res.render('about', {admin: req.session.admin});
});

/* we are able to chain routes using ".route" like below to avoid duplicating lines of code and avoid typos. Article is near the bottom of the page. Link to documentation
https://expressjs.com/en/guide/routing.html*/

router.route('/login')
  .post((req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const adminCredentials = {
      id: "superAdmin",
      email: "admin@email.com",
      password: "password"
    };

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


  //Admin page with all inventory listed, where an admin can mark an item 
  //as sold/delete/archive or post a new item 
  //Send messages via app/email or text back on negotiations in buying the said item 
router.route('/inventory')
  .get((req, res) => {
    getCars()
    .then(data => {
     res.render('inventory', {data, admin: req.session.admin})
    })
});

router.route('/sell/:id')
  .get((req, res) => {
    const id = req.params.id;
    getCar(id)
      .then(data => {
        const carData = data.rows[0];
        res.render('seller_listing', {car: carData, admin: req.session.admin})
      })
      .catch((error) => {
        res.status(500).send('Internal Server Error');
      })
  })
  .post((req, res) => {
    res.send('CAR SOLD');
  });


router.route('/contact')
  .get((req, res) => {
  res.redirect('contact_seller')
  .post((req, res) => {
    res.send('THANKS FOR THE REVIEW');
  });
});

router.route('/contact_seller')
  .get((req, res) => {
    res.render('contact_seller', {admin: req.session.admin})
  .post((req, res) => {
    res.send('How can we help you?')
  });
});

router.route('/join')
  .get((req, res) => {
  res.redirect('/contact', {admin: req.session.admin})
  .post((req, res) => {
    res.resend('YOU GOT A JOB');
  })
});

module.exports = router;
