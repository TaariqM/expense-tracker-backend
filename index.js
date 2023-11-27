import express from "express";
import mysql from "mysql";
import cors from "cors";
import dotenv from "dotenv";
import sqlite3 from "sqlite3";

dotenv.config();

const app = express();

console.log(
  "NODE_ENV Environment Variable: ",
  JSON.stringify(process.env.NODE_ENV)
);
const isTestEnv = process.env.NODE_ENV === "test";
console.log("isTestEnv Value: ", isTestEnv);
const path = isTestEnv
  ? "./db/expenseTrackerTestDB.db"
  : "./db/expenseTrackerDB.db";

console.log(path);
const db = new sqlite3.Database(path);
// const db = new sqlite3.Database("./db/expenseTrackerDB.db");

// const db = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_DATABASE,
// });

// db.connect((err) => {
//   if (err) {
//     console.error("Database connection error:", err);
//   } else {
//     console.log("Connected to the database");
//   }
// });

app.use(express.json());
app.use(cors());

app.get("/", (request, response) => {
  response.json("Hello, this is the backend");
});

// Creates and adds a new user account
app.post("/api/v1/register", (request, response) => {
  const values = [
    request.body.email,
    request.body.password,
    request.body.firstname,
    request.body.lastname,
  ];

  db.serialize(() => {
    const q = db.prepare(
      "INSERT INTO user (email, password, first_name, last_name) VALUES (?, ?, ?, ?)"
    );
    q.run(values, function (err) {
      if (err) {
        return response.status(500).json("User already exists");
      }

      // Retrieve the inserted user
      db.get(
        "SELECT * FROM user WHERE user_id = ?",
        this.lastID,
        (err, data) => {
          if (err) {
            return response.status(500).json(err);
          } else {
            return response.status(200).json(data);
          }
        }
      );
    });
    q.finalize();
  });
});

// Passes user login information, to login an existing user account
app.post("/api/v1/login", (request, response) => {
  const values = [request.body.email, request.body.password];

  db.serialize(() => {
    const q = db.prepare("SELECT * FROM user WHERE email = ? AND password = ?");

    q.all(values, function (err, rows) {
      if (err) {
        return response.status(500).json(err);
      }

      // If there are rows, the login is successful. You can send the user data back
      if (rows.length > 0) {
        return response.status(200).json(rows);
      } else {
        return response.status(401).json({ message: "Invalid credentials" });
      }
    });
    q.finalize();
  });
});

// Update the password for an existing user
app.post("/api/v1/forgot_password", (request, response) => {
  const values = [request.body.password, request.body.email];

  db.serialize(() => {
    const q = db.prepare("UPDATE user SET password = ? WHERE email = ?");

    q.run(values, function (err) {
      if (err) {
        return response.status(500).json(err);
      }

      db.get(
        "SELECT * FROM user WHERE email = ?",
        request.body.email,
        (err, data) => {
          if (err) {
            return response.status(500).json(err);
          }
          return response.status(200).json(data);
        }
      );
    });
    q.finalize();
  });
});

// Get a specific user based on the user ID
app.get("/api/v1/user/:id", (request, response) => {
  const userId = request.params.id;

  db.serialize(() => {
    const q = db.prepare("SELECT * FROM user WHERE user_id = ?");
    q.all(userId, function (err, rows) {
      if (err) {
        return response.status(500).json(err);
      }

      if (rows.length > 0) {
        return response.status(200).json(rows);
      } else {
        return response.status(500).json({ message: "No users" });
      }
    });
    q.finalize();
  });
});

// Add an expense folder to the Expense Folder table
app.post("/api/v1/addExpenseFolder", (request, response) => {
  const values = [request.body.userId, request.body.folderName];

  db.serialize(() => {
    const q = db.prepare(
      "INSERT INTO expense_folder (user_id, name) VALUES (?, ?)"
    );
    q.run(values, function (err) {
      if (err) {
        return response.status(500).json(err);
      }

      db.get(
        "SELECT * FROM expense_folder WHERE user_id = ?",
        this.lastID,
        (err, data) => {
          if (err) {
            return response.status(500).json(err);
          } else {
            return response.status(200).json(data);
          }
        }
      );
    });
    q.finalize();
  });
});

// Get expense folder folder based on the user ID
app.get("/api/v1/expenseFolder/:id", (request, response) => {
  const userId = request.params.id;
  db.serialize(() => {
    const q = db.prepare("SELECT * FROM expense_folder WHERE user_id = ?");
    q.all(userId, function (err, rows) {
      if (err) {
        return response.status(200).json(err);
      }

      if (rows.length > 0) {
        return response.status(200).json(rows);
      } else {
        return response.status(500).json({ message: "No users" });
      }
    });
    q.finalize();
  });
});

