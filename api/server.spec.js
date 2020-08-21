const server = require("./server");
const supertest = require("supertest");
const creds = { username: "Blue", password: "dss231adw" };
const db = require("../database/dbConfig");

beforeAll(() => {
  return db("users").truncate();
});

describe("Server", () => {
  describe("Authentication", () => {
    describe("/api/auth/register", () => {
      it("returns status code 201 on successful registration", async () => {
        const res = await supertest(server)
          .post("/api/auth/register")
          .send(creds);
        expect(res.status).toBe(201);
      });

      it("responds with failure if user cannot register", async () => {
        let res = await supertest(server)
          .post("/api/auth/register")
          .send(creds);
        res = await supertest(server).post("/api/auth/register").send(creds);
        expect(res.status).toBe(500);
      });
    });

    describe("/api/auth/login", () => {
      it("returns status code 200 on successful login", async () => {
        const res = await supertest(server).post("/api/auth/login").send(creds);
        expect(res.status).toBe(200);
      });

      it("returns status code 401 on unsuccessful login", async () => {
        const res = await supertest(server)
          .post("/api/auth/login")
          .send({ ...creds, password: "bad password" });
        expect(res.status).toBe(401);
      });
    });
  });

  describe("/api/jokes", () => {
    it("returns status code 401 on unsuccessful login", async () => {
      const res = await supertest(server).post("/api/jokes");
      expect(res.status).toBe(401);
    });

    it("returns list of dad jokes on success.", async () => {
      const loginRes = await supertest(server)
        .post("/api/auth/login")
        .send(creds);

      const res = await supertest(server)
        .get("/api/jokes")
        .set("Authorization", loginRes.body.token);
      expect(res.status).toBe(200);
    });
  });
});

// DESIGN /api/jokes
// returns status code 401 on unsuccessful login

// returns list of dad jokes on success.
