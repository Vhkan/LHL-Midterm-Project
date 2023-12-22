DROP TABLE IF EXISTS messages CASCADE;

CREATE TABLE messages (
  id SERIAL PRIMARY KEY NOT NULL,
  customer_id INT REFERENCES customers(id),
  sales_person_id INT REFERENCES sales_person(id),
  message TEXT
);
