const db = require('../connection');

const getUsersId = async (email) => {
  try {
    // Parameterized query to prevent SQL injection
    const queryResult = await db.query('SELECT id FROM users WHERE email = $1;', [email]);
    return queryResult.rows[0];
  } catch (error) {
    throw error;
  }
};

module.exports = { getUsersId };
