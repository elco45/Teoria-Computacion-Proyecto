/* exported GrammaticWord */
/* global GrammaticSymbol */

class GrammaticWord {
  constructor(symbols = []) {
    this.symbols = symbols;
  }
  
  copy() {
    let other = new GrammaticWord();
    
    for (let currentSymbol of this.symbols) {
      other.symbols.push(currentSymbol.copy());
    }
    
    return other;
  }
  
  static equals(a, b) {
    if (a.symbols.length !== b.symbols.length) {
      return false;
    }
    
    for (let i = 0; i < a.symbols.length; i++) {
      if (!GrammaticSymbol.equals(a.symbols[i], b.symbols[i])) {
        return false;
      }
    }
    
    return true;
  }
  
  equals(other) {
    return GrammaticWord.equals(this, other);
  }
  
  // TODO: Change every "symbols.length" to simply "length"
  
  get length() {
    return this.symbols.length;
  }
  
  static fromString(input) {
    let result = new GrammaticWord();
    
    let pattern = /([^_()])(_\(([^_()]+)\))?/g;
    let match;
    
    while ((match = pattern.exec(input))) {
      if (match[3]) {
        result.symbols.push(new GrammaticSymbol(match[1], match[3]));
      } else {
        result.symbols.push(new GrammaticSymbol(match[1]));
      }
    }
    
    return result;
  }
  
  indexOf(symbol, start = 0) {
    for (let i = start; i < this.symbols.length; i++) {
      if (symbol.equals(this.symbols[i])) {
        return i;
      }
    }
    
    return -1;
  }
  
  containsOnly(allowed) {
    for (let i = 0; i < this.symbols.length; i++) {
      if (allowed.indexOf(this.symbols[i]) === -1) {
        return false;
      }
    }
    
    return true;
  }
  
  isTerminal() {
    for (let currentSymbol of this.symbols) {
      if (!currentSymbol.isTerminal()) {
        return false;
      }
    }
    
    return true;
  }
  
  getFirstNonTerminalIndex() {
    for (let i = 0; i < this.symbols.length; i++) {
      if (!this.symbols[i].isTerminal()) {
        return i;
      }
    }
    
    return -1;
  }
  
  getNonTerminals() {
    return this.symbols.filter((s) => !s.isTerminal());
  }
  
  toString() {
    let result = "";
    
    for (let currentSymbol of this.symbols) {
      result += currentSymbol.toString();
    }
    
    return result;
  }
}
