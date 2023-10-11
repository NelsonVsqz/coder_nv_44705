const { expect } = require("chai");
const request = require("supertest");
const app = "http://localhost:8080";


describe("Authentication Routes", () => {

  it("should register a new user", async () => {
    //colocar nuevo
    const userCredentials = {
      email: "testabc123@gmmal.com",
      password: "testabc123",
      first_name: "Namedacb",
      last_name: "lastdacb",
      age: 26,
    };

    const res = await request(app).post("/auth/register").send(userCredentials);
    console.log(res);
    expect(res.statusCode).to.equal(302);
    expect(res.redirect).to.equal(true);
  });

  it("should fail to register with invalid data", async () => {
    const invalidUserCredentials = {
      email: "testinvalid111@example.com",
      password: "testinvalid111",
    };

    const res = await request(app)
      .post("/auth/register")
      .send(invalidUserCredentials);

    expect(res.status).to.equal(400);
  });

  it("should log in an existing user", async () => {
    const userCredentials = {
      email: "pepe4@gmail.com",
      password: "123456",
    };

    const res = await request(app).post("/auth/login").send(userCredentials);

    expect(res.statusCode).to.equal(302);

  });

  it("should fail to log in with invalid credentials", async () => {
    const invalidCredentials = {
      email: "tes@ex.com",
      password: "incorrect",
    };

    const res = await request(app).post("/auth/login").send(invalidCredentials);

    expect(res.statusCode).to.equal(200);
  });
});
