const { initializeDatabases } = require('../dbInitializer.js');

//Holt alle Kassezettel mit Datum, Uhrzeit und Gesamtsumme aus der Datenbank
async function getReceiptDataFromDb() {
  try {
    const { receiptDataDb } = await initializeDatabases();
    const receiptData = await receiptDataDb.all('SELECT * FROM receipts ORDER BY date DESC');
    await receiptDataDb.close();
    return receiptData;
  } catch (error) {
    await receiptDataDb.close();
    console.log(error);
  }
}


async function getReceiptProductsFromDb() {
  try {
    const { receiptDataDb } = await initializeDatabases();
    const receiptProducts = await receiptDataDb.all('SELECT * FROM products');
    await receiptDataDb.close();
    return receiptProducts;
  } catch (error) {
    await receiptDataDb.close();
    console.log(error);
  }
}

async function getJoinedDataFromDb() {
  try {
    const { receiptDataDb } = await initializeDatabases();
    const joinedTableData = await receiptDataDb.all('SELECT receipts.receiptID, receipts.date, products.receiptID, products.name, products.price FROM receipts JOIN products ON receipts.receiptID = products.receiptID;'
    );
    await receiptDataDb.close();
    return joinedTableData;
  } catch (error) {
    await receiptDataDb.close();
    console.log(error);
  }
}


module.exports = { getReceiptDataFromDb, getReceiptProductsFromDb, getJoinedDataFromDb };