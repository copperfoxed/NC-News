const { getArticleById } = require("../models/articles.models");
const {
  getCommentsByArticleID,
  pushNewCommentByArticleID,
  removeCommentByID,
} = require("../models/comments.models");

exports.fetchCommentsByArticleID = (req, res, next) => {
  const { article_id } = req.params;
  if (isNaN(article_id)) {
    return next({ status: 400, msg: "Bad Request" });
  }
  getCommentsByArticleID(article_id)
    .then((comments) => {
      res.status(200).send({ comments: comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.createCommentsByArticleID = (req, res, next) => {
  const { article_id } = req.params;
  const { body, username } = req.body;
  if (!body || body.trim().length === 0) {
    return next({ status: 400, msg: "No Comment Content" });
  }
  const data = { body, username };
  return pushNewCommentByArticleID(article_id, data)
    .then((insertComment) => {
      res.status(201).send({ comment: insertComment.rows[0] });
    })
    .catch((err) => next(err));
};

exports.deleteCommentByID = (req, res, next) => {
  const { comment_id } = req.params;
  return removeCommentByID(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => next(err));
};
