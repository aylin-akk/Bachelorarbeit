const express = require('express');
const multer = require('multer');
const fs = require('fs').promises;
const path = require("path");
const recognizeText = require('./Middleware/recognizeText.js');
//const createDictionary = require('./Middleware/createDictionary.js');
const createProductDatabase = require('./createProductDatabase.js');
const calculateAccuracyOnWordLevel = require('./Measurements/calculateOcrAccuracy.js');
const { generateCsv } = require('./Measurements/generateCSV.js');




//Funktion wird nur dann aufgerufen, wenn dictionary.json noch nicht existiert bzw. wenn der Groundtruth-Datensatz erweitert wird
//createDictionary();

//Wird nur bei neuem Ground-Truth aufgerufen, um Produktdatenbank zu aktualisieren
//createProductDatabase();

const app = express();

//Speicheroption 
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'Images');
  },
  filename: function (req, file, cb) {
    console.log(file);
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const acceptedFileExtensions = ['.jpg', '.jpeg', '.png', '.JPG'];
  const fileExtension = path.extname(file.originalname);

  if (acceptedFileExtensions.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb({ code: 'UNSUPPORTED_FILE_EXTENSION', message: 'Nur Bilddateien mit der Endung .jpg, .jpeg und .png werden akzeptiert' });
  }
}

//Konfigurationsoptionen für Multer Middleware
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 //2MG in Bytes
  },
  fileFilter: fileFilter
});



app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'upload.html'));

});


app.get('/processDataset', async (req, res) => {
  try {
    const mainDirectory = 'C:/Users/Aylin/OneDrive/Desktop/Datensatz';
    const directories = await fs.readdir(mainDirectory);
    for (const directory of directories) {
      const directoryPath = path.join(mainDirectory, directory);
      const imageFiles = await fs.readdir(directoryPath);
      for (const imageFile of imageFiles) {
        const imageFilePath = path.join(directoryPath, imageFile);
        const ocrText = await recognizeText(imageFilePath);
        await calculateAccuracyOnWordLevel(ocrText, imageFilePath);
      }
    }
    generateCsv();
    res.status(200).send('Datensatz wird verarbeitet');
  } catch (err) {
    console.log(err.message);
    res.status(400).send('Unbekannter Fehler beim Verarbeiten des Datensatzes');
  }
});


app.post('/upload', upload.single('uploaded_receipt'),
  async (req, res) => {
    try {
      const processedText = await recognizeText(req.file.path);
      res.status(200).json({ message: 'Textextraktion erfolgreich' })
    } catch (err) {
      if (!req.file) {
        res.status(400).json({ extrahierterText: '', message: 'Keine Datei hochgeladen' });
      }
      console.log(err.message);
    }
  }
);



//Middleware, um Fehler beim Hochladen zu behandeln
//wird auf alle Anfragen angewendet
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      res.status(400).json({ extrahierterText: '', message: 'Die Dateigröße darf 2MB nicht überschreiten.' });
      console.log(err.message);
    } else {
      res.status(400).json({ extrahierterText: '', message: 'Ein unbekannter Fehler ist aufgetreten' });
      console.log(err.message);
    }
  } else if (err && err.code === 'UNSUPPORTED_FILE_EXTENSION') {
    res.status(400).json({ extrahierterText: '', message: err.message });
    console.log(err.message);
  } else {
    res.status(400).json({ extrahierterText: '', message: 'Ein unbekannter Fehler ist aufgetreten' });
    console.log(err.message);
  }
});


app.listen(4000, () => {
  console.log('Server running on Port 4000');
});



