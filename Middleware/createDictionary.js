const fs = require('fs');
const path = require("path");


const groundTruthPath = './GroundtruthDataset';
const dictionaryPath = './Dictionary/customDictionary.json';
let dictionary = {};


function createCustomDictionary() {
  try {
    fs.readdir(groundTruthPath, (err, files) => {
      if (err) throw err;
      files.forEach(file => {
        const filePath = path.join(groundTruthPath, file);
        updateCustomDictionary(filePath);
      });
    });
  }
  catch (err) {
    console.log(err);
  }
};


async function updateCustomDictionary(filePath) {
  try {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) throw err;
      const words = data.split(/\s{1,}/);

      const wordWithoutNumbers = /^\D+$/;
      words.forEach(word => {
        if (wordWithoutNumbers.test(word)) {
          dictionary[word] = dictionary[word] ? dictionary[word] + 1 : 1;
        }
      });
      fs.writeFile(dictionaryPath, JSON.stringify(dictionary), (err) => {
        if (err) throw err;
      }
      )
    });
  } catch (err) {
    console.log(err);
  }
}


module.exports = createCustomDictionary;
