const express = require('express');
const multer = require('multer');
const path = require("path");

const app = express();


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'Images');
  },
  filename: function (req, file, cb) {
    console.log(file);
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = function (req, file, cb){
  const acceptedFileExtensions = ['.jpg', '.jpeg', '.png'];
  const fileExtension = path.extname(file.originalname);
  
  if(acceptedFileExtensions.includes(fileExtension)){
    cb(null, true);
  }else{
    cb(new Error('Nur Bilddateien mit der Endung .jpg, .jpeg und .png werden akzeptiert.'));
  }
}


const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter
});



app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'upload.html'));

});


app.post('/upload',upload.single('uploaded_receipt'),(req, res) => {
  res.send("Receipt uploaded");
});

app.listen(4000, () => {
  console.log('Server running on Port 4000');
});


