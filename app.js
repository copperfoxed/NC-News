const express = require("express");
const app = express();
const db = require("./db/connection");
const { fetchArticleById } = require("./models/articles.models");

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send({ msg: "Hello from Express Server" });
});

app.get("/api/topics", (req, res) => {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    res.status(200).send({ topics: rows });
  });
});

app.get("/api/articles", (req, res) => {
  return db
    .query(
      `SELECT article_id, author, title, topic, created_at, votes, article_img_url FROM articles ORDER BY created_at DESC`
    )
    .then(({ rows }) => {
      res.status(200).send({ articles: rows });
    });
});

app.get("/api/users", (req, res) => {
  return db.query(`SELECT * FROM users`).then(({ rows }) => {
    res.status(200).send({ users: rows });
  });
});

app.get("/api/articles/:article_id", (req, res) => {
  const { article_id } = req.params;
  fetchArticleById(article_id).then(({ rows }) => {
    res.status(200).send({ article: rows[0] });
  });
});

// app.use((err, req, res, next) => {
//   console.log(err, "<<< err in new error handling middleware");
//   if (err.status && err.msg) {
//     res.status(err.status).send({ msg: err.msg });
//   } else {
//     next(err);
//   }
// });

module.exports = app;
