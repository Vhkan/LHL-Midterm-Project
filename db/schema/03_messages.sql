DROP TABLE IF EXISTS messages CASCADE;

CREATE TABLE messages (
  id SERIAL PRIMARY KEY NOT NULL,
  sender_id INT,
  reciever_id INT ,
  content TEXT,
  created_at TIMESTAMP default now()
);
