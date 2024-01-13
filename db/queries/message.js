const db = require("../connection")

const saveMessage = (sender_id, receiver_id, content) => {

  const queryParam = [sender_id, receiver_id, content]
  let queryString = `
  INSERT INTO messages (sender_id, receiver_id, content)
  VALUES ($1, $2, $3) RETURNING *;`;

  return db.query(queryString, queryParam)
    .catch(error => {
      console.error('Error in saveMessage:', error);
      throw error;
    });
}

const getAllMessages = () => {
  let queryString = ` SELECT * FROM messages;`;

  return db.query(queryString)
    .then(data => {
      return data.rows;
    })
}

const executeQuery = () => {
  const query = 'DELETE FROM messages';
  return db.query(query);
};

module.exports = {
  saveMessage,
  getAllMessages,
  executeQuery
}
