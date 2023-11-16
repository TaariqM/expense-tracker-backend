import request from "supertest";
import assert from "assert";
import app from "../index.js";

const newUser = {
  email: "joeburrow@gmail.com",
  firstname: "Joe",
  lastname: "Burrow",
  password: "JosephBur22!",
};

describe("POST /api/v1/register", function () {
  it("creates a new user", async function () {
    const response = await request(app).post("/api/v1/register").send(newUser);
    // const response = await request("https://localhost:8800")
    //   .post("/api/v1/register")
    //   .send(newUser);

    assert.strictEqual(response.status, 200);

    // .set("Accept", "application/json")
    // .expect("Content-Type", "application/json")
    // .expect(200, done);
  });
});
