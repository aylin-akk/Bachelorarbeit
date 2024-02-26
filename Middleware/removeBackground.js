/*const Jimp = require('jimp');
const path = require("path");


const removeBackground = async (req, res, next) => {
  const files = req.files;
  for (const file of files) {
    const jimpSrc = await Jimp.read(file.path);
    let src = cv.matFromImageData(jimpSrc.bitmap);

    let gray = new cv.Mat();
    let binaer = new cv.Mat();
    let gaussian = new cv.Mat();
    let ksize = new cv.Size(5, 5);

    cv.GaussianBlur(src, gaussian, ksize, 0, 0, cv.BORDER_DEFAULT);

    cv.cvtColor(gaussian, gray, cv.COLOR_RGBA2GRAY, 0);
    cv.threshold(gray, binaer, 0, 255, cv.THRESH_BINARY + cv.THRESH_OTSU);



    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();
    cv.findContours(binaer, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

    let rectangularContours = [];


    for (let i = 0; i < contours.size(); i++) {
      let contour = contours.get(i);
      let epsilon = 0.04 * cv.arcLength(contour, true);
      let approx = new cv.Mat();
      cv.approxPolyDP(contour, approx, epsilon, true);
      const area = cv.contourArea(contour);

      if (approx.rows === 4 && area > 100000) {
        rectangularContours.push(contour);
      }

      approx.delete();

    }
    let mask = cv.Mat.zeros(src.rows, src.cols, cv.CV_8U);
    for (let i = 0; i < rectangularContours.length; i++) {
      let contourVec = new cv.MatVector();
      contourVec.push_back(rectangularContours[i]);
      cv.drawContours(mask, contourVec, 0, new cv.Scalar(255), cv.FILLED);
      contourVec.delete();
    }

    let isolatedImage = new cv.Mat();
    binaer.copyTo(isolatedImage, mask);


    const width = isolatedImage.cols;
    const height = isolatedImage.rows;
    const channels = isolatedImage.channels();
    const srcData = new Uint8ClampedArray(isolatedImage.data);

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
      if (err) throw err;
      image.write('result.png', (err) => {
        if (err) throw err;
        console.log('Bild gespeichert.');
      });
    });

  }
  next();
}


Module = {
  onRuntimeInitialized: function () {
    removeBackground
  }
}

cv = require('./opencv.js');


module.exports = removeBackground;
*/
