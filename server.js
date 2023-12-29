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
  }
});

const upload = multer({ storage: storage });

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'upload.html'));

});


app.post("/upload",upload.single("uploaded_receipt"),(req, res) => {
  res.send("Receipt uploaded");
});

app.listen(3001);
console.log("3001 is the port");

