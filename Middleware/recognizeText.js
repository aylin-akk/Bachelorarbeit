const fs = require('fs');
const path = require("path");
const { createWorker, PSM } = require('tesseract.js');



const recognizeText = async (req, res, next) => {

  /*if (req.files.length === 0) {
    return res.status(400).json({ extrahierterText: '', message: 'Keine Datei hochgeladen' });
  } else {*/
    const worker = await createWorker('deu', 2);

    await worker.setParameters({
      tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
      preserve_interword_spaces: '1',
      user_defined_dpi: '500'
    });

    //const files = req.files;

    //for (const file of files) {
      const { data: { text } } = await worker.recognize('../output.png');
      const targetSentence = 'Unsere Offnungszeiten';
      const targetIndex = text.indexOf(targetSentence);
      const extractedText = (targetIndex !== -1) ? text.substring(0, targetIndex) : text;

      const dateinameOhneEndung = path.basename(req.files[0].path, path.extname(req.files[0].path));
      fs.writeFileSync(`tessOutput/${dateinameOhneEndung}.txt`, Buffer.from(extractedText));
      console.log(extractedText);
      await worker.terminate();
      next();
    }

    

  
  //}
//}

module.exports = recognizeText;
