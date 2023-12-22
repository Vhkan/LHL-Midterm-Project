DROP TABLE IF EXISTS cars CASCADE;

CREATE TABLE cars (
  id SERIAL PRIMARY KEY NOT NULL,
  serial_number INT NOT NULL,
  make VARCHAR(255) NOT NULL,
  model VARCHAR(255) NOT NULL,
  year INT NOT NULL,
  interior_color VARCHAR(255) NOT NULL,
  exterior_color VARCHAR(255) NOT NULL,
  price INT NOT NULL,
  odometer INT NOT NULL,
  transmission VARCHAR(255) NOT NULL,
  photo_url_1 VARCHAR(255),
  photo_url_2 VARCHAR(255),
  photo_url_3 VARCHAR(255)
);
