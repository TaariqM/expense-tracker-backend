import request from "supertest";
import assert from "assert";
import app from "../index.js";

const newUser = {
  email: "jBurrow@gmail.com",
  firstname: "Joe",
  lastname: "Burrow",
  password: "JosephBur22!",
};

describe("POST /api/v1/register", function () {
  it("successfully creates a new user with an email, first name, last name, and password", function (done) {
    request(app)
      .post("/api/v1/register")
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
});
