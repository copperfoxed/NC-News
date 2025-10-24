const db = require("../db/connection");

exports.getCommentsByArticleID = (id) => {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`,
      [id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
      return rows;
    });
};

exports.pushNewCommentByArticleID = (id, data) => {
  const { body, username } = data;
  const insertComment = `INSERT INTO Comments
        (article_id, body, author)
        VALUES ($1, $2, $3)
        RETURNING *;
        `;
  const values = [id, body, username];

  return db.query(insertComment, values);
};

exports.removeCommentByID = (id) => {
  return db
    .query(
      `DELETE FROM comments
    WHERE comment_id = $1`,
      [id]
    )
    .then(({ rows, rowCount }) => {
      if (rowCount === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
    });
};
