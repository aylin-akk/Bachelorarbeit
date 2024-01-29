const Jimp = require('jimp');


const test = async (req, res, next) => {
  var jimpSrc = await Jimp.read(req.files[0].path);

  var src = cv.matFromImageData(jimpSrc.bitmap);
  let gray = new cv.Mat();
  cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY);
  cv.threshold(src, gray, 0, 255, cv.THRESH_BINARY + cv.THRESH_OTSU);

  
  
  // 3. Finden Sie Konturen im binären Bild
  let contours = new cv.MatVector();
  let hierarchy = new cv.Mat();
  cv.findContours(gray, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
  
  // 4. Wählen Sie die größte Kontur (Kassenbon)

  let rectangularContours = [];

  

for (let i = 0; i < contours.size(); i++) {
    
    let contour = contours.get(i);

    // Berechnen Sie die Approximation der Kontur durch ein Polygon
    let epsilon = 0.04 * cv.arcLength(contour, true);
    let approx = new cv.Mat();
    cv.approxPolyDP(contour, approx, epsilon, true);

    // Überprüfen Sie, ob das Polygon vier Ecken hat (Rechteck)
    if (approx.rows === 4) {
        rectangularContours.push(contour);
    }

    approx.delete();

}

  
  // 5. Erzeugen Sie eine Maske und isolieren Sie den Kassenbon
  let mask = cv.Mat.zeros(src.rows, src.cols, cv.CV_8U);
  for (let i = 0; i < rectangularContours.length; i++) {
    let contourVec = new cv.MatVector();
    contourVec.push_back(rectangularContours[i]); // Füge die einzelne Kontur zum MatVector hinzu
    cv.drawContours(mask, contourVec, 0, new cv.Scalar(255), cv.FILLED);
    contourVec.delete(); // Löschen Sie den MatVector, um Speicher freizugeben
}


  

  let isolatedImage = new cv.Mat();
  src.copyTo(isolatedImage, mask);
  

const dstBuffer = new Uint8Array(isolatedImage.cols * isolatedImage.rows * 4);
  for (let i = 0; i < isolatedImage.rows; i++) {
    for (let j = 0; j < isolatedImage.cols; j++) {
      const grayVal = isolatedImage.data[i * isolatedImage.cols + j];
      const idx = (i * isolatedImage.cols + j) * 4;
      dstBuffer[idx] = grayVal;
      dstBuffer[idx + 1] = grayVal;
      dstBuffer[idx + 2] = grayVal;
      dstBuffer[idx + 3] = 255; // Alpha-Kanal auf vollständig undurchsichtig setzen
    }
  }


  new Jimp({
    width: isolatedImage.cols,
    height: isolatedImage.rows,
    data: Buffer.from(dstBuffer)
  })
    .write('output.png');
  src.delete();
  

  next();
}



Module = {
  onRuntimeInitialized: function () {
    test
  }
}

cv = require('./opencv.js');



module.exports = test;