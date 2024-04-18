const { initializeDatabases } = require('../dbInitializer.js');

//Funktion wird jedes mal aufgerufen, nachdem der User einen Kassenbon hochgeladen und diesen gespeichert hat
async function saveReceiptData(receiptData) {
  const { productsDb, receiptDataDb } = await initializeDatabases();
  try {
    //Datenbanktabellen für Kassenbondaten erstellen, um sie für weitere Analysen benutzen zu können
    await receiptDataDb.exec(`CREATE TABLE IF NOT EXISTS receipts (
        receiptID INTEGER PRIMARY KEY AUTOINCREMENT,
        address TEXT,
        date DATE NOT NULL,
        time TEXT,
        sum REAL NOT NULL,
        UNIQUE(date, time))`);

    await receiptDataDb.exec(`CREATE TABLE IF NOT EXISTS products (
        receiptID INTEGER NOT NULL,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        FOREIGN KEY (receiptID) REFERENCES receipts (receiptID))`);

    //Kassenbondaten(Adresse, Uhrzeit, Gesamtsumme und Datum) werden in die Datenbank gespeichert 
    //KassenbonID wird automatisch inkrementiert   
    let receipt = await receiptDataDb.run(`INSERT INTO receipts (address,date,time,sum) VALUES (?,?,?,?)`, [receiptData.location, receiptData.date, receiptData.time, parseFloat(receiptData.receiptSum).toFixed(2)]);

    //Ein Array mit den Schlüsseln von den Produkten und Preisen wird erstellt 
    //[product1, price1, product2, price2,...]
    let productPrice = Object.keys(receiptData).filter(key => key.startsWith('product') || key.startsWith('price'));
    let productPriceObj = {};

    //Ein Objekt mit den gekauften Produkten und entsprechenden Preisen wird erstellt
    //{product1: 'Milch', price1: '0.99', ..}
    productPrice.forEach(key => {
      productPriceObj[key] = receiptData[key];
    });

    //Zum Abfangen des Fehlers, welcher durch das Löschen von Produkt-Preis-Zeilen entsteht. (key von Object productPriceObj nicht immer um 1 inkrementiert [`product${i}`])
    let limit = parseInt(Object.keys(productPriceObj)[Object.keys(productPriceObj).length-1].replace("price",""));


    //Jeder gekaufte Artikel wird zusammen mit dem Preis und der letzten KassenbonID in die Datenbank gespeichert 
    for (let i = 1; i <= limit; i++) {
      if (productPriceObj[`product${i}`] != undefined) {
        await receiptDataDb.run(`INSERT INTO products (receiptID,name,price) VALUES (?,?,?)`, [receipt.lastID, productPriceObj[`product${i}`], productPriceObj[`price${i}`]]);
        //Hier wird nach dem Speichern des Kassenbons geprüft, ob der aktuelle Produktname in der Produktdatenbank ist, um diese zu aktualisieren, das die Produktdatenbank auch als Wörterbuch fungiert 
        let result = await productsDb.run(`INSERT OR IGNORE INTO products (name, frequency) VALUES (?,1)`, productPriceObj[`product${i}`]);
        //überprüft, ob durch die letzte SQL-Anweisung oben eine Zeile durch Einfügen geändert wurde
        //Wenn nicht wird die Häufigkeit des entsprechenden Produktes nur um 1 erhöht
        if (result.changes == 0) {
          await productsDb.run(`UPDATE products SET frequency = frequency + 1 WHERE name = ?`, productPriceObj[`product${i}`]);
        }
      }
    }
    //Datenbankverbindungen schließen
    await receiptDataDb.close();
    await productsDb.close();
  } catch (error) {
    await receiptDataDb.close();
    await productsDb.close();
    console.log(error);
  }
}


module.exports = saveReceiptData;