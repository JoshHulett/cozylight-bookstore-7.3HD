// Require the express web application framework (https://expressjs.com)
const express = require('express');
const morgan = require('morgan');
// Create a new web application by calling the express function
const app = express();
app.disable('x-powered-by');
const port = 3000;

// Connect to SQLite database
const sqlite3 = require('sqlite3').verbose();

// Connect to enquiry database
let enquirydb = new sqlite3.Database('enquiryDB.db', (err) => {
  if (err) {
    console.error("Error opening enquiry database", err.message);
  } else {
    console.log("Connected to the enquiry SQLite database")
  }
});

// Connect to books database
let bookdb = new sqlite3.Database('booksDB.db', (err) => {
  if (err) {
    console.error("Error opening books database", err.message);
  } else {
    console.log("Connected to the books SQLite database")
  }
});

// Read databases, test connection in logs
enquirydb.all("SELECT * FROM ENQUIRY", [], (err, rows) => {
  if (err) {
    console.error("Error fetching enquiry data", err.message);
  } else {
    console.log("Enquiry Data:", rows);
  }
});

bookdb.all("SELECT * FROM BOOKS", [], (err, rows) => {
  if (err) {
    console.error("Error fetching book data", err.message);
  } else {
    console.log("Book Data:", rows);
  }
});

// Tell our application to serve all the files under the `public_html` directory
app.use(express.static('public_html'))
const path = require('path');
const { isAsyncFunction } = require('util/types');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Helper function for booksdb retrieval
function getAllBooks(callback) {
  bookdb.all("SELECT * FROM BOOKS", [], (err, rows) => {
    if (err) {
      console.error("Error fetching books:", err.message);
      callback(err, null);
    } else {
      callback(null, rows);
    }
  });
}

// Get home page, pulling from booksdb
app.get('/', (req, res) => {
  getAllBooks((err, books) => {
    if (err) {
      res.status(500).send("Database error");
    } else {
      res.render('index', { books })
    }
  })
});

// Get books page, pulling from booksdb
app.get('/books', (req, res) => {
  getAllBooks((err, books) => {
    if (err) {
      res.status(500).send("Database error");
    } else {
      res.render('books', { books })
    }
  })
});

// Get bestseller page, pulling from booksdb
app.get('/bestseller', (req, res) => {
  getAllBooks((err, books) => {
    if (err) {
      res.status(500).send("Database error");
    } else {
      res.render('bestSeller', { books })
    }
  })
});

// Get review writing page, pulling from booksdb
app.get('/writereview', (req, res) => {
  getAllBooks((err, books) => {
    if (err) {
      res.status(500).send("Database error");
    } else {
      res.render('writeReview', { books })
    }
  })
});

// Get drafts page, pulling from booksdb
app.get('/reviewdrafts', (req, res) => {
  getAllBooks((err, books) => {
    if (err) {
      res.status(500).send("Database error");
    } else {
      res.render('reviewDrafts', { books })
    }
  })
});

// get product page, with a unique page for each id in the booksdb
app.get('/product/:id', (req, res) => {
  // get the unique id from the book clicked
  const bookID = req.params.id;

  // pull booksdb row that matches the id
  bookdb.get("SELECT * FROM BOOKS WHERE ID = ?", [bookID], (err, book) => {
    if (err) {
      console.error("Error fetching book:", err.message);
      res.status(500).send("Database error");
    } else if (!book) {
      res.status(404).send("Book not found");
    } else {
      res.render('product', { book });
    }
  });
});

