let sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('booksDB.db');

db.serialize(function () {
  // Drop table
  db.run("DROP TABLE IF EXISTS BOOKS");

  // Create BOOKS table
  db.run(`CREATE TABLE IF NOT EXISTS BOOKS (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    author TEXT,
    genre TEXT,
    price REAL,
    hardcover_price REAL,
    release_date TEXT, 
    description TEXT,
    card_image TEXT,
    product_image TEXT
    )`);

    // Populate books array with book information
  const books = [
    ['Intermezzo', 'Sally Rooney', 'Contemporary', 18.99, 23.99, '2024-09-24', 'Intermezzo follows two brothers, Ivan and Peter, in the year following the death of their father. Ivan is a 22-year-old socially awkward competitive chess player, while Peter is in his 30s and a successful human rights lawyer in Dublin. On the outside, they could not be more different, and indeed they do not get along.', 'BookIntermezzo1.png', 'BookIntermezzo2.png'],
    ['Babel', 'R.F. Kuang', 'Fantasy', 19.99, 25.99, '2022-08-23', 'From award-winning author R. F. Kuang comes Babel, a historical fantasy epic that grapples with student revolutions, colonial resistance, and the use of language and translation as the dominating tool of the British Empire', 'BookBabel1.png', 'BookBabel2.png'],
    ['The King In Yellow', 'R.W. Chambers', 'Horror', 16.99, 21.99, '1895-01-01', 'For readers who delight in the darker corners of the human experience, The King in Yellow by Robert W. Chambers is a masterful collection of short stories that will transport you to a realm of eerie mystery, madness, and supernatural horror, where the boundaries between reality and the unknown are blurred.', 'BookKingInYellow1.png', 'BookKingInYellow2.png'],
    ['House of Leaves', 'Mark Z. Danielewski', 'Horror', 21.89, 27.99, '2000-07-07', 'A young family moves into a small home on Ash Tree Lane where they discover something is terribly wrong: their house is bigger on the inside than it is on the outside.', 'BookHouseofLeaves1.png', 'BookHouseofLeaves2.png'],
    ['Normal People', 'Sally Rooney', 'Contempoary', 18.99, 23.99, '2018-08-28', 'At school Connell and Marianne pretend not to know each other. Hes popular and well-adjusted, star of the school soccer team while she is lonely, proud, and intensely private. But when Connell comes to pick his mother up from her housekeeping job at Mariannes house, a strange and indelible connection grows between the two teenagers - one they are determined to conceal.', 'BookNormalPeople1.png', 'BookNormalPeople2.png'],
    ['The Hunger Games', 'Suzanne Collins', 'Dystopia', 17.99, 23.89, '2008-09-14', 'In the ruins of a place once known as North America lies the nation of Panem, a shining Capitol surrounded by twelve outlying districts. The Capitol is harsh and cruel and keeps the districts in line by forcing them all to send one boy and one girl between the ages of twelve and eighteen to participate in the annual Hunger Games, a fight to the death on live TV.', 'BookHungerGames1.png', 'BookHungerGames2.png']
  ]

  // Populate database with books from books array
  for (const book of books) {
    db.run(`INSERT INTO BOOKS
        (title, author, genre, price, hardcover_price, release_date, description, card_image, product_image) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      book,
      function (err) {
        if (err) {
          console.error('Insert failed:', err.message);
        } else {
          console.log(`Inserted book with ID ${this.lastID}`);
        }
      });
  }
});
db.close(); 