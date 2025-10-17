const db = require("../connection");
const format = require("pg-format");
const { userData } = require("../data/test-data");
const { convertTimestampToDate, marryFunc } = require("./utils");

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db
    .query(`DROP TABLE IF EXISTS Comments;`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS Articles;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS Topics;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS Users;`);
    })
    .then(() => {
      return db.query(`
     CREATE TABLE Topics (
      slug VARCHAR PRIMARY KEY, 
      description VARCHAR, 
      img_url VARCHAR(1000)
      );
      `);
    })

    .then(() => {
      return db.query(
        `
    CREATE TABLE Users (
      username VARCHAR PRIMARY KEY,
      name VARCHAR NOT NULL,
      avatar_url VARCHAR(1000)
      );
      `
      );
    })
    .then(() => {
      return db.query(`
    CREATE TABLE Articles (
    article_id SERIAL PRIMARY KEY,
    title VARCHAR NOT NULL,
    topic VARCHAR NOT NULL REFERENCES Topics(slug),
    author VARCHAR NOT NULL REFERENCES Users(username),
    body TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    votes INT DEFAULT 0,
    article_img_url VARCHAR(1000)
    )
    `);
    })
    .then(() => {
      return db.query(`
    CREATE TABLE Comments (
    comment_id SERIAL PRIMARY KEY,
    article_id INT REFERENCES Articles(article_id),
    body TEXT NOT NULL,
    votes INT DEFAULT 0,
    author VARCHAR NOT NULL REFERENCES Users(username),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    `);
    })
    .then(() => {
      const formattedTopics = topicData.map(
        ({ slug, description, img_url }) => [slug, description, img_url]
      );
      const insertTopics = format(
        `INSERT INTO Topics
        (slug, description, img_url)
        VALUES %L;`,
        formattedTopics
      );
      return db.query(insertTopics);
    })
    .then(() => {
      const formattedUsers = userData.map(({ username, name, avatar_url }) => [
        username,
        name,
        avatar_url,
      ]);
      const insertUsers = format(
        `INSERT INTO Users
        (username, name, avatar_url)
        VALUES %L;`,
        formattedUsers
      );
      return db.query(insertUsers);
    })
    .then(() => {
      const correctedArticlesData = articleData.map(convertTimestampToDate);
      const formattedArticles = correctedArticlesData.map(
        ({
          title,
          topic,
          author,
          body,
          created_at,
          votes,
          article_img_url,
        }) => [title, topic, author, body, created_at, votes, article_img_url]
      );
      const insertArticles = format(
        `INSERT INTO Articles
        (title, topic, author, body, created_at, votes, article_img_url)
        VALUES %L
        RETURNING *;`,
        formattedArticles
      );

      return db.query(insertArticles);
    })
    .then(({ rows }) => {
      const lookUpObject = marryFunc(
        commentData,
        rows,
        "title",
        "article_title",
        "article_id"
      );
      console.log(lookUpObject);
      const correctedCommentsData = lookUpObject.map(convertTimestampToDate);
      const formattedComments = correctedCommentsData.map(
        ({ article_id, body, votes, author, created_at }) => [
          article_id,
          body,
          votes,
          author,
          created_at,
        ]
      );
      const insertComments = format(
        `INSERT INTO Comments
        (article_id, body, votes, author, created_at)
        VALUES %L;`,
        formattedComments
      );

      return db.query(insertComments);
    });
};
module.exports = seed;
