const calculate_CER = require('character-error-rate');
const natural = require('natural');

function calculateDist(){
const string1 = "x’ vgéij,rl, {;; %, w“'. A‘ V: ALDI SÜD";
const string2 = "ALDI SÜD";
const distance = natural.LevenshteinDistance(string1, string2);
console.log(distance);

const cer = distance/ Math.max(string1.length, string2.length);



console.log(cer);
}


module.exports = calculateDist;





