const fs = require('fs');
const { distance } = require('fastest-levenshtein')
//const Nodehun = require('nodehun');



const customDictionary = JSON.parse(fs.readFileSync('./Dictionary/customDictionary.json', 'utf8'));


function correctWord(cleanedText) {
  const lines = cleanedText.split(/\n/g); //Jede Zeile ein neues Array-Elemet
  let wordsPerLine = [];

  for (e of lines) {
    wordsPerLine.push(e.split(/\s{1,}/));
  }

  const wordWithoutNumbers = /^\D+$/;

  let resultLines = [];

  for (e of wordsPerLine) {
    const correctedWords = e.map(word => {
      if (customDictionary[word]) {
        return word;
      } else if (wordWithoutNumbers.test(word) && word.length > 2) {
        return replaceWordByLevenshtein(word);
      }
      return word;

    });
    resultLines.push(correctedWords.join(' '));
  }

  return resultLines.join('\n');
};



function replaceWordByLevenshtein(word) {
  let minDistance = Infinity;
  let closestWord = word;

  //Wir suchen in customDictionary nach dem Wort mit der minimalsten Levenshtein-Distanz
  Object.keys(customDictionary).forEach(dictWord => {
    const levDistance = distance(word, dictWord)
    if (levDistance < minDistance) {
      minDistance = levDistance;
      closestWord = dictWord;
    }
  });

  //Für den Fall, dass wir ein Wort mit einem Schwellenwert <= 2 in customDictionary finden
  const threshold = 2;
  if (minDistance <= threshold) {
    return closestWord;
    //Ansonsten benutzen wir die Duden Correction Api, um falsch erkannte Wörter zu korrigieren
  } else {
    return word;
    //correctWordByHunspell(word);
  }
}


/*async function correctWordByHunspell(word) {

  const affix = fs.readFileSync('./Dictionary/index.aff');
  const dictionary = fs.readFileSync('./Dictionary/index.dic');
  const nodehun = new Nodehun(affix, dictionary);
  const suggestions = await nodehun.suggest(word);
  console.log(word);
  console.log(suggestions);

  if (suggestions.length != 0) {
    let minDistance = Infinity;
    let closestWord = word;

    suggestions.forEach(suggestion => {
      const levDistance = distance(word, suggestion);
      if (levDistance < minDistance) {
        minDistance = levDistance;
        closestWord = suggestion;
      }
      if (minDistance <= 2) {
      return closestWord;
      } else{
        return ' ';
      }
    });
  } else {
    return word;
  }
}
*/


module.exports = correctWord;
