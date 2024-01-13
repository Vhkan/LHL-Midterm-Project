const express = require('express');
const router = express.Router();
const { saveMessage, getAllMessages, executeQuery } = require('../db/queries/message');

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

router.route('/')
  .get((req, res) => {
    getAllMessages()
    .then(messages => {
      res.status(200).send(messages);
    })
    .catch(error => {
        console.error('Error retrieving messages:', error);
        res.status(500).send('Internal Server Error');
      });
    })

  .post((req, res) => {

    const admin = req.session.admin;
    const user = req.session.user;
    const content = req.body.content;
    const userId = 13;
    const adminId = 12;

    if (admin) {
      saveMessage(adminId, userId, content)
        .then(result => {
          const newMessage = result.rows[0];
          res.status(200).send(newMessage);
        })
        .catch(error => {
          console.error('Error sending message:', error);
          res.status(500).send('Internal Server Error');
        });
    } else {
      if (user) {
        saveMessage(userId, adminId, content)
          .then(result => {
            const newMessage = result.rows[0];
            res.status(200).send(newMessage);
          })
          .catch(error => {
            console.error('Error sending message:', error);
            res.status(500).send('Internal Server Error');
          });
      }
    }
  });

module.exports = router;
