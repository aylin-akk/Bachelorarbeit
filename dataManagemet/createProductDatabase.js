const fs = require('fs').promises;
const path = require("path");
const {initializeDatabases } = require('../dbInitializer.js');


const groundTruthPath = './groundtruthDataset';
const productPattern = /^(.+)\s+(-?\d{1,3},\d{2})\s*$/gm;

//Produktdatenbank wird durch die Verwendung eines Ground-Truth-Datensatzes und mithilfe einer erfassten Gruppe für 
//Produktbezeichnungen erstellt, um diese beim Postprocessing für die Korrektur der Artikelnamen zu benutzen
async function createProductDatabase() {
  try {
    const {productsDb} = await initializeDatabases();
    await productsDb.exec('CREATE TABLE IF NOT EXISTS products (name TEXT UNIQUE, frequency INTEGER)');
    const files = await fs.readdir(groundTruthPath);
    for (const file of files) {
      const filePath = path.join(groundTruthPath, file);
      const data = await fs.readFile(filePath, 'utf8');
      let match;

      while ((match = productPattern.exec(data)) !== null) {
        let name = match[1].trim();
        if (name != 'Summe') {
          await productsDb.run('INSERT OR IGNORE INTO products (name, frequency) VALUES (?, 0)', name);
          //await productsDb.run('UPDATE products SET frequency = frequency + 1 WHERE name = ?', name);
        }
      }
    }
  }
  catch (error) {
    console.log(error);
  }
}


module.exports = createProductDatabase;

