//Funktion zur automatischen Korrektur von Rechtschreibfehlern in Produktbezeichnungen
async function autoCorrectText(ocrText) {
  //Fehler wie z.B. 4009 statt 400g werden korrigiert
  const nineInsteadOfG = /\b(\d{1,4}[ ]*)9[ ]+(\d{1,3},\d{2})\b/g;
  //Fehler wie z.B. 250m!(m1,m],mi,nl,m\) statt 250ml werden korrigiert
  const miInsteadOfMl = /(\d{1,4})(m1|m!|m]|mi|nl|m\|)/g;
  //Fehler wie z.B. Kruppstraße S1 statt Kruppstraße 51 werden korrigiert
  const sInsteadOfFiveBegin = /S(,|\.|\d)/g;
  //Fehler wie z.B. ikg statt 1kg werden korrigiert
  const sInsteadOfFiveEnd = /(,|\.|\d)S/g;
  const bracketInsteadOfL = /(\d|[a-z]|\s)(\)|])/g;
  //Fehler wie z.B. ikg statt 1kg werden korrigiert
  const iInsteadOfOne = /(i|\|)kg/g;
  //Fehler wie z.B. 6x1.51 statt 6x1.5l werden gefunden
  const oneInsteadOfL = /(\d{1,2}x\d(\.|,)\d+)1/g;
  //Fehler wie z.B. 8x259 statt 8x25g werden gefunden
  const nineInsteadOfg = /(\d{1,2}x\d+)9/g;
  //Fehler wie z.B. 5004 statt 500g werden gefunden
  const fourInsteadOfG = /(\D+\d{3})4/g;
  //Fehler wie z.B. n,75 statt 0,75 werden gefunden
  const nineInsteadOfZero = /n((\.|,)\d{1,2})/g;

  const correctedOcrText = ocrText.replace(nineInsteadOfG, '$1g $2').replace(miInsteadOfMl, '$1ml').replace(sInsteadOfFiveBegin, '5$1').replace(sInsteadOfFiveEnd, '$15').replace(bracketInsteadOfL, '$1l').replace(iInsteadOfOne, '1kg').replace(oneInsteadOfL, '$1l').replace(nineInsteadOfg, '$1g').replace(fourInsteadOfG, '$1g').replace(nineInsteadOfZero, '0$1');
  return correctedOcrText;
}

module.exports = autoCorrectText;




































