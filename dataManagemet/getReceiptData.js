const { initializeDatabases } = require('../dbInitializer.js');

//Holt alle Kassezettel mit Datum, Uhrzeit und Gesamtsumme
async function getReceiptDataFromDb() {
  try {
    const { receiptDataDb } = await initializeDatabases();
    const receiptData = await receiptDataDb.all('SELECT * FROM receipts ORDER BY date DESC');
    return receiptData;
  } catch (error) {
    console.log(error);
  }
}

async function getReceiptProductsFromDb() {
  try {
    const { receiptDataDb } = await initializeDatabases();
    const receiptProducts = await receiptDataDb.all('SELECT * FROM products');
    return receiptProducts;
  } catch (error) {
    console.log(error);
  }
}


module.exports = { getReceiptDataFromDb, getReceiptProductsFromDb };