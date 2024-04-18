const Jimp = require('jimp');
cv = require('./opencv.js');


async function preprocessImage(imageFilePath) {
  //Eingabebild wird mit der Jimp-Bibliothek gelesen, da Opencv.js Bildformate wie png oder jpeg nicht direkt unterstützt 
  const jimpSrc = await Jimp.read(imageFilePath);
  //Bild- Bitmapdaten(Pixeldaten) werden in eine OpenCV-Bildmatrix konvertiert, um damit verschiedene Bildverarbeitungsfunktionen 
  //von OpenCV.js ausführen zu können
  let src = cv.matFromImageData(jimpSrc.bitmap);

  //Neue Matrix-Objekte werden erstellt, um die verarbeiteten Bilder zu speichern
  let dst = new cv.Mat();
  let gray = new cv.Mat();
  let dilate = new cv.Mat();
  let erode = new cv.Mat();

  try {
    const splitedPath = imageFilePath.split("\\");
    const receiptName = (splitedPath[splitedPath.length - 1]).replace(".JPG", '');

    //Verschiedene OpenCV-Bilverarbeitungsfunktionen werden ausgeführt
    let M = cv.Mat.ones(2, 2, cv.CV_8U);
    let anchor = new cv.Point(-1, -1);
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
    cv.dilate(gray, dilate, M, anchor, 1, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());
    cv.erode(dilate, erode, M, anchor, 1, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());
    cv.medianBlur(erode, dst, 3);



    //OpenCV-Bildmatrix wird wieder zurückkonvertiert in ein Jimp-Bild, indem die Farbinformationen iterativ für jedes Pixel aus der
    //Bildmatrix extrahiert werden
    const width = dst.cols;
    const height = dst.rows;
    const channels = dst.channels();
    const srcData = new Uint8ClampedArray(dst.data);

    const imageData = [];
    for (let i = 0; i < srcData.length; i += channels) {
      imageData.push(
        srcData[i], //Rotwert
        srcData[i + 1], //Grünwert
        srcData[i + 2] //Blauwert
        //channels === 4 ? srcData[i + 3] : 255 //optionaler Alphawert
      );
    }

    //Verarbeitetes Bild wird mit der Jimp-Bibliothek gespeichert
    new Jimp({ data: Buffer.from(imageData), width, height }, (err, image) => {
      if (err) console.log(err.message);
      image.write(`./preprocessedImages/${receiptName}.png`, (err) => {
        //image.write(`C:\\Users\\Aylin\\OneDrive\\Desktop\\PreprocessedImages\\${receiptName}.png`, (err) => {
        console.log('Bild gespeichert.');
      });
    });

    //Ressourcen freigeben, nachdem das Bild verarbeitet wurde
    src.delete(); gray.delete(); dilate.delete(); erode.delete(); dst.delete();

    return `./preprocessedImages/${receiptName}.png`;


  } catch (err) {
    //Ressourcen auch bei Fehlern freigeben
    src.delete(); gray.delete(); dilate.delete(); erode.delete(); dst.delete();

    console.log(err.message);
  }
}

//Warten, bis die OpenCV-Bibliothek geladen und initialisiert ist,um OpenCV Funktionen benutzen zu können 
Module = {
  onRuntimeInitialized: function () {
    preprocessImage
  }
}


module.exports = preprocessImage;
