const db = require('../connection');

const getCars = () => {
  return db.query('SELECT * FROM cars;')
    .then(data => {
      return data.rows;
    });
};




module.exports = { getCars };