/*cv = require('../opencv.js');

const Jimp = require('jimp');

const convertToGray = async (req, res, next) => {
  const image = req.files[0].path;
  const jimpSrc = await Jimp.read(image)
  const src = cv.matFromImageData(jimpSrc.bitmap);
  let dst = new cv.Mat();
  cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY, 0);


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
    convertToGray();
  }
}


module.exports = convertToGray;*/