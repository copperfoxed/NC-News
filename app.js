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
  deleteCommentByID,
} = require("./controllers/comments.controllers");
const {
  handle500Errors,
  handlePSQLErrors,
} = require("./controllers/errors.controllers");

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

app.delete("/api/comments/:comment_id", deleteCommentByID);

app.use(handlePSQLErrors);
app.use(handle500Errors);

module.exports = app;
