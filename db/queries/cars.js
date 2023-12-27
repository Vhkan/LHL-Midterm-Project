const db = require('../connection');

const getCars = () => {
  return db.query('SELECT * FROM cars;')
    .then(data => {
      return data.rows;
    });
};

const getCar = (id) => {
  const stringQuery = [id];
  return db.query(`SELECT * FROM cars WHERE id = $1;`, stringQuery)
};


module.exports = {
  getCars,
  getCar
};
