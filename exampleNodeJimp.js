const Jimp = require('jimp');
async function onRuntimeInitialized(){

  var jimpSrc = await Jimp.read("./1705538226586.jpg");
  //var jimpSrc = await Jimp.read(req.file.path);
  var src = cv.matFromImageData(jimpSrc.bitmap);
  let dst = new cv.Mat();
  

cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY, 0);

new Jimp({
    width: dst.cols,
    height: dst.rows,
    data: Buffer.from(dst.data)
  })
  .write('output.png');

  
  src.delete();
  dst.delete();
}
// Finally, load the open.js as before. The function `onRuntimeInitialized` contains our program.
Module = {
  onRuntimeInitialized
};
cv = require('./opencv.js');