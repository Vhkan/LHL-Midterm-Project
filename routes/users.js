/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into /users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/about', (req, res) => {
  res.render('about');
});

router.get('/buy', (req, res) => {
  res.render('buy');
});

router.get('/inventory', (req, res) => {
  res.render('inventory');
});

router.get('/sell', (req, res) => {
  res.render('sell');
});

router.get('/contact', (req, res) => {
  res.render('contact');
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.get('/service', (req, res) => {
  res.render('service');
});

router.get('/join', (req, res) => {
  res.redirect('/contact');
});

router.post('/login', (req, res) => {
  res.send('login');
});

router.post('/register', (req, res) => {
  res.send('register');
});

module.exports = router;
