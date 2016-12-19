/* exported CYK */
/* global GrammaticSymbol DeducedGrammaticSymbol GrammaticWord */

class CYK {
  static getCombinations(a, b) {
    let combinations = [];
    
    for (let i = 0; i < a.length; i++) {
      for (let j = 0; j < b.length; j++) {
        combinations.push(new GrammaticWord([a[i], b[j]]));
      }
    }
    
    return combinations;
  }
  
  static getPossibleLeftSides(grammar, combinations) {
    let result = [];
    
    for (let currentCombination of combinations) {
      for (let currentRule of grammar) {
        if (
          currentRule.rightSide.equals(currentCombination) &&
          new GrammaticWord(result).indexOf(currentRule.leftSide.symbols[0]) === -1
        ) {
          result.push(new DeducedGrammaticSymbol(currentRule.leftSide.symbols[0], currentRule, currentCombination.symbols));
        }
      }
    }
    
    return result;
  }
  
  static checkDeductibility(grammar, startSymbol, word, pyramid = []) {
    let level = 0;
    
    pyramid[level] = [];
    
    for (let i = 0; i < word.length; i++) {
      pyramid[level].push(grammar.filter(
        (r) => r.rightSide.symbols.length === 1 &&
        r.rightSide.symbols[0].equals(new GrammaticSymbol(word[i]))
      ).map((r) => new DeducedGrammaticSymbol(r.leftSide.symbols[0], r, r.rightSide.symbols)));
    }
        
    while (level < word.length - 1) {
      pyramid[level + 1] = [];
      
      for (let i = 0; i < word.length - level - 1; i++) {
        let combinations = [];
        for (let j = 0; j <= level; j++) {
          combinations.push(...CYK.getCombinations(pyramid[j][i], pyramid[level - j][i + j + 1]));
        }
        
        pyramid[level + 1][i] = CYK.getPossibleLeftSides(grammar, combinations);
      }
      
      level++;
    }
    
    return (new GrammaticWord(pyramid[pyramid.length - 1][0]).indexOf(startSymbol) !== -1);
  }
}
