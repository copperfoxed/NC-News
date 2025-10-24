const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection.js");
const data = require("../db/data/test-data");
const seed = require("../db/seeds/seed.js");
const jestSorted = require("jest-sorted");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("app testing", () => {
  describe("GET /api/topics", () => {
    it("responds with 200 status code", () => {
      return request(app).get("/api/topics").expect(200);
    });
    it("responds with an array of objects", () => {
      return request(app)
        .get("/api/topics")
        .then((res) => {
          expect(res.body.topics).toBeInstanceOf(Array);
        });
    });
    it("responds with an object containing description, img_url and slug as keys", () => {
      return request(app)
        .get("/api/topics")
        .then((res) => {
          expect(res.body.topics[0]).toEqual({
            slug: "mitch",
            description: "The man, the Mitch, the legend",
            img_url: "",
          });
        });
    });
  });

  describe("GET /api/articles/", () => {
    it("responds with status code 200", () => {
      return request(app).get("/api/articles/").expect(200);
    });
    it("responds with an object containing an 'articles' array", () => {
      return request(app)
        .get("/api/articles/")
        .then((res) => {
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty("articles");
          expect(res.body.articles).toBeInstanceOf(Array);
        });
    });
    it("response of articles are in descending date order", () => {
      return request(app)
        .get("/api/articles/")
        .then((res) => {
          const apiArticles = res.body.articles;
          expect(apiArticles).toBeSortedBy("created_at", { descending: true });
        });
    });
    it("response does not contain a body property present on any article object", () => {
      return request(app)
        .get("/api/articles/")
        .then((res) => {
          expect(res.body.articles[1].body).toBe(undefined);
        });
    });
  });

  describe("GET /api/users", () => {
    it("responds with status code 200", () => {
      return request(app).get("/api/users/").expect(200);
    });
    it("response of an object with the key of users and the value of an array of objects", () => {
      return request(app)
        .get("/api/users/")
        .then((res) => {
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty("users");
          expect(res.body.users).toBeInstanceOf(Array);
        });
    });
    it("responses object contains the properties of username, name and avatar_url", () => {
      return request(app)
        .get("/api/users/")
        .then((res) => {
          const users = res.body.users;
          users.forEach((user) => {
            expect(user).toHaveProperty("username");
            expect(user).toHaveProperty("name");
            expect(user).toHaveProperty("avatar_url");
          });
        });
    });
  });

  describe("GET /api/articles/:article_id", () => {
    it("responds with status code 200 when all is ok", () => {
      return request(app).get("/api/articles/1").expect(200);
    });
    it("responds with an object with the key of article and the value of an article object", () => {
      return request(app)
        .get("/api/articles/1")
        .then((res) => {
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty("article");
          expect(res.body.article).toBeInstanceOf(Object);
        });
    });
    it("Response contains the following properties: author, title, article_id, body, topic, created_at, vote, article_img_url", () => {
      return request(app)
        .get("/api/articles/1")
        .then((res) => {
          const article = res.body.article;
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("article_id");
          expect(article).toHaveProperty("body");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("article_img_url");
        });
    });
  });

  describe("GET /api/articles/:article_id/comments", () => {
    it("responds with status code 200 when all is ok", () => {
      return request(app).get("/api/articles/1/comments").expect(200);
    });
    it("response with an object with the key of comments and the value of an array of comments", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .then((res) => {
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty("comments");
          expect(res.body.comments).toBeInstanceOf(Array);
        });
    });
    it("responds with an array of comments ordered in descending date order", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .then((res) => {
          const apiComments = res.body.comments;
          expect(apiComments).toBeSortedBy("created_at", { descending: true });
        });
    });
    it("Response contains the following properties: comment_id, votes, created_at, author, body, article_id", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .then((res) => {
          const expectedKeys = [
            "comment_id",
            "votes",
            "created_at",
            "author",
            "body",
            "article_id",
          ];

          const comments = res.body.comments;

          comments.forEach((comment) => {
            expectedKeys.forEach((key) => {
              expect(comment).toHaveProperty(key);
            });
          });
        });
    });
    it("response returns a 404 error with string 'Not Found' when inputted article doesnt exist or does not have any comments", () => {
      return request(app)
        .get("/api/articles/299/comments")
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toEqual("Not Found");
        });
    });
    it("response returns a 400 error with string 'Bad Request' when article_id supplied is not a number", () => {
      return request(app)
        .get("/api/articles/one/comments")
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toEqual("Bad Request");
        });
    });
  });

  describe("POST /api/articles/:article_id/comments", () => {
    const newComment = {
      username: "butter_bridge",
      body: "I dont know if you know, but foxes have split genus types, in which a large population of 'foxes' arent even foxes.",
    };
    const article_id = 1;
    it("returns a 201 status code", () => {
      return request(app)
        .post(`/api/articles/${article_id}/comments`)
        .send(newComment)
        .expect(201);
    });
    it("response returns the posted comment", () => {
      return request(app)
        .post(`/api/articles/${article_id}/comments`)
        .send(newComment)
        .then((res) => {
          const comment = res.body.comment;

          expect(comment.author).toBe(newComment.username);
          expect(comment.body).toBe(newComment.body);
          expect(comment.article_id).toBe(article_id);
        });
    });
    it("response returns a 404 error with string 'Not Found' when inputted article doesnt exist", () => {
      return request(app)
        .post("/api/articles/299/comments")
        .send(newComment)
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toEqual("Not Found");
        });
    });
    it("response returns a 400 error with string 'Bad Request' when article_id supplied is not a number", () => {
      return request(app)
        .post("/api/articles/one/comments")
        .send(newComment)
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toEqual("Bad Request");
        });
    });
    it("responds with a 400 error with string 'No Comment Content' when comment supplied is empty", () => {
      return request(app)
        .post(`/api/articles/${article_id}/comments`)
        .send({ body: "", username: "butter_bridge" })
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toEqual("No Comment Content");
        });
    });
  });

  describe("PATCH /api/articles/:article_id", () => {
    const incVotes = { inc_votes: 10 };
    const negVotes = { inc_votes: -100 };
    const articleNum = 1;
    it("response contains the updated article with the votes correctly adjusted, as well as a 201 status code", () => {
      return request(app)
        .patch(`/api/articles/${articleNum}`)
        .send(incVotes)
        .expect(201)
        .then((res) => {
          const { article } = res.body;
          expect(article).toBeInstanceOf(Object);
          expect(article).toHaveProperty("article_id", articleNum);
          expect(article).toHaveProperty("votes");
          expect(article.votes).toBe(100 + incVotes.inc_votes);
        });
    });
    it("response contains the updated article when the votes are negative", () => {
      return request(app)
        .patch(`/api/articles/${articleNum}`)
        .send(negVotes)
        .expect(201)
        .then((res) => {
          const { article } = res.body;
          expect(article.votes).toBe(100 + negVotes.inc_votes);
        });
    });
    it("Responds with status code 400 when votes is not a number", () => {
      return request(app)
        .patch(`/api/articles/${articleNum}`)
        .send({ inc_votes: "ten" })
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Invalid Input: 'votes' must be a number");
        });
    });
    it("responds with Status code: 400 when article_id is not a number accompanyied by string 'Bad Request'", () => {
      return request(app)
        .patch(`/api/articles/four_hundred`)
        .send(incVotes)
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Bad Request");
        });
    });
    it("responds with Status code: 404 when article_id is an article that does not exist, accompanied by 'Not Found'", () => {
      return request(app)
        .patch(`/api/articles/404`)
        .send(incVotes)
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("Not Found");
        });
    });
    it("responds with Status code: 400 when votes field is empty, accompanyied by 'Invalid Input: votes must be an number'", () => {
      return request(app)
        .patch(`/api/articles/1`)
        .send({ inc_votes: "" })
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Invalid Input: 'votes' must be a number");
        });
    });
  });

  describe("DELETE /api/comments/:comment_id", () => {
    it("response returns an empty comment and status code 204 as well as correctly deleting the comment", () => {
      return request(app)
        .delete("/api/comments/1")
        .expect(204)
        .then((res) => {
          expect(res.body).toEqual({});
        })
        .then(() => {
          return request(app)
            .delete("/api/comments/1")
            .then((res) => {
              expect(res.status).toBe(404);
              expect(res.body.msg).toBe("Not Found");
            });
        });
    });
    it("responds with Status code: 404 when comment_id is a comment that does not exist, accompanied by 'Not Found'", () => {
      return request(app)
        .delete(`/api/comments/404`)
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("Not Found");
        });
    });
    it("responds with Status code: 400 when comment_id is not a valid number accompanyied by string 'Bad Request'", () => {
      return request(app)
        .delete(`/api/comments/1.5`)
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Bad Request");
        });
    });
  });

  describe("GET /api/articles (sorting Queries)", () => {
    it("200: returns a default sorted array of articles by created_at and DESC", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((res) => {
          const apiArticles = res.body.articles;
          expect(apiArticles).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty("articles");
          expect(apiArticles).toBeInstanceOf(Array);
          expect(apiArticles).toBeSortedBy("created_at", { descending: true });
        });
    });
    it("returns a sorted array when given a column and order, in ths case 'author' and 'ASC'", () => {
      return request(app)
        .get("/api/articles")
        .query({ sorted_by: "author", order: "ASC" })
        .expect(200)
        .then((res) => {
          const apiArticles = res.body.articles;
          expect(apiArticles).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty("articles");
          expect(apiArticles).toBeInstanceOf(Array);
          expect(apiArticles).toBeSortedBy("author", { descending: false });
        });
    });
    it("returns status 400 and 'Bad Request' when sort method or order, isnt in whitelst", () => {
      return request(app)
        .get("/api/articles")
        .query({ sorted_by: "Tully", order: "Mouldeen" })
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Bad Request");
        });
    });
    it("returns a sorted array when given a column and order, in ths case 'author' and 'ASC'", () => {
      return request(app)
        .get("/api/articles")
        .query({ sorted_by: "article_id", order: "DESC" })
        .expect(200)
        .then((res) => {
          const apiArticles = res.body.articles;
          expect(apiArticles).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty("articles");
          expect(apiArticles).toBeInstanceOf(Array);
          expect(apiArticles).toBeSortedBy("article_id", { descending: true });
        });
    });
  });

  describe.only("GET /api/articles (topic query)", () => {
    it("200: Should respond with selected topics when given a query", () => {
      return request(app)
        .get("/api/articles")
        .query({ sorted_by: "article_id", order: "DESC", topic: "mitch" })
        .expect(200)
        .then((res) => {
          const apiArticles = res.body.articles;
          expect(apiArticles).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty("articles");
          expect(apiArticles).toBeInstanceOf(Array);
          expect(apiArticles).toBeSortedBy("article_id", { descending: true });
          apiArticles.forEach((article) => {
            expect(article.topic).toBe("mitch");
          });
        });
    });
    it("200: should respond with an ordered array when not fed a topic", () => {
      return request(app)
        .get("/api/articles")
        .query({ sorted_by: "article_id", order: "DESC" })
        .expect(200)
        .then((res) => {
          const apiArticles = res.body.articles;
          expect(apiArticles).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty("articles");
          expect(apiArticles).toBeInstanceOf(Array);
          expect(apiArticles).toBeSortedBy("article_id", { descending: true });
        });
    });
    it("400: should respond with 'Bad Request' when given a topic that doesnt exist/isnt in whitelist", () => {
      return request(app)
        .get("/api/articles")
        .query({ sorted_by: "article_id", order: "DESC", topic: "lizard" })
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Bad Request");
        });
    });
  });
});
