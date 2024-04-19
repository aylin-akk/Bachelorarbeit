const { initializeDatabases } = require('../dbInitializer.js');

//Löscht den Kassenbon mit der entsprechenden ID aus der Datenbank
async function deleteReceiptFromDatabase(receiptID) {
  try {
    const { receiptDataDb } = await initializeDatabases();
    await receiptDataDb.run(`DELETE FROM receipts WHERE receiptID = ?`, [receiptID]);
    await receiptDataDb.run(`DELETE FROM products WHERE receiptID = ?`, [receiptID]);
    await receiptDataDb.close();
  } catch (error) {
    await receiptDataDb.close();
    console.log(error);
  }
}

module.exports = deleteReceiptFromDatabase;