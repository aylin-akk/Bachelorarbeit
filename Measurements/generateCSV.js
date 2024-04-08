const createCsvWriter = require('csv-writer').createObjectCsvWriter;
let measurements = [];
let i = 1;
let tempMaxOccuracy = 0;
let totalCorrectExtractedWords = 0;
let totalWords = 0;
let csvWriter;

//Tabellenspaltennamen für die Messungen werden hier festgelegt
function generateCsvWriter() {
  csvWriter = createCsvWriter({
    path: `C:/Users/Aylin/OneDrive/Desktop/Messungen/Messung${i++}.csv`,
    header: [
      { id: 'id', title: 'receipt id' },
      { id: 'totalWords', title: 'total words' },
      { id: 'correctWords', title: 'correct extracted words' },
      { id: 'ocrAccuracy', title: 'ocr accuracy' }
    ]
  });
}

//OCR-Genauigkeit für jede Bilddatei wird berechnet und gespeichert
function saveOcrAccuracy(imageFilePath, refWords, errors) {
  const splitedImgPath = imageFilePath.split("\\");
  const receiptId = splitedImgPath[splitedImgPath.length - 2] + "_" + splitedImgPath[splitedImgPath.length - 1].substr(0, splitedImgPath[splitedImgPath.length - 1].indexOf("."));

  totalWords += refWords.length;
  totalCorrectExtractedWords += (refWords.length - errors);

  measurements.push({ id: receiptId, totalWords: refWords.length, correctWords: refWords.length - errors, ocrAccuracy: (((refWords.length - errors) / refWords.length) * 100).toFixed(1) + '%' });
}

//Durchschnittliche OCR-Genauigkeit pro Kategorie berechnen und speichern
function saveOcrAverage() {
  let folderAverage = ((totalCorrectExtractedWords / totalWords) * 100).toFixed(1);
  measurements.push({ id: 'Average accuracy', totalWords: totalWords, correctWords: totalCorrectExtractedWords, ocrAccuracy: folderAverage + '%' }, { id: ' ', totalWords: ' ', correctWords: ' ', ocrAccuracy: ' ' });
  totalCorrectExtractedWords = 0;
  totalWords = 0;

  if (tempMaxOccuracy < folderAverage) {
    tempMaxOccuracy = folderAverage;
  }

}

//CSV-Datei wird erstellt und mit den Ergebnissen von den Messungen gefüllt
let parameter = '';
function generateCsv(paramCombination) {
  for (const key in paramCombination) {
    parameter += `${key}: ${paramCombination[key]}, `
  }
  measurements.push({ id: 'parameter combination', totalWords: parameter });
  if (tempMaxOccuracy > 70) {
    csvWriter.writeRecords(measurements)
      .then(() => {
        console.log('...Done');
      });
    measurements = [];
    parameter = '';
    tempMaxOccuracy = 0;
  } else {
    measurements = [];
    parameter = '';
    tempMaxOccuracy = 0;
  }
}


module.exports = { saveOcrAccuracy, generateCsv, saveOcrAverage, generateCsvWriter };