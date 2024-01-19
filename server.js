const express = require('express');
cv = require('./opencv.js');
//Da OpenCV.js keine Bildformate unterstützt
const Jimp = require('jimp');
const multer = require('multer');
const fs = require('fs');
const path = require("path");
const { createWorker, PSM } = require('tesseract.js');

//<script src="https://unpkg.com/hocrjs"></script>

const app = express();

//Speicheroption 
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'Images');
  },
  filename: function (req, file, cb) {
    console.log(file);
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const acceptedFileExtensions = ['.jpg', '.jpeg', '.png'];
  const fileExtension = path.extname(file.originalname);

  if (acceptedFileExtensions.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb({ code: 'UNSUPPORTED_FILE_EXTENSION', message: 'Nur Bilddateien mit der Endung .jpg, .jpeg und .png werden akzeptiert' });
  }
}

//Konfigurationsoptionen
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 //2MG in Bytes
  },
  fileFilter: fileFilter
});



app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'upload.html'));
});


app.post('/upload', upload.single('uploaded_receipt'),
  async (req, res) => {
    if (req.file) {
      const worker = await createWorker('deu+eng', 3, {
        logger: m => console.log(m), errorHandler: err => console.error(err),
      });
      (async () => {
        await worker.setParameters({
          tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
          user_defined_dpi: '500'
        });
        const { data: { text, hocr } } = await worker.recognize(req.file.path, { hocr: true });
        const targetSentence = 'Unsere Öffnungszeiten';
        const targetIndex = text.indexOf(targetSentence);
        const extractedText = (targetIndex !== -1) ? text.substring(0, targetIndex) : text;
        fs.writeFileSync('tesseract-ocr-result.html', Buffer.from(hocr));
        res.status(200).json({ extrahierterText: extractedText, message: 'Datei erfolgreich hochgeladen' });
        await worker.terminate();
      })();
    } else {
      res.status(400).json({ extrahierterText: '', message: 'Keine Datei hochgeladen' });
    }
  });


//Middleware, um Fehler beim Hochladen zu behandeln
//wird auf alle Anfragen angewendet
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      res.status(400).json({ extrahierterText: '', message: 'Die Dateigröße darf 2MB nicht überschreiten.' });
    } else {
      res.status(400).json({ extrahierterText: '', message: 'Ein unbekannter Fehler ist aufgetreten' });
    }
  } else if (err && err.code === 'UNSUPPORTED_FILE_EXTENSION') {
    res.status(400).json({ extrahierterText: '', message: err.message });
  } else {
    res.status(400).json({ extrahierterText: '', message: 'Ein unbekannter Fehler ist aufgetreten' });
  }
});

app.listen(4000, () => {
  console.log('Server running on Port 4000');
});


