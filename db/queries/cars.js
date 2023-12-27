const db = require('../connection');

const getCars = () => {
  return db.query('SELECT * FROM cars;')
    .then(data => {
      return data.rows;
    });
};

const getCar = (id) => {
  const queryParams = [id];
  return db.query(`SELECT * FROM cars WHERE id = $1;`, queryParams)
};

const filterResults = (options) => {
  const queryParams = [];
  let queryString = `
  SELECT *
  FROM cars
  WHERE 1 = 1
  `;

  // Define options

  const year = options.year;
  const make = options.make;
  const model = options.model;
  // Check if price was selected. If not selected, default to null
  const min = options.price ? options.price[0] : null;
  const max = options.price ? options.price[1] : null;

  if (year) {
    queryParams.push(year);       
    queryString += `AND year = $${queryParams.length}\n`;
  }

  if (make) {
    queryParams.push(make);
    queryString += `AND make = $${queryParams.length}\n`;
  }

  if (model) {
    queryParams.push(model);
    queryString += `AND model = $${queryParams.length}\n`;
  }

  if (min && max) {
    queryParams.push(min, max);
    console.log('Min and Max: ', min, max);
    queryString += `AND price >= $${queryParams.length - 1} AND price <= $${queryParams.length}`;
  }

  queryString += `;`;

  return db.query(queryString, queryParams)
    .then((result) => {
      const rows = result.rows;

      if(rows.length === 0) {
        console.log('No matching records found.')
        return result.rows;
      }
      return rows;

    })
    .catch((err) => {
      console.log(err.message);
    });
};


module.exports = {
  getCars,
  getCar,
  filterResults
};
