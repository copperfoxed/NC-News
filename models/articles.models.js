const db = require("../db/connection");

exports.getArticleById = (id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Path Not Found" });
      }
      return rows[0];
    });
};

exports.incVotesByArticleID = (id, inc_votes) => {
  return db
    .query(
      `
    UPDATE articles
    SET
      votes = votes + $1
    WHERE article_id = $2
    RETURNING *`,
      [inc_votes, id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
      return rows[0];
    });
};

exports.findAllArticles = (sorted_by = "created_at", order = "DESC") => {
  const validSortOptions = [
    "article_id",
    "author",
    "title",
    "created_at",
    "votes",
  ];
  const validOrderOptions = ["DESC", "ASC"];
  if (
    !validSortOptions.includes(sorted_by) ||
    !validOrderOptions.includes(order)
  ) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
  const query = `SELECT article_id, author, title, topic, created_at, votes, article_img_url FROM articles ORDER BY ${sorted_by} ${order}`;
  return db.query(query).then(({ rows }) => {
    return rows;
  });
};
