const fs = require('fs').promises;
const path = require("path");
const recognizeText = require('./recognizeText.js');
const params = require('./tessConfig.js');
const calculateAccuracyOnWordLevel = require('./measurements/calculateOcrAccuracy.js');
const { generateCsv, saveOcrAverage, generateCsvWriter } = require('./measurements/generateCSV.js');


const paramCombinations = [];
async function processDataset() {
  try {
    generateParamCombinations(Object.keys(params), 0, {});
    const mainDirectory = 'C:\\Users\\Aylin\\OneDrive\\Desktop\\Datensatz';
    const directories = await fs.readdir(mainDirectory);
    for (const combination of paramCombinations) {
      generateCsvWriter();
      for (const directory of directories) {
        const directoryPath = path.join(mainDirectory, directory);
        const imageFiles = await fs.readdir(directoryPath);
        for (const imageFile of imageFiles) {
          const imageFilePath = path.join(directoryPath, imageFile);
          //const preprocessedImg = await preprocessImage(imageFilePath);
          const ocrText = await recognizeText(imageFilePath, combination);
          //const finalText = await postprocessText(ocrText);
          await calculateAccuracyOnWordLevel(ocrText, imageFilePath);
        }
        saveOcrAverage();
      }
      generateCsv(combination);
    }
  } catch (err) {
    console.log(err.message);
  }
}

//Funktion mit ChatGPT generiert und angepasst
//Funktion generiert alle möglichen Parameterkombinationen von Tesseract,
//um diese später auszuwerten
async function generateParamCombinations(parameters, index, current) {
  if (index === parameters.length) {
    paramCombinations.push({ ...current });
    console.log(paramCombinations.length);
    return;
  }
  const paramName = parameters[index];
  const paramValues = params[paramName];

  for (const value of paramValues) {
    current[paramName] = value;
    await generateParamCombinations(parameters, index + 1, current);
  }
}

module.exports = processDataset;