const fs = require('fs').promises;
const { saveOcrAccuracy } = require('./generateCSV.js');


async function calculateAccuracyOnWordLevel(ocrText, imageFilePath) {
  try {
    const refText = await fs.readFile(`./groundtruthDataset/${imageFilePath.substr(imageFilePath.lastIndexOf("Kassenbon"), imageFilePath.length - 1).replace('JPG', 'txt')}`, 'utf8');

    const ocrWords = (normalizeText(ocrText)).split(' ');
    const refWords = (normalizeText(refText)).split(' ');

    //Gesamtanzahl der Fehler im OCR-Text wird bestimmt
    const { deletions, substitutions } = countErrors(ocrWords, refWords);
    const errors = deletions + substitutions;

    saveOcrAccuracy(imageFilePath, refWords, errors);
  } catch (err) {
    console.error('Ein unbekannter Fehler ist aufgetreten:', err);
  }
}

//Alle Leerzeichen am Anfang und Ende + Mehrfachleerzeichen innerhalb des Strings werden gelöscht
//Alle Zeilenumbrüche am Anfang und Ende + Mehrfachzeilenumbrüche innerhalb des Strings werden gelöscht
function normalizeText(text) {
  text = text.trim().replace(/\s{1,}/g, ' ');
  text = text.replace(/^\n{1,}|\n{1,}$/g, ' ').replace(/\n{1,}/g, '\n');
  return text;
}

//Algorithmus zur Fehlermessung mit ChatGPT generiert
//Minimale Bearbeitungsdistanz (Levenshtein-Distanz) zwischen dem aktuellen OCR-Wort und dem aktuellen Wort aus dem Groundtruth wird bestimmt
function countErrors(ocrWords, refWords) {
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
  //Löschungen und Substitutionen im OCR-Text werden als Fehler gezählt
  //Anzahl der Löschungen, Einfügungen und Substitutionen werden jeweils bestimmt
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
  deletions += i;
  //Da nur Löschungen und Substitutionen im OCR-Text als Fehler gezählt werden, werden nur ihre Anzahl zurückgegeben
  return { deletions, substitutions };

}

module.exports = calculateAccuracyOnWordLevel;