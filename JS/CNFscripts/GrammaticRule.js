/* exported GrammaticRule */
/* global GrammaticWord */

class GrammaticRule {
  constructor(leftSide, rightSide) {
    this.leftSide = leftSide;
    this.rightSide = rightSide;
  }
  
  copy() {
    return new GrammaticRule(this.leftSide.copy(), this.rightSide.copy());
  }
  
  static equals(a, b) {
    if (!GrammaticWord.equals(a.leftSide, b.leftSide)) {
      return false;
    }
    
    if (!GrammaticWord.equals(a.rightSide, b.rightSide)) {
      return false;
    }
    
    return true;
  }
  
  equals(other) {
    return GrammaticRule.equals(this, other);
  }
  
  static fromStrings(leftSide, rightSide) {
    return new GrammaticRule(
      GrammaticWord.fromString(leftSide),
      GrammaticWord.fromString(rightSide)
    );
  }
  
  static listFromString(input) {
    let ruleSet = [];
    
    let splittedInput = input.split("\n");
    let emptyPattern = /^\s*$/;
    let rulePattern = /^\s*(.*?)\s*->\s*(.*?)\s*$/;
    let rightSidePattern = /\|?([^|]+?)(?=\||$)/g;
    
    for (let rule of splittedInput) {
      if (!emptyPattern.test(rule)) {
        let [, leftSide, rightSide] = rulePattern.exec(rule);
        
        let match;
        while ((match = rightSidePattern.exec(rightSide)) !== null) {
          ruleSet.push(GrammaticRule.fromStrings(leftSide, match[1]));
        }
      }
    }
    
    return ruleSet;
  }
  
  toString() {
    return `${this.leftSide.toString()} -> ${this.rightSide.toString()}`;
  }
  
  static sort(grammar) {
    grammar.sort((a, b) => {
      if (a.toString() > b.toString()) {
        return 1;
      }
      if (a.toString() < b.toString()) {
        return -1;
      }
      
      return 0;
    });
    
    return grammar;
  }
  
  static clean(grammar) {
    for (let i = 0; i < grammar.length - 1; i++) {
      while ((i + 1) < grammar.length && grammar[i].equals(grammar[i + 1])) {
        grammar.splice(i, 1);
      }
    }
  }
}
