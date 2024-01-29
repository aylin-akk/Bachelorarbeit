const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require("path");
//const convertToGray = require('./Middleware/convertToGray.js');
const recognizeText = require('./Middleware/recognizeText.js');
const test = require('./Middleware/test.js');
//const binarisation = require('./Middleware/binarisation.js');

const app = express();

//Speicheroption 
const storage = multer.diskStorage({
  destination: function (req, files, cb) {
    cb(null, 'Images');
  },
  filename: function (req, files, cb) {
    console.log(files);
    cb(null, files.originalname);
  },
});

const fileFilter = (req, files, cb) => {
  const acceptedFileExtensions = ['.jpg', '.jpeg', '.png'];
  const fileExtension = path.extname(files.originalname);

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
    fileSize: 10 * 1024 * 1024 //2MG in Bytes
  },
  fileFilter: fileFilter
});



app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'upload.html'));
});


app.post('/upload', upload.array('uploaded_receipts'), test, recognizeText, (req, res) => {
  res.status(400).json({message: 'Textextraktion erfolgreich' });
}
);



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


