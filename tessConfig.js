const {PSM} = require('tesseract.js');


const tessConfig = {
  lang: "deu",
  oem: 3,
  psm: PSM.SINGLE_COLUMN,
  blacklist: "@#$§^*()_=[]‘{}|”„;\"’<>?\\`~£°€“¢",
  dpi: "300"
};


module.exports = tessConfig;