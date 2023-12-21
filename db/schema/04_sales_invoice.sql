DROP TABLE IF EXISTS sales_invoice CASCADE;

CREATE TABLE sales_invoice (
  id SERIAL PRIMARY KEY NOT NULL,
  invoice_number SERIAL NOT NULL,
  invoice_date date DEFAULT now(),
  car_id INT REFERENCES cars(id),
  customer_id INT REFERENCES customers(id),
  sales_person_id INT REFERENCES sales_person(id),
  price INT
);
