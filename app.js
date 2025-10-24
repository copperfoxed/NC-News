const express = require("express");
const app = express();
const db = require("./db/connection");
const {
  fetchArticleById,
  updateVotesByArticleID,
} = require("./controllers/articles.controllers");
const {
  fetchCommentsByArticleID,
  createCommentsByArticleID,
} = require("./controllers/comments.controllers");

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

app.get("/api/articles/:article_id", fetchArticleById);

app.get("/api/articles/:article_id/comments", fetchCommentsByArticleID);

app.post("/api/articles/:article_id/comments", createCommentsByArticleID);

app.patch("/api/articles/:article_id", updateVotesByArticleID);

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request" });
  } else if (err.code === "23503") {
    res.status(404).send({ msg: "Not Found" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    console.error(err);
    res.status(500).send({ msg: "Internal Server Error" });
  }
});

module.exports = app;
