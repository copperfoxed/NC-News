const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection.js");
const data = require("../db/data/test-data");
const seed = require("../db/seeds/seed.js");

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
          for (let i = 0; i < apiArticles.length - 1; i++) {
            const currentDate = new Date(apiArticles[i].created_at);
            const nextDate = new Date(apiArticles[i + 1].created_at);
            expect(currentDate >= nextDate).toBe(true);
          }
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
  xdescribe("GET /api/articles/:article_id", () => {
    it("responds with status code 200 when all is ok", () => {
      return request(app).get("/api/articles/1").expect(200);
    });
    it("responds with an object with the key of article and the value of an article object", () => {
      return request(app)
        .get("/api/articles/1")
        .then((res) => {
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty("users");
          expect(res.body.articles).toBeInstanceOf(Array);
        });
    });
    it("Response contains the following properties: author, title, article_id, body, topic, created_at, vote, article_img_url", () => {
      return request(app)
        .get("/api/articles/1")
        .then((res) => {
          const articles = res.body.articles;
          articles.forEach((article) => {
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
  });
});
