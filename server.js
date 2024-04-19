const express = require('express');
const multer = require('multer');
const fs = require('fs').promises;
const path = require("path");
const recognizeText = require('./recognizeText.js');
const saveReceiptData = require('./dataManagemet/saveReceiptDataToDB.js');
const extractReceiptData = require('./dataExtraktion.js');
const preprocessImage = require('./preprocessing/imagePreprocessing.js');
const autoCorrectText = require('./postprocessing/autoCorrect.js');
const correctSpelling = require('./postprocessing/spellcheck.js');
const { getReceiptDataFromDb, getReceiptProductsFromDb, getJoinedDataFromDb } = require('./dataManagemet/getReceiptData.js');
const deleteReceiptFromDatabase = require('./dataManagemet/deleteReceipt.js');
//const processDataset = require('./processDataset.js');
//const createProductDatabase = require('./dataManagemet/createProductDatabase.js');

//Funktion wurde nur einmal aufgerufen, um die Produktdatenbank mit dem Ground-Truth-Datensatz zu erstellen
//createProductDatabase();

//Funktion wurde nur für die Auswertung des Datensatzes aufgerufen
setTimeout(() => {
  //processDataset();
}, "5000");

const app = express();

//Konfiguration für den Speicherort und den Dateinamen der hochgeladenen Datei(Kassenbon)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images');
  },
  filename: function (req, file, cb) {
    console.log(file);
    cb(null, Date.now() + path.extname(file.originalname));
  },
});


//Filterfunktion der Multer-Middleware, die kontrolliert, welche Dateien beim Hochladen akzeptiert werden
const fileFilter = (req, file, cb) => {
  const acceptedFileExtensions = ['.jpg', '.jpeg', '.png'];
  const fileExtension = path.extname(file.originalname).toLocaleLowerCase();
  if (acceptedFileExtensions.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb({ code: 'UNSUPPORTED_FILE_EXTENSION', message: 'Nur Bilddateien mit der Endung .jpg, .jpeg und .png werden akzeptiert' });
  }
}

//Konfigurationsobjekt der Multer-Middleware, um das Hochladen der Dateien zu verwalten
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 //5MB in Bytes
  },
  fileFilter: fileFilter
});

//Startseite
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/upload.html'));
});

//Route zum Speichern von Kassenbondaten in die Datenbank
app.post('/saveReceiptToDatabase', upload.none(), async (req, res) => {
  try {
    await saveReceiptData(req.body);
    res.status(200).json({ result: "saved" });
  } catch (error) {
    console.log(error);
  }
});


//Route zum Löschen von Kassenbons aus der Datenbank
app.post('/deleteReceiptFromDatabase', upload.none(), async (req, res) => {
  try {
    await deleteReceiptFromDatabase(req.body.id);
    res.status(200).json({ result: "deleted" });
  } catch (error) {
    console.log(error);
  }
});


//Route zum Hochladen von Kassenbons und zum Ausführen der Tesseract-Pipeline
app.post('/upload', upload.single('uploaded_receipt'),
  async (req, res) => {
    try {
      const preprocessedImg = await preprocessImage(req.file.path);
      const cleanedOcrText = await recognizeText(preprocessedImg);
      const autoCorrectedOcrText = await autoCorrectText(cleanedOcrText);
      const finalText = await correctSpelling(autoCorrectedOcrText);
      const extractedData = await extractReceiptData(finalText);
      res.status(200).json({ message: 'Textextraktion erfolgreich', resultProducts: extractedData.products, resultInfos: extractedData.infos });
    } catch (err) {
      if (!req.file) {
        res.status(400).json({ message: 'Keine Datei hochgeladen' });
      }
      console.log(err.message);
    }
  }
);

//Route zum Ausgeben von Kassenbondaten im Frontend
app.post('/getAllReceipts', upload.none(), async (req, res) => {
  try {
    let result = await getReceiptDataFromDb();

    for (receipt of result) {
      receipt.sum = parseFloat(receipt.sum).toFixed(2);
    }
    res.json(result);
  } catch (error) {
    console.log(error);
  }
});

