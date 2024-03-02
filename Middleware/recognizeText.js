const fs = require('fs');
const path = require('path');
const { createWorker, PSM } = require('tesseract.js');
const removeIrrelevantData = require('./removeIrrelevantData.js');
const replaceWord = require('./replaceWordByLevenshtein.js');
const tessConfig = require('../tessConfig.js');



async function recognizeText(imageFilePath) {
 
    const worker = await createWorker(tessConfig.lang, tessConfig.oem, {
      logger: m => {
        if(m.progress > 0.2 && m.progress < 0.21 || m.progress > 0.4 && m.progress < 0.41 || m.progress > 0.6 && m.progress < 0.61 ||m.progress > 0.8 && m.progress < 0.81||m.progress > 0.9 ){
          console.log(m)
        }
      },
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
    const receiptName = (splitedPath[splitedPath.length-2] + "_" + splitedPath[splitedPath.length-1]).replace("JPG", "txt");
   
    fs.writeFileSync(`./tessOutput/${receiptName}`, Buffer.from(cleanedOutput));
    await worker.terminate();
    return cleanedOutput;

  }


module.exports = recognizeText;
