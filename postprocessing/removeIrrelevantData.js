function removeIrrelevantData(text) {
  //Muster für Stoppwörter, nach denen im OCR-Text gesucht werden soll, um irrelevante Informationen zu entfernen
  const stopword_kundenbeleg = /\bK?-U?-N?-D?-E?-N?-B?-E?-L?-E?-G?\b/gi;
  const stopword_zahlung = /\bZahl?(u|ü)?n?g?\b/gi;
  const stopword_unsere = /\b(U|O|M)(n|h)se?r?(e|a|ä)?\b/gi;


  //Wenn das Stoppwort "Unsere" gefunden wurde, wird der OCR-Text bis vor dem Stoppwort behalten; ansonsten bleibt der OCR-Text unverändert
  const matchResult_unsere = stopword_unsere.exec(text);
  let cleanedText = (matchResult_unsere != null) ? text.substring(0, matchResult_unsere.index - 1) : text;


  //Zusätzliche OCR-Textbereinigung bei Kartenzahlung
  //Wenn die Stoppwörter "Kundenbeleg" und  "Zahlung" gefunden werden, wird der Text zwischen den beiden Stoppwörtern verworfen
  const matchResult_kundenbeleg = stopword_kundenbeleg.exec(cleanedText);
  const matchResult_zahlung = stopword_zahlung.exec(cleanedText);

  if (matchResult_kundenbeleg != null && matchResult_zahlung !== null) {
    const start = matchResult_kundenbeleg.index - 1;
    const end = matchResult_zahlung.index + matchResult_zahlung[0].length + 8;
    cleanedText = cleanedText.substring(0, start) + cleanedText.substring(end);

    //Alle zusätzlichen Informationen auf dem Kassenbon, die irrelevant sind, werden entfernt
    return cleanedText.replace(/.*\d{6,}[ ]{0,1}/g, '').replace(/^.*(EUR|Netto|MwSt).*$/gim, '').replace(/.*\d{3}\/\d{3}\/\d{3}/, '').replace(/[\s\S]*(ALDI S(Ü|U|O)D)/, '$1').replace(/(\d+)[A-Za-zäüößÖÜÄ ]+$/gm, '$1').replace(/^(.{1} )+/gm, '');
  }

  return cleanedText.replace(/.*\d{6,}[ ]{0,1}/g, '').replace(/^.*(EUR|Netto|MwSt).*$/gim, '').replace(/.*\d{3}\/\d{3}\/\d{3}/, '').replace(/[\s\S]*(ALDI S(Ü|U|O)D)/, '$1').replace(/(\d+)[A-Za-zäüößÖÜÄ ]+$/gm, '$1').replace(/^(.{1} )+/, '');
}

module.exports = removeIrrelevantData;
