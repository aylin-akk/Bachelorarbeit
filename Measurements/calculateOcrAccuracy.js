
const fs = require('fs').promises;
const {saveOcrAccuracy} = require('./generateCSV.js');


async function calculateAccuracyOnWordLevel(ocrText, imageFilePath) {
  try{
    const refText = await fs.readFile(`./GroundtruthDataset/${imageFilePath.substr(imageFilePath.lastIndexOf("Kassenbon"), imageFilePath.length - 1).replace('JPG', 'txt')}`, 'utf8');
    
      const ocrWords = (normalizeText(ocrText)).split(' ');
      const refWords = (normalizeText(refText)).split(' ');
  
      
      const {deletions, substitutions } = countErrors(ocrWords, refWords);

      const errors = deletions + substitutions;
      //const ocrAccuracy = (((totalWords - errors )/ totalWords) * 100).toFixed(2);
      
      saveOcrAccuracy(imageFilePath, refWords, errors);
      //console.log(`Der Genauigkeitsprozentsatz beträgt ${ocrAccuracy}`);
    } catch (err) {
      console.error('Ein unbekannter Fehler ist aufgetreten:', err);
    }
  }

  function normalizeText(text) {
  //Alle Leerzeichen am Anfang und Ende + Mehrfachleerzeichen innerhalb des Strings löschen
  text = text.trim().replace(/\s{1,}/g, ' ');
  //Alle Zeilenumbrüche am Anfang und Ende + Mehrfachzeilenumbrüche innerhalb des Strings löschen
  text = text.replace(/^\n{1,}|\n{1,}$/g, '').replace(/\n{1,}/g, '\n');
  return text;
}


function countErrors(ocrWords, refWords) {
  // Algorithmus mit ChatGPT generiert und angepasst
  //Löschungen und Substitutionen werden als Fehler gezählt
  const d = [];
  for (let i = 0; i <= refWords.length; i++) {
    d[i] = [i];
  }
  for (let j = 1; j <= ocrWords.length; j++) {
    d[0][j] = j;
  }
  for (let i = 1; i <= refWords.length; i++) {
    for (let j = 1; j <= ocrWords.length; j++) {
      const cost = refWords[i - 1] === ocrWords[j - 1] ? 0 : 1;
      d[i][j] = Math.min(
        d[i - 1][j] + 1, // Löschung
        d[i][j - 1] + 1, // Einfügung
        d[i - 1][j - 1] + cost // Substitution
      );
    }
  }

  let i = refWords.length;
  let j = ocrWords.length;
  let insertions = 0;
  let deletions = 0;
  let substitutions = 0;

  while (i > 0 && j > 0) {
      if (d[i][j] == d[i - 1][j - 1] + (refWords[i - 1] !== ocrWords[j - 1] ? 1 : 0)) {
          if (refWords[i - 1] !== ocrWords[j - 1]) {
              substitutions++;
          }
          i--;
          j--;
      } else if (d[i][j] == d[i - 1][j] + 1) {
          deletions++;
          i--;
      } else {
          insertions++;
          j--;
      }
  }

  // Falls am Anfang oder Ende noch Unterschiede bestehen

  deletions += i;

  return {deletions, substitutions };

}

  





module.exports = calculateAccuracyOnWordLevel;