// Post Enquiry Survey Results
app.post('/submitenquiry', (req, res, next) => {
  console.log("Survey submitted:", req.body);
  // array to store validation errors
  const errors = [];

  // list of all the input fields
  const {
    reason,
    firstname,
    surname,
    email,
    mobile,
    address,
    state,
    postcode,
    message
  } = req.body;

  // input validations. Checks and patterns for each field. Adds an error message to errors array if not validated
  if (!reason) {
    errors.push({ field: "Reason", message: "Must indicate a reason." });
  }
  if (!firstname || !/^[A-Za-z\s'-]{2,}$/.test(firstname)) {
    errors.push({ field: "Firstname", message: "Firstname must contain a name." });
  }
  if (!surname || !/^[A-Za-z\s'-]{2,}$/.test(surname)) {
    errors.push({ field: "Surname", message: "Surname must contain a name." });
  }
  if (!email) {
    errors.push({ field: "Email", message: "Must include a valid Email address." });
  }
  if (!mobile || !/^04\d{8}$/.test(mobile)) {
    errors.push({ field: "Mobile", message: "Mobile must contain a phone number of format '04********' (i.e. 0412345678)." });
  }
  if (!address) {
    errors.push({ field: "Address", message: "Must include a valid address." });
  }
  if (!state) {
    errors.push({ field: "State", message: "Must select a state." });
  }
  if (!postcode || !/^\d{4}$/.test(postcode)) {
    errors.push({ field: "Postcode", message: "Must include a valid postcode." });
  }
  if (!message) {
    errors.push({ field: "Message", message: "Please include a message." });
  }

  // render validaiton error page if there are validation errors
  if (errors.length > 0) {
    return res.render('validationError', { title: 'Database validation errors', errors: errors });
  };

  // insert enquiry inputs into enquirydb
  enquirydb.run(
    `INSERT INTO ENQUIRY (reason, fname, sname, email, mobile, address, state, postcode, message) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [reason, firstname, surname, email, mobile, address, state, postcode, message],
    function (err) {
      if (err) {
        console.error("Error inserting enquiry response.", err.message);
      } else {
        console.log("Successfully inserted enquiry response!")
        if (process.env.NODE_ENV !== 'test') {
          enquirydb.all("SELECT * FROM ENQUIRY", [], (err, rows) => {
            if (err) {
              console.error("Error fetching enquiry data", err.message);
            } else {
              console.log("Enquiry Data:", rows);
            }
        });
      }
        // render enquiryResults page, parse form inputs
        res.render('enquiryResults', {
          enquirySubmission: req.body
        });
      }
    }
  )
});

// post for the search results page, reached through making a search query
app.post('/search', (req, res, next) => {
  // retrieve search term
  const searchQuery = `%${req.body.search}%`;

  // select any rows from the booksdb where the search term is present in the title, author, or genre
  bookdb.all(
    'SELECT * FROM BOOKS WHERE title LIKE ? OR author LIKE ? OR genre LIKE ?',
    [searchQuery, searchQuery, searchQuery],
    (err, rows) => {
      if (err) {
        console.error(err.message);
        res.status(500).send('Database error');
      } else {
        console.log("Search Term:", searchQuery);
        // parse the results of the search
        res.render('searchResults', { results: rows, query: req.body.search });
      }
    }
  )
});

app.post("/recentlyviewed", (req, res) => {
  console.log("Sever received IDs:", req.body);
  const bookIds = req.body.ids;

  if (!Array.isArray(bookIds) || bookIds.length === 0) {
    return res.status(400).json({ error: "No book IDs in LocalStorage" })
  }

  // Generate placeholders (?, ?) for the SQLite query
  // Allows query to adapt to the number of ids in the localstorage
  const placeholders = bookIds.map(() => '?').join(', ');

  // Dynamically generate query
  const sqlQuery = `SELECT * FROM BOOKS WHERE id IN (${placeholders})`;

  bookdb.all(sqlQuery, bookIds, (err, rows) => {
    if (err) {
      console.error("Error fetching recently viewed books:", err.message);
      return res.status(500).json({ err: "Database error" });
    }

    // Sort rows so that most recently viewed in shown first
    const sortedRows = bookIds.map(id => rows.find(book => book.id == id)).filter(Boolean);

    res.json(sortedRows);
  });
});

app.post("/wishlist", (req, res) => {
  console.log("Sever received IDs:", req.body);
  const bookIds = req.body.ids;

  if (!Array.isArray(bookIds) || bookIds.length === 0) {
    return res.status(400).json({ error: "No book IDs in LocalStorage" })
  }

  // Generate placeholders (?, ?) for the SQLite query
  // Allows query to adapt to the number of ids in the localstorage
  const placeholders = bookIds.map(() => '?').join(', ');

  // Dynamically generate query
  const sqlQuery = `SELECT * FROM BOOKS WHERE id IN (${placeholders})`;

  bookdb.all(sqlQuery, bookIds, (err, rows) => {
    if (err) {
      console.error("Error fetching recently viewed books:", err.message);
      return res.status(500).json({ err: "Database error" });
    }

    // Sort rows so that most recently viewed in shown first
    const sortedRows = bookIds.map(id => rows.find(book => book.id == id)).filter(Boolean);

    res.json(sortedRows);
  });
});

app.post("/drafts", (req, res) => {
  console.log("Sever received IDs:", req.body);
  const bookIds = req.body.ids;

  if (!Array.isArray(bookIds) || bookIds.length === 0) {
    return res.status(400).json({ error: "No book IDs in LocalStorage" })
  }

  // Generate placeholders (?, ?) for the SQLite query
  // Allows query to adapt to the number of ids in the localstorage
  const placeholders = bookIds.map(() => '?').join(', ');

  // Dynamically generate query
  const sqlQuery = `SELECT * FROM BOOKS WHERE id IN (${placeholders})`;

  bookdb.all(sqlQuery, bookIds, (err, rows) => {
    if (err) {
      console.error("Error fetching recently viewed books:", err.message);
      return res.status(500).json({ err: "Database error" });
    }

    // Sort rows so that most recently viewed in shown first
    const sortedRows = bookIds.map(id => rows.find(book => book.id == id)).filter(Boolean);

    res.json(sortedRows);
  });
});

const portEB = process.env.PORT || 3000
// Tell our application to listen to requests at port 3000 on the localhost
if (process.env.NODE_ENV !== 'test') {
  app.listen(portEB, '0.0.0.0', () => {
    console.log(`Web server running at: http://localhost:${port}`)
    console.log(`Type Ctrl+C to shut down the web server`)
  });
}

module.exports = app;
