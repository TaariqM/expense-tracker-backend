import express from "express";
import mysql from "mysql";
import cors from "cors";
import dotenv from "dotenv";
import sqlite3 from "sqlite3";

dotenv.config();

const app = express();

const db = new sqlite3.Database("./db/expenseTrackerDB.db");

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
        return response.status(500).json(err);
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

  // const q =
  //   "INSERT INTO user (`email`, `password`, `first_name`, `last_name`) VALUES (?)";
  // const values = [
  //   request.body.email,
  //   request.body.password,
  //   request.body.firstname,
  //   request.body.lastname,
  // ];

  // db.query(q, [values], (err, data) => {
  //   if (err) {
  //     return response.status(500).json(err);
  //   } else {
  //     return response.status(200).json("User has been registered successfully");
  //   }
  // });
});

// Passes user login information, to login an existing user account
app.post("/api/v1/login", (request, response) => {
  const q = "SELECT * FROM user WHERE `email` = ? AND `password` = ?";

  db.query(q, [request.body.email, request.body.password], (err, data) => {
    if (err) {
      return response.status(500).json(err);
    } else {
      return response.status(200).json(data);
    }
  });
});

// Update the password for an existing user
app.post("/api/v1/forgot_password", (request, response) => {
  const q = "UPDATE user SET `password` = ? WHERE `email` = ?";

  db.query(q, [request.body.password, request.body.email], (err, data) => {
    if (err) {
      return response.status(500).json(err);
    } else {
      return response.status(200).json(data);
    }
  });
});

// Get a specific user based on the user ID
app.get("/api/v1/user/:id", (request, response) => {
  const userId = request.params.id;
  const q = "SELECT * FROM user WHERE `user_id` = ?";

  db.query(q, [userId], (err, data) => {
    if (err) {
      return response.status(500).json(err);
    } else {
      return response.status(200).json(data);
    }
  });
});

// Add an expense folder to the Expense Folder table
app.post("/api/v1/addExpenseFolder", (request, response) => {
  const q = "INSERT INTO expense_folder (`user_id`, `name`) VALUES (?)";
  const values = [request.body.userId, request.body.folderName];

  db.query(q, [values], (err, data) => {
    if (err) {
      return response.status(500).json(err);
    } else {
      return response.status(200).json(data);
    }
  });
});

// Get expense folder folder based on the user ID
app.get("/api/v1/expenseFolder/:id", (request, response) => {
  const userId = request.params.id;
  const q = "SELECT * FROM expense_folder WHERE `user_id` = ?";

  db.query(q, [userId], (err, data) => {
    if (err) {
      return response.status(500).json(err);
    } else {
      return response.status(200).json(data);
    }
  });
});

// Get a specific expense folder based on the user ID and expense folder ID
app.get("/api/v1/expenseFolder/:id/:expId", (request, response) => {
  const userId = request.params.id;
  const expId = request.params.expId;
  const q =
    "SELECT `name` FROM expense_folder WHERE `user_id` = ? AND `expense_folder_id` = ?";

  db.query(q, [userId, expId], (err, data) => {
    if (err) {
      return response.status(500).json(err);
    } else {
      return response.status(200).json(data);
    }
  });
});

// Add a new expense to the Expense Table
app.post("/api/v1/expense", (request, response) => {
  const q =
    "INSERT INTO expense (`user_id`, `expense_folder_id`, `title`, `amount`, `category`, `desc`, `date`) VALUES (?)";
  const values = [
    request.body.user_Id,
    request.body.expenseFolder_Id,
    request.body.title,
    request.body.amount,
    request.body.category,
    request.body.desc,
    request.body.date,
  ];

  db.query(q, [values], (err, data) => {
    if (err) {
      return response.status(500).json(err);
    } else {
      return response.status(200).json(data);
    }
  });
});

// Get all expenses based off of the specific user ID and expense folder ID
app.get("/api/v1/expense/:id/:expId", (request, response) => {
  const q =
    "SELECT * FROM expense WHERE `user_id` = ? AND `expense_folder_id` = ?";
  const userId = request.params.id;
  const expId = request.params.expId;

  db.query(q, [userId, expId], (err, data) => {
    if (err) {
      return response.status(500).json(err);
    } else {
      return response.status(200).json(data);
    }
  });
});

// Update an expense based off of the specific user ID and expense folder ID
app.post("/api/v1/expense/:expenseId", (request, response) => {
  const q =
    "UPDATE expense SET `title` = ?, `amount` = ?, `category` = ?, `desc` = ?, `date` = ? WHERE expense_id = ?";

  const expense_Id = request.params.expenseId;

  db.query(
    q,
    [
      request.body.title,
      request.body.amount,
      request.body.category,
      request.body.desc,
      request.body.date,
      expense_Id,
    ],
    (err, data) => {
      if (err) {
        return response.status(500).json(err);
      } else {
        return response.status(200).json(data);
      }
    }
  );
});

// Delete an expense based off of the specific user ID and expense folder ID
app.delete("/api/v1/expense/:expenseId", (request, response) => {
  const q = "DELETE FROM expense WHERE `expense_id` = ?";
  const expense_Id = request.params.expenseId;

  db.query(q, [expense_Id], (err, data) => {
    if (err) {
      return response.status(500).json(err);
    } else {
      return response.status(200).json(data);
    }
  });
});

// Modify and update the name of an expense folder
app.post("/api/v1/expenseFolder/:expId", (request, response) => {
  const q =
    "UPDATE expense_folder SET `name` = ? WHERE `expense_folder_id` = ?";
  const expenseFolder_Id = request.params.expId;

  db.query(q, [request.body.name, expenseFolder_Id], (err, data) => {
    if (err) {
      return response.status(500).json(err);
    } else {
      return response.status(200).json(data);
    }
  });
});

// Delete an expense folder based off of the expense folder id
app.delete("/api/v1/expenseFolder/:expId", (request, response) => {
  const q = "DELETE FROM expense_folder WHERE `expense_folder_id` = ?";
  const expenseFolder_Id = request.params.expId;

  db.query(q, [expenseFolder_Id], (err, data) => {
    if (err) {
      return response.status(500).json(err);
    } else {
      return response.status(200).json(data);
    }
  });
});

app.listen(process.env.PORT || 8800, () => {
  console.log("Backend Server is listening");
});

// module.exports = app;
export default app;
