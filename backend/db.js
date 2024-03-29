import sqlite3 from 'sqlite3';
const dbFilePath = 'sqlDb/f1.db';

const db = new sqlite3.Database(dbFilePath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error(err.message);
  }

  console.log('Connected to the database.'); 
  //Creates table if it doesn't exist
  db.run(`CREATE TABLE IF NOT EXISTS f1_posts_summary (
    date_column DATE PRIMARY KEY,
    text_column TEXT
  )`, (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Table created or already exists.');
    }
  });
});


export default db;
