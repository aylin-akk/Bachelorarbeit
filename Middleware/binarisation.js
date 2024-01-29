/*cv = require('../opencv.js');

const Jimp = require('jimp');

const binarisation = async (req, res, next) => {
  const image = req.files[0].path;
  const jimpSrc = await Jimp.read(image)
  const src = cv.matFromImageData(jimpSrc.bitmap);
  let dst = new cv.Mat();
  cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
  cv.adaptiveThreshold(src, dst, 200, cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY, 3, 2);



  new Jimp({
    width: jimpSrc.bitmap.height,
    height: jimpSrc.bitmap.height,
    data: Buffer.from(jimpSrc.bitmap.data)
  })
    .write('./Middleware/output.png');
  src.delete();
  dst.delete();

  next();

}

Module = {
  onRuntimeInitialized: function () {
    binarisation();
  }
}


module.exports = binarisation;*/