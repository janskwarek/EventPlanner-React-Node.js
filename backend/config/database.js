import mysql from "mysql";

export const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "eventsDB",
});

con.connect((err) => {
  if (err) throw err;

  // Ensure all required columns exist in events table
  const addTitleSQL = `
    ALTER TABLE events ADD COLUMN IF NOT EXISTS title VARCHAR(255) NOT NULL
  `;
  con.query(addTitleSQL, (err) => {
    if (err && err.code !== "ER_DUP_FIELDNAME") {
      console.error("Database setup error (title):", err);
    }
  });

  const addDateSQL = `
    ALTER TABLE events ADD COLUMN IF NOT EXISTS date VARCHAR(255)
  `;
  con.query(addDateSQL, (err) => {
    if (err && err.code !== "ER_DUP_FIELDNAME") {
      console.error("Database setup error (date):", err);
    }
  });

  const addUrlSQL = `
    ALTER TABLE events MODIFY COLUMN url LONGTEXT
  `;
  con.query(addUrlSQL, (err) => {
    if (err && err.code !== "ER_DUP_FIELDNAME") {
      console.error("Database setup error (url):", err);
    }
  });

  const addPriceSQL = `
    ALTER TABLE events ADD COLUMN IF NOT EXISTS price DECIMAL(10, 2) DEFAULT 0
  `;
  con.query(addPriceSQL, (err) => {
    if (err && err.code !== "ER_DUP_FIELDNAME") {
      console.error("Database setup error (price):", err);
    }
  });

  const addDescriptionSQL = `
    ALTER TABLE events ADD COLUMN IF NOT EXISTS description TEXT
  `;
  con.query(addDescriptionSQL, (err) => {
    if (err && err.code !== "ER_DUP_FIELDNAME") {
      console.error("Database setup error (description):", err);
    }
  });

  const addColumnSQL = `
    ALTER TABLE events ADD COLUMN IF NOT EXISTS created_by VARCHAR(255) DEFAULT 'Anonymous'
  `;
  con.query(addColumnSQL, (err) => {
    if (err && err.code !== "ER_DUP_FIELDNAME") {
      console.error("Database setup error:", err);
    }
  });

  const addUsernameSQL = `
    ALTER TABLE favorites ADD COLUMN IF NOT EXISTS username VARCHAR(255)
  `;
  con.query(addUsernameSQL, (err) => {
    if (err && err.code !== "ER_DUP_FIELDNAME") {
      console.error("Database setup error:", err);
    }
  });

  const dropOldUniqueSQL = `
    ALTER TABLE favorites DROP INDEX event_id
  `;
  con.query(dropOldUniqueSQL, (err) => {
    if (err && err.code !== "ER_CANT_DROP_FIELD_OR_KEY") {
      console.error("Database setup error:", err);
    }
  });

  const addNewUniqueSQL = `
    ALTER TABLE favorites ADD UNIQUE KEY IF NOT EXISTS unique_favorite (event_id, username)
  `;
  con.query(addNewUniqueSQL, (err) => {
    if (err && err.code !== "ER_DUP_KEYNAME") {
      console.error("Database setup error:", err);
    }
  });

  const sql = `
    CREATE TABLE IF NOT EXISTS favorites (
      id INT AUTO_INCREMENT PRIMARY KEY,
      event_id INT NOT NULL,
      username VARCHAR(255),
      UNIQUE KEY unique_favorite (event_id, username),
      CONSTRAINT fk_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
    );
  `;
  con.query(sql, (err) => {
    if (err) console.error("Database setup error:", err);
  });
});
