const fs = require('fs');
const path = require('path');
const { createWorker, PSM } = require('tesseract.js');
const removeIrrelevantData = require('./removeIrrelevantData.js');
const replaceWord = require('./replaceWordByLevenshtein.js');
const { calculate_CER, calculate_WER } = require('./calculateErrorRate.js');
const tessConfig = require('../tessConfig.js');



async function recognizeText(imageFilePath) {
    const worker = await createWorker(tessConfig.lang, tessConfig.oem, {
      cachePathPath: 'C:/Program Files/Tesseract-OCR/tessdata',
      logger: m => console.log(m),
      errorHandler: err => console.error(err)
    });
  
    await worker.setParameters({
      tessedit_pageseg_mode: tessConfig.psm,
      tessedit_char_blacklist: tessConfig.blacklist,
      user_defined_dpi: tessConfig.dpi
    });
    
    const { data: { text } } = await worker.recognize(imageFilePath);
    const cleanedOutput = removeIrrelevantData(text);
    const improvedOutput = replaceWord(cleanedOutput);
    const dateinameOhneEndung = path.basename(imageFilePath, path.extname(imageFilePath));
    const outputFileName = `${dateinameOhneEndung}.txt`;
    fs.writeFileSync(`./tessOutput/${outputFileName}`, Buffer.from(improvedOutput));
    const charErrRate = calculate_CER(improvedOutput, outputFileName);
    const wordErrRate = calculate_WER(improvedOutput, outputFileName);
    console.log(improvedOutput + '\n' + `CER = ${charErrRate}%` + '\n' + `WER = ${wordErrRate}%`);
    await worker.terminate();

  }


module.exports = recognizeText;
