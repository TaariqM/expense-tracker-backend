import request from "supertest";
import assert from "assert";
import app from "../index.js";

const newUser = {
  email: "joeburrow@gmail.com",
  firstname: "Joe",
  lastname: "Burrow",
  password: "JosephBur22!",
};

const correctLoginInfo = {
  email: "joeburrow@gmail.com",
  password: "JosephBur22!",
};

const incorrectLoginInfo = {
  email: "joeburrow@gmail.com",
  password: "josephBur22!",
};

function makePostRequest(requestURL) {
  return request(app).post(requestURL);
}

function makeGetRequest(requestURL) {
  return request(app).get(requestURL);
}

function makeDeleteRequest(requestURL) {
  return request(app).delete(requestURL);
}

//---------------- REGISTER PAGE SCENARIOS ----------------//
describe("User registration scenarios", function () {
  describe("POST Requests to /api/v1/register", function () {
    it("successfully creates a new user with an email, first name, last name, and password", function (done) {
      makePostRequest("/api/v1/register")
        .send(newUser)
        .expect(200)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }

          assert.strictEqual(res.status, 200);
          assert.equal(res._body.email, newUser.email);
          assert.equal(res._body.first_name, newUser.firstname);
          assert.equal(res._body.last_name, newUser.lastname);
          assert.equal(res._body.password, newUser.password);

          done();
        });
    });

    it("returns an error status when try to register a user that already exists", function (done) {
      makePostRequest("/api/v1/register")
        .send(newUser)
        .expect(500)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }

          assert.strictEqual(res.status, 500);
          assert.equal(res.text.replace(/"/g, ""), "User already exists");

          done();
        });
    });
  });
});

//---------------- LOGIN PAGE SCENARIOS ----------------//
describe("User login scenarios", function () {
  describe("POST requests to /api/v1/login", function () {
    it("performs a successful login with a users credentials", function (done) {
      makePostRequest("/api/v1/login")
        .send(correctLoginInfo)
        .expect(200)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }

          assert.strictEqual(res.status, 200);
          assert.equal(res._body[0].email, correctLoginInfo.email);
          assert.equal(res._body[0].password, correctLoginInfo.password);

          done();
        });
    });

    it("performs an unsuccessful login with an incorrect password", function (done) {
      makePostRequest("/api/v1/login")
        .send(incorrectLoginInfo)
        .expect(401)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          // console.log(res._body);
          assert.strictEqual(res.status, 401);
          // assert.notEqual(res._body[0].password, incorrectLoginInfo.password); //passwords should not be equal
          // assert.equal(res._body[0].email, incorrectLoginInfo.email);

          done();
        });
    });
  });
});
