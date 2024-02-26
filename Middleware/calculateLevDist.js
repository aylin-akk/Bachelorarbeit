/*
 * Dieser Code wurde von https://javascript.plainenglish.io/a-beginners-guide-to-the-levenshtein-distance-algorithm-part-3-how-to-code-the-levenshtein-b4721538ba7 übernommen.
 
 * Originalautor: Lisa Primeaux-Redmond
 * Veröffentlicht am: 24. November 2021
 * Geändert von: Aylin Akkol
 */

function calculateLevDist(tessWord, dictWord) {
  const grid = [];
  for (let i = 0; i < tessWord.length + 1; i++) {
     const row = []
     for (let j = 0; j < dictWord.length + 1; j++) {
        row.push(j);
     }
     row[0] = i;
     grid.push(row);
  }
  for (let i = 1; i < tessWord.length + 1; i++) {
     for (let j = 1; j < dictWord.length + 1; j++) {
        if (tessWord[i - 1] === dictWord[j - 1]) {
           grid[i][j] = grid[i - 1][j - 1];
        }else {
           grid[i][j] = 1 + Math.min(
              grid[i][j - 1], //Insertion
              grid[i - 1][j - 1], //Substitution
              grid[i - 1][j]); //Deletion
        }
     }
  }
  return grid[tessWord.length][dictWord.length];
}


module.exports = calculateLevDist;
