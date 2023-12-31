const sqlite3 = require("sqlite3");
const path = require("node:path");

const db = new sqlite3.Database(
  path.resolve(__dirname, "/db/expenseTrackerDB.db")
);

db.serialize(() => {
  // Create user table
  db.run(
    `CREATE TABLE IF NOT EXISTS user (
            user_id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL,
            password TEXT NOT NULL,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            UNIQUE(email)
        )`
  );

  // Create expense_folder table
  db.run(
    `CREATE TABLE IF NOT EXISTS expense_folder (
            expense_folder_id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES user(user_id)
        )`
  );

  // Create expense table
  db.run(
    `CREATE TABLE IF NOT EXISTS expense (
            expense_id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            expense_folder_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            amount DECIMAL NOT NULL,
            category TEXT DEFAULT NULL,
            desc TEXT DEFAULT NULL,
            date DATE NOT NULL,
            FOREIGN KEY (user_id) REFERENCES user(user_id),
            FOREIGN KEY (expense_folder_id) REFERENCES expense_folder(expense_folder_id)
        )`
  );
});

db.close();
