import request from "supertest";
import assert from "assert";
import app from "../index.js";

let expenseNum = 9;

const newUser = {
  email: "lebronjames@gmail.com",
  firstname: "Lebron",
  lastname: "James",
  password: "Lebron23james!",
};

const correctLoginInfo = {
  email: "lebronjames@gmail.com",
  password: "Lebron23james!",
};

const incorrectLoginInfo = {
  email: "joeburrow@gmail.com",
  password: "josephBur22!",
};

const updatePasswordInfo = {
  email: "joeburrow@gmail.com",
  password: "josephBurrow23!",
};

const newExpenseFolder = {
  userId: 1,
  folderName: "name" + Math.floor(Math.random() * 100 + 1),
};

const failedNewExpenseFolder = {
  userId: 1,
  folderName: null,
};

const updateExpenseFolderName = {
  expId: 1,
  name: "New Name",
};

const failedUpdateExpenseFolderName = {
  expId: 1000,
  name: null,
};

const newExpense = {
  user_Id: 1,
  expenseFolder_Id: 2,
  title: "New Expense",
  amount: 20,
  category: null,
  desc: null,
  date: "2023-11-27",
};

const failedNewExpense = {
  user_Id: 1,
  expenseFolder_Id: 2,
  title: null,
  amount: 20,
  category: null,
  desc: null,
  date: "2023-11-27",
};

const updatedExpense = {
  title: "New Expense Name",
  amount: 20,
  category: null,
  desc: null,
  date: "2023-11-26",
  expenseId: 1,
};

const failedUpdatedExpense = {
  title: "New Expense Name",
  amount: null,
  category: null,
  desc: null,
  date: "2023-11-26",
  expenseId: 1,
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
    //   it("successfully creates a new user with an email, first name, last name, and password", function (done) {
    //     makePostRequest("/api/v1/register")
    //       .send(newUser)
    //       .expect(200)
    //       .end(function (err, res) {
    //         if (err) {
    //           return done(err);
    //         }

    //         assert.strictEqual(res.status, 200);
    //         assert.equal(res._body.email, newUser.email);
    //         assert.equal(res._body.first_name, newUser.firstname);
    //         assert.equal(res._body.last_name, newUser.lastname);
    //         assert.equal(res._body.password, newUser.password);

    //         done();
    //       });
    //   });

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

//---------------- FORGOT PASSWORD PAGE SCENARIOS ----------------//
describe("Forgot password scenarios", function () {
  describe("POST request to /api/v1/forgot_password", function () {
    it("updates the user password", function (done) {
      makePostRequest("/api/v1/forgot_password")
        .send(updatePasswordInfo)
        .expect(200, done);
    });
  });
});

//---------------- DASHBOARD PAGE SCENARIOS ----------------//
describe("User Dashboard scenarios", function () {
  describe("GET request to /api/v1/user/:id", function () {
    it("successfully gets existing user information", function (done) {
      makeGetRequest("/api/v1/user/" + 1)
        .expect(200)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it("unsuccessfully gets existing user information", function (done) {
      makeGetRequest("/api/v1/user/" + 300)
        .expect(500)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });
  });

  describe("POST request to /api/v1/addExpenseFolder", function () {
    it("successfully creates and adds an expense folder", function (done) {
      makePostRequest("/api/v1/addExpenseFolder")
        .send(newExpenseFolder)
        .expect(200)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it("unsuccessfully creates and adds an expense folder", function (done) {
      makePostRequest("/api/v1/addExpenseFolder")
        .send(failedNewExpenseFolder)
        .expect(500)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });
  });

  describe("GET request to /api/v1/expenseFolder/:id", function () {
    it("successfully gets all of the expense folders based off of the user id", function (done) {
      makeGetRequest("/api/v1/expenseFolder/" + 1)
        .expect(200)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it("unsuccessfully gets all of the expense folders based off of the user id", function (done) {
      makeGetRequest("/api/v1/expenseFolder/" + 1000)
        .expect(500)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });
  });

  describe("GET request to /api/v1/expenseFolder/:id/:expId", function () {
    it("successfully gets a specific expense folder based off of the user id and expense folder id", function (done) {
      makeGetRequest("/api/v1/expenseFolder/" + 1 + "/" + 2)
        .expect(200)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it("unsuccessfully gets a specific expense folder based off of the user id and expense folder id", function (done) {
      makeGetRequest("/api/v1/expenseFolder/" + 1000 + "/" + 1)
        .expect(500)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });
  });

  describe("POST request to /api/v1/expenseFolder/:expId", function () {
    it("successfully updates the name of an expense folder", function (done) {
      makePostRequest("/api/v1/expenseFolder/" + 2)
        .send(updateExpenseFolderName)
        .expect(200)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it("unsuccessfully updates the name of an expense folder", function (done) {
      makePostRequest("/api/v1/expenseFolder/" + 2)
        .send(failedUpdateExpenseFolderName)
        .expect(500)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });
  });

  describe("DELETE request to /api/v1/expenseFolder/:expId", function () {
    it("successfully deletes an expense folder", function (done) {
      makeDeleteRequest("/api/v1/expenseFolder/" + 1)
        .expect(200)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    // it("unsuccessfully deletes an expense folder", function (done) {
    //   makeDeleteRequest("/api/v1/expenseFolder/" + 1)
    //     .expect(500)
    //     .end(function (err, res) {
    //       if (err) {
    //         return done(err);
    //       }
    //       done();
    //     });
    // });
  });
});

//---------------- EXPENSE PAGE SCENARIOS ----------------//
describe("Expense page scenarios", function () {
  describe("POST request to /api/v1/expense", function () {
    it("successfully creates and adds a new expense", function (done) {
      makePostRequest("/api/v1/expense")
        .send(newExpense)
        .expect(200)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it("unsuccessfully creates and adds a new expense", function (done) {
      makePostRequest("/api/v1/expense")
        .send(failedNewExpense)
        .expect(500)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });
  });

  describe("GET request to /api/v1/expense/:id/:expId", function () {
    it("successfully gets all expenses based on the user id and expense folder id", function (done) {
      makeGetRequest("/api/v1/expense/" + 1 + "/" + 2)
        .expect(200)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it("unsuccessfully gets all expenses based on the user id and expense folder id", function (done) {
      makeGetRequest("/api/v1/expense/" + 1000 + "/" + 2)
        .expect(500)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });
  });

  describe("POST request to /api/v1/expense/:expenseId", function () {
    it("successfully edits/updates an expense", function (done) {
      makePostRequest("/api/v1/expense/" + 1)
        .send(updatedExpense)
        .expect(200)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          done(err);
        });
    });

    it("unsuccessfully edits/updates an expense", function (done) {
      makePostRequest("/api/v1/expense/" + 1)
        .send(failedUpdatedExpense)
        .expect(500)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          done(err);
        });
    });
  });

  describe("DELETE request to /api/v1/expense/:expenseId", function () {
    it("successfully deletes an expense", function (done) {
      // makePostRequest("/api/v1/expense")
      //   .send({
      //     user_Id: 1,
      //     expenseFolder_Id: 2,
      //     title: "Expense",
      //     amount: 30,
      //     category: null,
      //     desc: null,
      //     date: "2023-11-27",
      //   })
      //   .expect(200);
      // expenseNum++;
      // console.log(expenseNum); // console logs 10

      makeDeleteRequest("/api/v1/expense/" + 10)
        .expect(200)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    // it("unsuccessfully deletes an expense", function (done) {});
  });
});
