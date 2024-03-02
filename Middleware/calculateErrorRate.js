/*const speechScorer = require('word-error-rate');
const calcCER = require('character-error-rate');
const fs = require('fs');


//Zeichenfehlerrate messen
function calculate_CER(improvedOutput, outputFileName) {
  let referenceContent = fs.readFileSync(`./GroundtruthDataset/${outputFileName}`, 'utf-8');
  //console.log(levDist);
  //console.log(referenceContent.length);
  //return ((levDist / (levDist + (improvedOutput.length - levDist))) * 100).toFixed(2);
  const charErrRate = calcCER(normalizeText(improvedOutput), normalizeText(referenceContent), true, true);
  return (charErrRate * 100).toFixed(2);
}

//Wortfehlerrate messen
function calculate_WER(improvedOutput, outputFileName) {
  let referenceContent = fs.readFileSync(`./GroundtruthDataset/${outputFileName}`, 'utf-8');
  const wordErrorRate = speechScorer.wordErrorRate(normalizeText(improvedOutput), normalizeText(referenceContent));
  return (wordErrorRate * 100).toFixed(2);
}

function normalizeText(text) {
  //Alle Leerzeichen am Anfang und Ende + Mehrfachleerzeichen innerhalb des Strings löschen
  text = text.trim().replace(/\s{1,}/g, ' ');
  //Alle Zeilenumbrüche am Anfang und Ende + Mehrfachzeilenumbrüche innerhalb des Strings löschen
  text = text.replace(/^\n{1,}|\n{1,}$/g, '').replace(/\n{1,}/g, '\n');
  return text;
}


module.exports = { calculate_CER, calculate_WER };

*/