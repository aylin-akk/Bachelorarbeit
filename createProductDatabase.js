const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./products.db');
const { readdir, readFile} =  require('node:fs/promises');
const { resolve } = require('node:path');
const path = require("path");


const groundTruthPath = './GroundtruthDataset';
const productPattern = /^(.+)\s{1,}(\d{1,3},\d{2})$/gm;
let match;



function createProductDatabase() {

    try {
      db.serialize(async () => {
        db.run("CREATE TABLE IF NOT EXISTS products (name TEXT UNIQUE, frequency INTEGER DEFAULT 0)");
      const files = await readdir(groundTruthPath); 
        for (const file of files){
          const filePath = resolve(path.join(groundTruthPath, file));
          const data = await readFile(filePath, 'utf8');
            while ((match = productPattern.exec(data)) !== null) {
              let name = match[1].trim();
              db.run("INSERT OR IGNORE INTO products (name) VALUES (?)", [name]);
              db.run(`UPDATE products SET frequency = frequency + 1 WHERE name = ?`, [name]);
              }
            };
          db.close();
        });
        

        
      }catch (err) {
      console.log(err);
      db.close();
      }
      
    }
  

 
 



    //db.each("SELECT rowid AS id, info FROM lorem", (err, row) => {
    //    console.log(row.id + ": " + row.info);
    //});
 








module.exports = createProductDatabase;

