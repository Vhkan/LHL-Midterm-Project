const db = require('../connection');

const getUsersId = (email) => {
  return db.query(`SELECT id FROM users WHERE email = ${email} ;`)
    .then(data => {
      return data.rows[0];
    });
};

module.exports = { getUsersId };
