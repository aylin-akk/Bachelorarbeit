const sqlite3 = require('sqlite3');
const { open } = require('sqlite');


async function openDatabase(dbPath) {
  //Datenbankverbindung wird unter Verwendung des sqlite3.Database-Treibers aufgebaut
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });
  return db;
}
//Datenbankverbindungen werden beim Laden des Moduls initialisiert
async function initializeDatabases() {
  const productsDb = await openDatabase('./products.db');
  const receiptDataDb = await openDatabase('./receiptData.db');
  return { productsDb, receiptDataDb };

}


module.exports = { initializeDatabases };

