const fs = require('fs').promises;
const path = require("path");
const recognizeText = require('./recognizeText.js');
const params = require('./tessConfig.js');
const calculateAccuracyOnWordLevel = require('./measurements/calculateOcrAccuracy.js');
const { generateCsv, saveOcrAverage, generateCsvWriter } = require('./measurements/generateCSV.js');
const preprocessImage = require('./preprocessing/imagePreprocessing.js');


//Funktion mit ChatGPT generiert und angepasst
//Funktion generiert alle möglichen Parameterkombinationen von Tesseract,
//um diese später auszuwerten
async function generateParamCombinations(parameters, index, current) {
  if (index === parameters.length) {
    paramCombinations.push({ ...current });
    return;
  }
  const paramName = parameters[index];
  const paramValues = params[paramName];

  for (const value of paramValues) {
    current[paramName] = value;
    await generateParamCombinations(parameters, index + 1, current);
  }
}


//Funktion, welche zur Auswertung des Datensatzes aufgerufen wurde
//Ruft in einer Schleife für jedes Bild im Datensatz die Texterkennung mit der aktuellen Tesseract-Parameterkombination auf
//Genauigkeit der Texterkennung wird jeweils ausgewertet und das Ergebnis in einer CSV-Datei gespeichert
//const paramCombinations = [];
async function processDataset() {
  try {
    //generateParamCombinations(Object.keys(params), 0, {});
    const mainDirectory = 'C:\\Users\\Aylin\\OneDrive\\Desktop\\Datensatz';
    const directories = await fs.readdir(mainDirectory);
    //for (const combination of paramCombinations) {
      generateCsvWriter();
      for (const directory of directories) {
        const directoryPath = path.join(mainDirectory, directory);
        const imageFiles = await fs.readdir(directoryPath);
        for (const imageFile of imageFiles) {
          const imageFilePath = path.join(directoryPath, imageFile);
          const preprocessedImg = await preprocessImage(imageFilePath);
          //const ocrText = await recognizeText(imageFilePath, combination);
          const ocrText = await recognizeText(preprocessedImg);
          //const finalText = await postprocessText(ocrText);
          await calculateAccuracyOnWordLevel(ocrText, imageFilePath);
        }
        saveOcrAverage();
      }
      //generateCsv(combination);
      generateCsv();
    //}
  } catch (err) {
    console.log(err.message);
  }
}

module.exports = processDataset;