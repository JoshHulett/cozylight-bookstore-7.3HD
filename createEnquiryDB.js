let sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('enquiryDB.db');

db.serialize(function () {

  //Drop table if it exists (reset table if needed)
  db.run("DROP TABLE IF EXISTS ENQUIRY");

  // Create enquiry table with needed fields
  db.run("CREATE TABLE IF NOT EXISTS ENQUIRY (reason TEXT, fname TEXT, sname TEXT, email TEXT, mobile TEXT, address TEXT, state TEXT, postcode TEXT, message TEXT)");

});
db.close(); 