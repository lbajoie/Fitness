const client = require("./client");
const bcrypt = require('bcrypt');

// database functions

// user functions
async function createUser({ username, password }) {
  const SALT_COUNT = 10;
  const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
  try {
    const { rows: [user], } = await client.query(
      `
    INSERT INTO users(username, password)
    VALUES ($1, $2)
    ON CONFLICT (username) DO NOTHING
    RETURNING id, username;
    `,
      [username, hashedPassword]
    );
    return user;
  } catch (error) {
    console.log("Problem creating user");
  }
}
  

  



  


async function getUser({ username, password }) {

  try {
    const user = await getUserByUsername(username);
    const hashedPassword = user.password;
    const isValid = await bcrypt.compare(password, hashedPassword);
    if (isValid){
      delete user.password;
      return user;
    
    } else {
      return null;
  } 
} catch (error) {
  console.log(error);
  throw error;
   }
}   
  



async function getUserById(userId) {
  try {
    const { rows: [user], } = await client.query(
      `
      SELECT *
      FROM users
      WHERE id = $1; 
    `, [userId]
    );
    if (!user) {
      return null;
    } else {
      delete user.password;
      return user;
    }
  } catch (error) {
    console.error("Problems locating user!!:", error);
    throw error;
  }
}


async function getUserByUsername(userName) {
  try {
    const { rows: [user], } = await client.query(
      `
      SELECT *
      FROM users
      WHERE username=$1;
      `, [userName]
    );

    return user;
  } catch (error) {
    console.log("Problem locating user!!:", error);
    alert("Problems finding user", error);
  }

}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}
