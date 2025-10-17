const db = require("./connection");

const getAllUsers = () => {
  return db
    .query(`SELECT * FROM Users;`)
    .then(() => {
      return db.query(`SELECT * FROM articles
        WHERE topic = 'coding';`);
    })
    .then(() => {
      return db.query(`SELECT * FROM comments
        WHERE votes < 0;`);
    })
    .then(() => {
      return db.query(`SELECT * FROM topics`);
    })
    .then(() => {
      return db.query(`SELECT * FROM articles
        WHERE user = 'grumpy19'`);
    })
    .then(() => {
      return db.query(
        `SELECT * FROM comments
        WHERE votes > 10
        `
      );
    });
};

getAllUsers();
