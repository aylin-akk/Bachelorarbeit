//Hier erfolgt die Konfiguration der Parameter für den Tesseract-Aufruf
const { PSM } = require('tesseract.js');

const params = {
  oem: [3],
  psm: [PSM.SINGLE_BLOCK],
  blacklist: "@#$§^*()_=[]‘{}”„;\"’<>?\\`~£°€“¢>©«»®\|",
  dpi: ['70'],
  thresholding_method: ['2'],
  thresholding_kfactor: ['0.5'],
  thresholding_window_size: ['0.5'],
  load_system_dawg: ['0'],
  load_freq_dawg: ['1'],
  textord_heavy_nr: ['0'],
  textord_parallel_baselines: ['1'],
  tessedit_flip_0O: ['1'],
  rej_1Il_use_dict_word: ['1'],
  language_model_min_compound_length: ['2'],
  textord_skewsmooth_offset: ['2'],
  tessedit_image_border: ['2'],
  textord_noise_rejwords: ['0'],
  wordrec_max_join_chunks: ['2'],
  textord_interpolating_skew: ['0'],
  textord_min_xheight: ['15'],
  enable_noise_removal: ['1']
}


module.exports = params;