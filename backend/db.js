import mysql from "mysql";

export const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "eventsDB",
});

con.connect((err) => {
  if (err) throw err;
  console.log("Połączono z MySQL");

  const addColumnSQL = `
    ALTER TABLE events ADD COLUMN IF NOT EXISTS created_by VARCHAR(255) DEFAULT 'Anonymous'
  `;
  con.query(addColumnSQL, (err) => {
    if (err && err.code !== "ER_DUP_FIELDNAME") {
      console.error("Błąd dodawania kolumny created_by:", err);
    } else if (!err) {
      console.log("Kolumna created_by sprawdzana/dodana.");
    }
  });

  const addUsernameSQL = `
    ALTER TABLE favorites ADD COLUMN IF NOT EXISTS username VARCHAR(255)
  `;
  con.query(addUsernameSQL, (err) => {
    if (err && err.code !== "ER_DUP_FIELDNAME") {
      console.error("Błąd dodawania kolumny username:", err);
    } else if (!err) {
      console.log("Kolumna username w favorites sprawdzana/dodana.");
    }
  });

  const dropOldUniqueSQL = `
    ALTER TABLE favorites DROP INDEX event_id
  `;
  con.query(dropOldUniqueSQL, (err) => {
    if (err && err.code !== "ER_CANT_DROP_FIELD_OR_KEY") {
      console.error("Nie można usunąć starego INDEX:", err);
    } else if (!err) {
      console.log("Stary INDEX usunięty.");
    }
  });

  const addNewUniqueSQL = `
    ALTER TABLE favorites ADD UNIQUE KEY IF NOT EXISTS unique_favorite (event_id, username)
  `;
  con.query(addNewUniqueSQL, (err) => {
    if (err && err.code !== "ER_DUP_KEYNAME") {
      console.error("Błąd dodawania nowego UNIQUE:", err);
    } else if (!err) {
      console.log("Nowy UNIQUE (event_id, username) dodany.");
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
    if (err) console.error("Błąd tabeli favorites:", err);
    else console.log("Tabela favorites gotowa.");
  });
});
