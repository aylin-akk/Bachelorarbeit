function removeIrrelevantData(text) {

  const stopword_1 = /\bK?-U?-N?-D?-E?-N?-B?-E?-L?-E?-G?\b/gi;
  const stopword_2 = /\bZahl?(u|ü)?n?g?\b/gi;
  const stopword_3 = /\b(U|O|M)(n|h)se?r?(e|a|ä)?\b/gi;


  const match_3 = stopword_3.exec(text);

  const cleanedUpText = (match_3 !== null) ? text.substring(0, match_3.index) : text;

  const match_1 = stopword_1.exec(cleanedUpText);
  const match_2 = stopword_2.exec(cleanedUpText);
  const nettoBarEU = /^(?=.*\bNetto\b|.*\bbar\b|.*\bEUR\b).*$/gim;

  if (match_1 !== null && match_2 !== null) {
    stopword_2.lastIndex = match_1.index + match_1[0].length;
    const start = match_1.index;
    const end = match_2.index + match_2[0].length;
    const cleanedText = cleanedUpText.substring(0, start) + cleanedUpText.substring(end);

    //Zeichen aller Art werden entfernt, die die Länge 1 haben und am Anfang oder Ende einer Zeile stehen
    return cleanedText.replace(/(?<=\s|^).(?=\s|$)/g, '').replace(/^\s+/gm, '').replace(/\b\d{6,}\b/g, '').replace(nettoBarEU, '').replace(/^[^a-zA-Z0-9]/gim, '').replace(/\b[a-zA-Z]{2}\b/g, '');
  }
  
  return cleanedUpText.replace(/(?<=\s|^).(?=\s|$)/g, '').replace(/^\s+/gm, '').replace(/\b\d{6,}\b/g, '').replace(nettoBarEU, '').replace(/^[^a-zA-Z0-9]/gim, '').replace(/\b[a-zA-Z]{2}\b/g, '');
}
module.exports = removeIrrelevantData;