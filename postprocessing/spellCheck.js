const natural = require('natural');
const { initializeDatabases } = require('../dbInitializer.js');

let productsDictionary = {};

async function correctSpelling(ocrText) {
  try {
    const { productsDb} = await initializeDatabases();
    //Holt alle Produktnamen aus der Produktdatenbank sortiert nach ihrer Häufigkeit in absteigender Reihenfolge,
    //damit fehlerhaft gespeicherte Produktnamen vom user immer weiter nach unten rutschen und somit falsch erkannte Wörter nicht
    //falsch korrigiert werden
    const productNames = await productsDb.all('SELECT name FROM products ORDER BY frequency DESC');
    
    const productPattern = /([A-ZÖÜÄa-zäüöß].+)\s+(-?\d{1,3}[,.]\d{2})/gm;
    
    //Iteriert über die Produkte aus der Produktdatenbank, die in der Variable "productNames" gespeichert sind und 
    //erstellt daraus ein Objekt, um es als Wörterbuch für Rechtschreibkorrekturen benutzen zu können
    for (e of productNames) {
      productsDictionary[e.name] = e.frequency;
    }

    let match;
    let result = ocrText;
    //Iteriert über den OCR-Text und ruft für jeden Produktnamen, welcher nicht im Produktwörterbuch ist die Funktion
    //"correctProductNameByLevenshtein" auf, um mögliche Korrekturen für Produktnamen zu erhalten und um die falsch extrahierten
    //Produktnamen im OCR-Text mit den korrigierten Produktnamen zu ersetzen
    while ((match = productPattern.exec(ocrText)) != null) {
      if (!(match[1] in productsDictionary)) {
        let correctedName = correctProductNameByLevenshtein(match[1]);
        result = result.replace(match[1], correctedName);
      }
    }
    await productsDb.close();
    return result;
  } catch (error) {
    await productsDb.close();
    console.log(error);
   }
}

function correctProductNameByLevenshtein(originProductName) {
  let minDistance = Infinity;
  let closestProductName = originProductName;

  //Iteriert über das Produktwörterbuch-Objekt und sucht nach dem einem Produktnamen mit der kleinsten Levenshtein-Distanz
  Object.keys(productsDictionary).forEach(dictWord => {
    const levDistance = natural.LevenshteinDistance(originProductName, dictWord);
    if (levDistance < minDistance) {
      minDistance = levDistance;
      closestProductName = dictWord;
    }
  });

  //Für den Fall, dass der oben gefundene Produktname eine Distanz von höchstens 2 hat, wird dieser korrigierte Produktname
  //zurückgegeben, ansonsten wird der ursprüngliche Produktname im OCR-Text behalten
  const threshold = 3;
  if (minDistance <= threshold) {
    return closestProductName;
  } else {
    //Hier wird ein * dem Produktnamen angehängt, um im Frontend den User darauf aufmerksam zu, dass das Wort nicht bekannt ist (nicht im Wörterbuch)
    return originProductName + "*";
  }
}

module.exports = correctSpelling;