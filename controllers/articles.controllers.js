const {
  getArticleById,
  incVotesByArticleID,
  findAllArticles,
} = require("../models/articles.models");

exports.fetchAllArticles = (req, res, next) => {
  const { sorted_by, order, topic } = req.query;
  findAllArticles(sorted_by, order, topic)
    .then((rows) => {
      res.status(200).send({ articles: rows });
    })
    .catch((err) => next(err));
};

exports.fetchArticleById = (req, res) => {
  const { article_id } = req.params;
  getArticleById(article_id).then((article) => {
    res.status(200).send({ article: article });
  });
};

exports.updateVotesByArticleID = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  if (typeof inc_votes !== "number") {
    return res
      .status(400)
      .send({ msg: "Invalid Input: 'votes' must be a number" });
  }
  incVotesByArticleID(article_id, inc_votes)
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch((err) => next(err));
};
