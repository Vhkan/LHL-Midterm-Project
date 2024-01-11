/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into /users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const { getCars, filterResults } = require('../db/queries/cars');
const { getUsersId } = require('../db/queries/users');
const { getFavoritedItems } = require('../db/queries/cars'); 
const { addToFavorites } = require('../db/queries/cars');
const router = express.Router();

//Admin login data
const adminCredentials = {
  id: "admin",
  email: "admin@email.com",
  password: "password"
};

//User login data
const userCredentials = {
  first_name: "user_1",
  email: "user_1@email.com",
  password: "123"
};


router.get('/', (req, res) => {
  if (req.session.admin) {
    getCars()
      .then(() => {
        res.redirect('/inventory');
      });
    }
  getCars()
    .then(data => {
      res.render('index', { data, admin: req.session.admin, user: req.session.user })
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
      return res.redirect('/');
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


// router.route('/contact_seller')
//   .get((req, res) => {
//     res.render('contact_seller', { admin: req.session.admin, user: req.session.user })
//       .post((req, res) => {
//         res.send('How can we help you?')
//       });
//   });

  //Modified /contact_seller route
  router.route('/contact_seller')
    .get(async (req, res) => {
      try {
        const user = req.session.user;
        const favoriteItems = await getFavoritedItems(user);
        res.render('contact_seller', { admin: req.session.admin, user: req.session.user })
      } catch (error) {
        console.log("Error is:", error);
        res.status(500).send('Server Error');
      }
    })
    .post((req, res) => {
      res.send('How can we help you today?');
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


router.route('/favorites')
.get((req, res) => {
  const userEmail = userCredentials.email;
  console.log('this is userEmail: ', userEmail);
  getUsersId(userEmail)
    .then(data => {
      getFavoritedItems(data)
        .then(data => {
          console.log('this is favorite data in chain: ', data);
        })
    })
  res.render('buyer_listing', {admin: req.session.admin, user: req.session.user});

})
  .post(async (req, res) => {
    try {
      const { carId } = req.body;

      // Parameterized query to prevent SQL injection
      const userEmail = userCredentials.email;
      const userData = await getUsersId(userEmail);

      // const favoritedItem = await addToFavorites(userData.id ,itemId);
      
      res.status(200).json({ success: true });
    } catch (error) {
      console.log('Error in /favorites POST:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


module.exports = router;


