const fs = require('fs');
const { createWorker } = require('tesseract.js');
const removeIrrelevantData = require('./postprocessing/removeIrrelevantData.js');
const params = require('./tessConfig.js');


//Hier wird Tesseract für die Texterkennung auf dem hochgeladenen Kassenbon mit den entsprechenden Parametern aufgerufen und in einer 
//Textdatei gespeichert
async function recognizeText(imageFilePath) {
  const worker = await createWorker("deu", params.oem, {
    load_system_dawg: params.load_system_dawg,
    load_freq_dawg: params.load_freq_dawg,
    logger: m => console.log(m),
    errorHandler: err => console.error(err)
  });

  await worker.setParameters({
    tessedit_pageseg_mode: params.psm,
    tessedit_char_blacklist: params.blacklist,
    user_defined_dpi: params.dpi,
    thresholding_method: params.thresholding_method,
    textord_heavy_nr: params.textord_heavy_nr,
    tessedit_flip_0O: params.tessedit_flip_0O,
    rej_1Il_use_dict_word: params.rej_1Il_use_dict_word,
    thresholding_window_size: params.thresholding_window_size,
    thresholding_kfactor: params.thresholding_kfactor,
    language_model_min_compound_length: params.language_model_min_compound_length,
    textord_skewsmooth_offset: params.textord_skewsmooth_offset,
    tessedit_image_border: params.tessedit_image_border,
    textord_noise_rejwords: params.textord_noise_rejwords,
    wordrec_max_join_chunks: params.wordrec_max_join_chunks,
    textord_interpolating_skew: params.textord_interpolating_skew,
    textord_min_xheight: params.textord_min_xheight,
    enable_noise_removal: params.enable_noise_removal
  })

  const { data: { text } } = await worker.recognize(imageFilePath);
  const splitedPath = imageFilePath.split("/");
  const receiptName = (splitedPath[splitedPath.length - 1]).replace("png", "txt");
  const cleanedOcrText = removeIrrelevantData(text);
  fs.writeFileSync(`./tessOutput/${receiptName}`, Buffer.from(cleanedOcrText));
  await worker.terminate();
  return cleanedOcrText;
}

module.exports = recognizeText;
