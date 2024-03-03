const { NONAME } = require('dns');
const Jimp = require('jimp');
const path = require("path");




async function preprocessImage(imageFilePath) {
  //Eingabebild wird mit Jimp gelesen, da Opencv.js Bildformate wie png oder jpeg nicht direkt unterstützt 
  const jimpSrc = await Jimp.read(imageFilePath);

  let src = cv.matFromImageData(jimpSrc.bitmap);
  //Neues Matrix-Objekt wird erstellt, wo das finale verarbeitete Bild gespeichert werden soll
  //let dst = new cv.Mat();

  //Neues Matrix-Objekt wird erstellt, wo das Graustufenbild gespeichert werden soll
  let dst = new cv.Mat();

  try {
    const splitedPath = imageFilePath.split("\\");
    const receiptName = (splitedPath[splitedPath.length - 2] + "_" + splitedPath[splitedPath.length - 1]).replace(".JPG", '');



    //Farbiges Eingabebild wird in ein Graustufenbild konvertiert
    cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY, 0);

    //Zielgröße für die Skalierung wird festgelegt
    //let dsize = new cv.Size(2200, 2200);


    //Graustufenbild wird auf die Größe 2200x2200px skaliert
    //cv.resize(gray, dst, dsize, 0, 0, cv.INTER_AREA);

    const width = dst.cols;
    const height = dst.rows;
    const channels = dst.channels();
    const srcData = new Uint8ClampedArray(dst.data);

    const imageData = [];
    for (let i = 0; i < srcData.length; i += channels) {
      imageData.push(
        srcData[i],
        srcData[i + 1],
        srcData[i + 2],
        channels === 4 ? srcData[i + 3] : 255

      );
    }

    new Jimp({ data: Buffer.from(imageData), width, height }, (err, image) => {
      if (err) console.log("##1##" + err.message);
      image.write(`.././PreprocessedImages/${receiptName}.png`, (err) => {
        console.log('Bild gespeichert.');
      });
    });

    //Ressourchen freigeben, nachdem das Bild verarbeitet wurde
    src.delete();  dst.delete();


    return `C:\\Users\\Aylin\\OneDrive\\Desktop\\PreprocessedImages\\${receiptName}.png`;

  } catch (err) {
    src.delete(); dst.delete(); 
    console.log("##2##" + err.message);
  }
}


module.exports = preprocessImage;


Module = {
  onRuntimeInitialized: function () {
    preprocessImage
  }
}

cv = require('.././opencv.js');













module.exports = preprocessImage;