//Route zum Holen der Kassenbondaten aus der Datenbank für die Analysen
app.post('/getAllDataForAnalysis', upload.none(), async (req, res) => {
  try {
    let resultReceipts = await getReceiptDataFromDb();
    let resultProducts = await getReceiptProductsFromDb();
    let joinedTableData = await getJoinedDataFromDb();

    res.json({ resultReceipts, resultProducts, joinedTableData });
  } catch (error) {
    console.log(error);
  }
});


//Funktion die über die Route '/messung' aufgerufen wird, um die Tesseract-Parameter-Messungen auszuwerten
//Messungen CSV´s werden gelesen -> sortiert -> ausgewertet
let measurementList = [];

async function readMeasurements(){
  const mainDirectory = 'C:\\Users\\ersin\\Desktop\\Messungen';
  const csvDocuments = await fs.readdir(mainDirectory);

  for (const csvDocument of csvDocuments) {
    const contents = await fs.readFile(mainDirectory + "\\" +csvDocument, { encoding: 'utf8' });
    measurementList.push([contents,csvDocument]);
  }
  let test = getTotalRanking();
  return test;
}

let singleFolderAverageRanking = [];
function getTotalRanking(){

  let j = 0;
  let tempArr = [];
  let resultRankingArray = [];
  let avarageBackgroung = [];
  let avarageArtificalLight = [];
  let avarageShadow = [];
  let avarageBadLight = [];
  let avarageDayLight = [];
  for(measurement of measurementList){
    let tempAverageValue = 0;
    let folderAverage = [];
    tempArr.push(measurement[0].split(" , , , \n"));

    avarageBackgroung.push([parseFloat(tempArr[j][0].split(",")[tempArr[j][0].split(",").length-1].replace("%\n","")),measurement[1],"Hintergrund"]);
    avarageArtificalLight.push([parseFloat(tempArr[j][1].split(",")[tempArr[j][1].split(",").length-1].replace("%\n","")),measurement[1],"künstliches Licht"]);
    avarageShadow.push([parseFloat(tempArr[j][2].split(",")[tempArr[j][2].split(",").length-1].replace("%\n","")),measurement[1],"Schatten"]);
    avarageBadLight.push([parseFloat(tempArr[j][3].split(",")[tempArr[j][3].split(",").length-1].replace("%\n","")),measurement[1],"schlechtes Licht"]);
    avarageDayLight.push([parseFloat(tempArr[j][4].split(",")[tempArr[j][4].split(",").length-1].replace("%\n","")),measurement[1],"tageslicht"]);

    for(let i=0; i<tempArr[j].length-1 ;i++){
      tempAverageValue += parseFloat(tempArr[j][i].split(",")[tempArr[j][i].split(",").length-1].replace("%\n",""));
      folderAverage.push(parseFloat(tempArr[j][i].split(",")[tempArr[j][i].split(",").length-1].replace("%\n","")));

      if(i == 4){
        resultRankingArray.push([(tempAverageValue/5),folderAverage,measurement[1]]);
      }
    }
    j++;
  }
  let test = avarageBackgroung.sort((a, b) => b[0] - a[0])
  console.log(avarageBackgroung)
  console.log(test)

  singleFolderAverageRanking.push(avarageBackgroung.sort((a, b) => b[0] - a[0]));
  singleFolderAverageRanking.push(avarageArtificalLight.sort((a, b) => b[0] - a[0]));
  singleFolderAverageRanking.push(avarageShadow.sort((a, b) => b[0] - a[0]));
  singleFolderAverageRanking.push(avarageBadLight.sort((a, b) => b[0] - a[0]));
  singleFolderAverageRanking.push(avarageDayLight.sort((a, b) => b[0] - a[0]));

  return resultRankingArray.sort((a, b) => b[0] - a[0]);
}
  
//Route für die Auswertung der Messungen
app.get('/messung', async(req, res) => {
  let arr = await readMeasurements();
  res.json({ arr,singleFolderAverageRanking });
});


//Middleware, um Fehler beim Hochladen zu behandeln; wird auf alle Anfragen angewendet
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


app.use(express.static('public'));


app.listen(4000, () => {
  console.log('Server running on Port 4000');
});


