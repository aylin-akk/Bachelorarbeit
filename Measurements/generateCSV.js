const createCsvWriter = require('csv-writer').createObjectCsvWriter;
let messungen = [];
let totalCorrectExtractedWords = 0;
let totalWords = 0;

//Tabellenspaltennamen für die Messungen werden hier festgelegt
const csvWriter = createCsvWriter({
  path: 'C:/Users/Aylin/OneDrive/Desktop/Messungen.csv',
  header: [
    { id: 'id', title: 'receipt id' },
    { id: 'totalWords', title: 'total words' },
    { id: 'correctWords', title: 'correct extracted words' },
    { id: 'ocrAccuracy', title: 'ocr accuracy' }
  ]
});

//
function saveOcrAccuracy(imageFilePath, refWords, errors) {
  const y = imageFilePath.split("\\");
  const receiptId = y[y.length - 2] + "_" + y[y.length - 1].substr(0, y[y.length - 1].indexOf("."));

  totalWords += refWords.length;
  totalCorrectExtractedWords += (refWords.length - errors);

  console.log(totalWords, totalCorrectExtractedWords);
 

  messungen.push({ id: receiptId, totalWords: refWords.length, correctWords: refWords.length - errors, ocrAccuracy: (((refWords.length - errors) / refWords.length) * 100).toFixed(1) + '%' });
  console.log(messungen);

}

//CSV-Datei wird erstellt und mit den Ergebnissen von den Messungen gefüllt
function generateCsv() {
  console.log(messungen);
  messungen.push({ id: ' ', totalWords: ' ', correctWords: ' ', ocrAccuracy: ' '},{ id: 'Average accuracy', totalWords: totalWords , correctWords: totalCorrectExtractedWords, ocrAccuracy: ((totalCorrectExtractedWords / totalWords) * 100).toFixed(1) + '%' });
  console.log(messungen);
  csvWriter.writeRecords(messungen)
    .then(() => {
      console.log('...Done');
    });
  //Messungen-Array wird für die nächsten Messungen entleert
  messungen = [];
}


module.exports = { saveOcrAccuracy, generateCsv };