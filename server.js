const express = require('express');
const multer = require('multer');
const path = require("path");

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
    filesize: 2 * 1024 * 1024 //2MG in Bytes
  },
  fileFilter: fileFilter
});


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'upload.html'));
});


app.post('/upload', upload.single('uploaded_receipt'), (req, res) => {
  if (req.file) {
    return res.status(200).json({ message: 'Datei erfolgreich hochgeladen' });
  } else {
    return res.status(400).json({ message: 'Keine Datei hochgeladen' });
  }
});

//Middleware, um Fehler zu behandeln
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      res.status(400).json({ message: 'Die Dateigröße darf 2MB nicht überschreiten.' });
    } else {
      res.status(400).json({ message: 'Ein unbekannter Fehler ist aufgetreten' });
    }
  } else if (err && err.code === 'UNSUPPORTED_FILE_EXTENSION') {
    res.status(400).json({ message: err.message });
  } else {
    res.status(400).json({ message: 'Ein unbekannter Fehler ist aufgetreten' });
  }
});

app.listen(4000, () => {
  console.log('Server running on Port 4000');
});


