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

//Delete a car
const deleteCar = (id) => {
  return db.query('DELETE FROM cars WHERE id = $1 RETURNING *;', [id])
  .then(data => {
    return data.rows[0];
  });
};

const markCarAsSold = (id) => {
  return db.query(`
  UPDATE cars
  SET is_sold = true
  WHERE id = ${id};`)
  .then(() => getCars())
  .then(data => {
    return data;
  });
}

const addCar = (options) => {
  const make = options.make;
  const model = options.model;
  const year = options.year;
  const color = options.color;
  const odometer = options.odometer;
  const price = options.price;
  const photo_1 = options.photo_1;
  const photo_2 = options.photo_2;
  const photo_3 = options.photo_3;

  const queryParams = [
    make,
    model,
    year,
    color,
    odometer,
    price,
    photo_1 || null,
    photo_2 || null,
    photo_3 || null,
  ];

  let queryString = `
    INSERT INTO cars (make, model, year, color, odometer, price, photo_url_1, photo_url_2, photo_url_3)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *;`;

  return db.query(queryString, queryParams)
    .then(data => {
      return data.rows;
    })
    .catch(err => {
      console.log(err.message);
    });
};



module.exports = {
  getCars,
  getCar,
  filterResults,
  deleteCar,
  markCarAsSold,
  addCar
};
