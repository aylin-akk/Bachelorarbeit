const fs = require('fs');
const path = require('path');
const { createWorker, PSM } = require('tesseract.js');
const removeIrrelevantData = require('./removeIrrelevantData.js');
const replaceWord = require('./replaceWordByLevenshtein.js');
const tessConfig = require('../tessConfig.js');



async function recognizeText(imageFilePath) {
 
    const worker = await createWorker(tessConfig.lang, tessConfig.oem, {
      //logger: m => console.log(m),
      errorHandler: err => console.error(err)

    });
  
    await worker.setParameters({
      tessedit_pageseg_mode: tessConfig.psm,
      tessedit_char_blacklist: tessConfig.blacklist,
      user_defined_dpi: tessConfig.dpi
    });
    
    const { data: { text } } = await worker.recognize(imageFilePath);
    const cleanedOutput = removeIrrelevantData(text);
 
    const splitedPath = imageFilePath.split("\\");
    const receiptName = (splitedPath[splitedPath.length-1]).replace("png", "txt");
   
    fs.writeFileSync(`./tessOutput/${receiptName}`, Buffer.from(cleanedOutput));
    await worker.terminate();
    return cleanedOutput;

  }


module.exports = recognizeText;
