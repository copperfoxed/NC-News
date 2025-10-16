const db = require("./connection");

const getAllUsers = () => {
  return db.query("SELECT * FROM Users;");
};

getAllUsers();
