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
const { removeFromFavorites } = require('../db/queries/cars');
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
  const userEmail = req.session.user ? userCredentials.email : null;

  if (req.session.admin) {
    getCars()
      .then(() => {
        res.redirect('/inventory');
      });
    }

  if (!userEmail) {
    getCars()
      .then(data => {
        res.render('index', { data, admin: req.session.admin, user: req.session.user})
      })
    }
if (userEmail) {
  getUsersId(userEmail)
    .then(data => {
      return getFavoritedItems(data.id);
    })
    .then(favoriteCar => {
      return getCars().then(data => {
      const favorite = [];
      favoriteCar.forEach(element => favorite.push(element.car_id));
      res.render('index', {data, admin: req.session.admin, user: req.session.user, favorite: favorite})
      })
    })
    .catch(error => {
      console.error('Error: ', error);
      res.status(500).send('Internal Server Error');
    })
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

// Modified /contact_seller route
router.route('/contact_seller')
  .get(async (req, res) => {
    try {
      const user = req.session.user;
      // const favoriteItems = await getFavoritedItems(user);
      res.render('contact_seller', { admin: req.session.admin, user: req.session.user });
    } catch (error) {
      console.log("Contact Seller page error is:", error);
      res.status(500).send('Contact Seller page error: ' + error);
    }
  })
  .post((req, res) => {
    res.status(200).send('How can we help you today?');
  });


//Buyer listing route
router.route('/buyer_listing')
  .get((req, res) => {
    res.render('favorites', { user: req.session.user, admin: req.session.admin })
  });


router.route('/join')
  .get((req, res) => {
    res.redirect('/contact', { admin: req.session.admin, user: req.session.user })
  });


router.route('/favorites')
.get((req, res) => {
  const userEmail = userCredentials.email;
  getUsersId(userEmail)
    .then(data => {
      getFavoritedItems(data.id)
        .then(data => {
          res.render('favorites', {admin: req.session.admin, user: req.session.user, data});
        })
    })
})
  .post(async (req, res) => {

      const { carId } = req.body;
      const userEmail = userCredentials.email;
      getUsersId(userEmail)
        .then(data => {
          addToFavorites(data.id, carId)
            .then(data => {
              res.json(data);
            })
        })
        .catch (error => {
          res.status(500).json({ error: `Internal Server Error, ${error}` });
        })
  });


  //Removing an unfavorited item
  router.route('/favorites/remove')
    .post((req, res) => {

        const { carId } = req.body;
        const userEmail = userCredentials.email;
        getUsersId(userEmail)
        .then(data => {
          removeFromFavorites(data.id, carId)
          .then(data => {
            res.json(data);
          })
        })
        .catch (error => {
          res.status(500).json({ error: `Server error removing from favorites, ${error}` });
        })
    });


module.exports = router;