// Get a specific expense folder based on the user ID and expense folder ID
app.get("/api/v1/expenseFolder/:id/:expId", (request, response) => {
  const values = [request.params.id, request.params.expId];

  db.serialize(() => {
    const q = db.prepare(
      "SELECT name FROM expense_folder WHERE user_id = ? AND expense_folder_id = ?"
    );
    q.all(values, function (err, rows) {
      if (err) {
        return response.status(500).json(err);
      }

      if (rows.length > 0) {
        return response.status(200).json(rows);
      } else {
        return response.status(500).json({ message: "No expense folder" });
      }
    });
    q.finalize();
  });
});

// Add a new expense to the Expense Table
app.post("/api/v1/expense", (request, response) => {
  const values = [
    request.body.user_Id,
    request.body.expenseFolder_Id,
    request.body.title,
    request.body.amount,
    request.body.category,
    request.body.desc,
    request.body.date,
  ];

  db.serialize(() => {
    const q = db.prepare(
      "INSERT INTO expense (user_id, expense_folder_id, title, amount, category, desc, date) VALUES (?, ?, ?, ?, ?, ?, ?)"
    );
    q.run(values, function (err) {
      if (err) {
        return response.status(500).json(err);
      }

      db.get(
        "SELECT * FROM expense WHERE expense_id =?",
        this.lastID,
        (err, data) => {
          if (err) {
            return response.status(500).json(err);
          } else {
            return response.status(200).json(data);
          }
        }
      );
    });
    q.finalize();
  });
});

// Get all expenses based off of the specific user ID and expense folder ID
app.get("/api/v1/expense/:id/:expId", (request, response) => {
  const values = [request.params.id, request.params.expId];

  db.serialize(() => {
    const q = db.prepare(
      "SELECT * FROM expense WHERE user_id = ? AND expense_folder_id = ?"
    );
    q.all(values, function (err, rows) {
      if (err) {
        return response.status(500).json(err);
      }

      if (rows.length > 0) {
        return response.status(200).json(rows);
      } else {
        return response.status(500).json({ message: "No expenses" });
      }
    });
  });
});

// Update an expense based off of the specific user ID and expense folder ID
app.post("/api/v1/expense/:expenseId", (request, response) => {
  const expense_Id = request.params.expenseId;
  const values = [
    request.body.title,
    request.body.amount,
    request.body.category,
    request.body.desc,
    request.body.date,
    expense_Id,
  ];

  db.serialize(() => {
    const q = db.prepare(
      "UPDATE expense SET title = ?, amount = ?, category = ?, desc = ?, date = ? WHERE expense_id = ?"
    );
    q.run(values, function (err) {
      if (err) {
        return response.status(500).json(err);
      }

      db.get(
        "SELECT * FROM expense WHERE expense_id = ?",
        expense_Id,
        (err, data) => {
          if (err) {
            return response.status(500).json(err);
          }
          return response.status(200).json(data);
        }
      );
    });
  });
});

// Delete an expense based off of the specific user ID and expense folder ID
app.delete("/api/v1/expense/:expenseId", (request, response) => {
  const expense_Id = request.params.expenseId;

  db.serialize(() => {
    const q = db.prepare("DELETE FROM expense WHERE expense_id = ?");
    q.run(expense_Id, function (err) {
      if (err) {
        return response.status(500).json(err);
      }

      db.get("SELECT * FROM expense", (err, data) => {
        if (err) {
          return response.status(500).json(err);
        } else {
          return response.status(200).json(data);
        }
      });
    });
    q.finalize();
  });
});

// Modify and update the name of an expense folder
app.post("/api/v1/expenseFolder/:expId", (request, response) => {
  // const expenseFolder_Id = request.params.expId;
  const values = [request.body.name, request.params.expId];

  db.serialize(() => {
    const q = db.prepare(
      "UPDATE expense_folder SET name = ? WHERE expense_folder_id = ?"
    );
    q.run(values, function (err) {
      if (err) {
        return response.status(500).json(err);
      }

      db.get(
        "SELECT * FROM expense_folder WHERE expense_folder_id = ?",
        request.params.expId,
        (err, data) => {
          if (err) {
            return response.status(500).json(err);
          } else {
            return response.status(200).json(data);
          }
        }
      );
    });
  });
});

// Delete an expense folder based off of the expense folder id
app.delete("/api/v1/expenseFolder/:expId", (request, response) => {
  const expenseFolder_Id = request.params.expId;

  db.serialize(() => {
    const q = db.prepare(
      "DELETE FROM expense_folder WHERE expense_folder_id = ?"
    );
    q.run(expenseFolder_Id, function (err) {
      if (err) {
        return response.status(500).json(err);
      }

      db.get("SELECT * FROM expense_folder", (err, data) => {
        if (err) {
          return response.status(500).json(err);
        } else {
          return response.status(200).json(data);
        }
      });
    });
  });
});

app.listen(process.env.PORT || 8800, () => {
  console.log("Backend Server is listening");
});

export default app;
