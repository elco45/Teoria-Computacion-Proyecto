/* exported NormalForm */
/* global GrammaticSymbol GrammaticWord GrammaticRule */

class NormalForm {
  static getReachableSymbols(grammar) {
    let reachableSymbols = [];
    
    // let newReachableSymbols = [grammar[0].leftSide.symbols[0]];
    let newReachableSymbols = [new GrammaticSymbol("S")];
    
    while (newReachableSymbols.length > 0) {
      let currentRules = [];
      for (let currentSymbol of newReachableSymbols) {
        currentRules.push(...grammar.filter((r) => r.leftSide.symbols[0].equals(currentSymbol)));
      }
      
      reachableSymbols.push(...newReachableSymbols);
      newReachableSymbols = [];
      
      for (let currentRule of currentRules) {
        for (let currentSymbol of currentRule.rightSide.symbols) {
          if (
            !currentSymbol.isTerminal() &&
            new GrammaticWord(reachableSymbols).indexOf(currentSymbol) === -1 &&
            new GrammaticWord(newReachableSymbols).indexOf(currentSymbol) === -1
          ) {
            newReachableSymbols.push(currentSymbol);
          }
        }
      }
    }
    
    return reachableSymbols;
  }
  
  static getActiveSymbols(grammar) {
    let activeSymbols = [];
    let newActiveSymbols = grammar.filter((r) => r.rightSide.isTerminal()).map((r) => r.leftSide.symbols[0]);
    
    while (newActiveSymbols.length > 0) {
      activeSymbols.push(...newActiveSymbols);
      newActiveSymbols = [];
      
      for (let currentRule of grammar) {
        let nonTerminals = currentRule.rightSide.getNonTerminals();
        
        if (
          new GrammaticWord(nonTerminals).containsOnly(new GrammaticWord(activeSymbols)) &&
          new GrammaticWord(activeSymbols).indexOf(currentRule.leftSide.symbols[0]) === -1 &&
          new GrammaticWord(newActiveSymbols).indexOf(currentRule.leftSide.symbols[0]) === -1
        ) {
          newActiveSymbols.push(currentRule.leftSide.symbols[0]);
        }
      }
    }
    
    return activeSymbols;
  }
  
  static reduce(grammar) {
    let reachableSymbols = NormalForm.getReachableSymbols(grammar);
    let activeSymbols = NormalForm.getActiveSymbols(grammar);
    
    let reachableSymbolsWord = new GrammaticWord(reachableSymbols);
    let activeSymbolsWord = new GrammaticWord(activeSymbols);
    
    let usefulSymbols = [];
    
    for (let currentSymbol of reachableSymbolsWord.symbols) {
      if (activeSymbolsWord.indexOf(currentSymbol) !== -1) {
        usefulSymbols.push(currentSymbol);
      }
    }
    
    let usefulSymbolsWord = new GrammaticWord(usefulSymbols);
    
    let result = grammar.filter(
      (r) =>
      new GrammaticWord(r.leftSide.getNonTerminals()).containsOnly(usefulSymbolsWord) &&
      new GrammaticWord(r.rightSide.getNonTerminals()).containsOnly(usefulSymbolsWord)
    );
    
    return result;
  }
  
  static getNullableSymbols(grammar) {
    let nullableSymbols = [];
    let newEpsilonSymbols = grammar.filter((r) => r.rightSide.symbols[0].base === "ε").map((r) => r.leftSide.symbols[0]);
    
    while (newEpsilonSymbols.length > 0) {
      nullableSymbols.push(...newEpsilonSymbols);
      newEpsilonSymbols = [];
      
      for (let currentRule of grammar) {
        if (
          currentRule.rightSide.containsOnly(new GrammaticWord(nullableSymbols)) &&
          new GrammaticWord(nullableSymbols).indexOf(currentRule.leftSide.symbols[0]) === -1 &&
          new GrammaticWord(newEpsilonSymbols).indexOf(currentRule.leftSide.symbols[0]) === -1
        ) {
          newEpsilonSymbols.push(currentRule.leftSide.symbols[0]);
        }
      }
    }
    
    return nullableSymbols;
  }
  
  static epsilonFree(grammar) {
    let nullableSymbols = NormalForm.getNullableSymbols(grammar);
    
    for (let i = 0; i < grammar.length; i++) {
      if (grammar[i].rightSide.symbols[0].base === "ε") {
        grammar.splice(i, 1);
      }
    }
    
    for (let currentSymbol of nullableSymbols) {
      for (let currentRule of grammar) {
        let index = currentRule.rightSide.indexOf(currentSymbol);
        if (index !== -1 && currentRule.rightSide.symbols.length > 1) {
          while (index !== -1) {
            let newRule = currentRule.copy();
            newRule.rightSide.symbols.splice(index, 1);
            grammar.push(newRule);
            
            index = currentRule.rightSide.indexOf(currentSymbol, index + 1);
          }
        }
      }
    }
    
    GrammaticRule.sort(grammar);
    
    GrammaticRule.clean(grammar);
    
    return grammar;
  }
  
  static getChainedSymbols(grammar, symbol) {
    let chainedSymbols = [];
    let newChainedSymbols = [symbol];
    
    while (newChainedSymbols.length > 0) {
      let currentRules = [];
      for (let currentSymbol of newChainedSymbols) {
        currentRules.push(...grammar.filter((r) => r.leftSide.symbols[0].equals(currentSymbol)));
      }
      
      chainedSymbols.push(...newChainedSymbols);
      newChainedSymbols = [];
      
      for (let currentRule of currentRules) {
        if (currentRule.rightSide.symbols.length === 1) {
          let currentSymbol = currentRule.rightSide.symbols[0];
          if (
            !currentSymbol.isTerminal() &&
            new GrammaticWord(chainedSymbols).indexOf(currentSymbol) === -1 &&
            new GrammaticWord(newChainedSymbols).indexOf(currentSymbol) === -1
          ) {
            newChainedSymbols.push(currentSymbol);
          }
        }
      }
    }
    
    return chainedSymbols;
  }
  
  static chainFree(grammar) {
    let nonTerminals = [];
    
    for (let currentRule of grammar) {
      if (
        !currentRule.leftSide.symbols[0].isTerminal() &&
        new GrammaticWord(nonTerminals).indexOf(currentRule.leftSide.symbols[0]) === -1
      ) {
        nonTerminals.push(currentRule.leftSide.symbols[0]);
      }
    }
    
    for (let currentNonTerminal of nonTerminals) {
      let chainedSymbols = NormalForm.getChainedSymbols(grammar, currentNonTerminal);
      
      for (let currentChainedSymbol of chainedSymbols) {
        let currentRules = grammar.filter((r) => r.leftSide.symbols[0].equals(currentChainedSymbol));
        for (let currentRule of currentRules) {
          grammar.push(new GrammaticRule(
            new GrammaticWord([currentNonTerminal.copy()]),
            currentRule.rightSide.copy()
          ));
        }
      }
    }
    
    for (let i = 0; i < grammar.length; i++) {
      if (
        grammar[i].rightSide.symbols.length === 1 &&
        !grammar[i].rightSide.symbols[0].isTerminal()
      ) {
        grammar.splice(i, 1);
        i--;
      }
    }
    
    GrammaticRule.sort(grammar);
    GrammaticRule.clean(grammar);
    
    return grammar;
  }
  
  static fakeNonTerminals(grammar) {
    let terminalsToFake = [];
    
    let longerRules = grammar.filter((r) => r.rightSide.symbols.length > 1);
    for (let currentRule of longerRules) {
      for (let i = 0; i < currentRule.rightSide.symbols.length; i++) {
        if (currentRule.rightSide.symbols[i].isTerminal()) {
          if (new GrammaticWord(terminalsToFake).indexOf(currentRule.rightSide.symbols[i]) === -1) {
            terminalsToFake.push(currentRule.rightSide.symbols[i]);
          }
          
          currentRule.rightSide.symbols[i] = new GrammaticSymbol("Q", currentRule.rightSide.symbols[i].base);
        }
      }
    }
    
    for (let currentTerminalToFake of terminalsToFake) {
      grammar.push(new GrammaticRule(
        new GrammaticWord([new GrammaticSymbol("Q", currentTerminalToFake.base)]),
        new GrammaticWord([new GrammaticSymbol(currentTerminalToFake.base)])
      ));
    }
    
    GrammaticRule.sort(grammar);
    
    return grammar;
  }

  static lengthReduce(grammar) {
    let index = 1;
    
    let addedRules = [];
    
    let longerRules = grammar.filter((r) => r.rightSide.symbols.length > 2);
    for (let i = 0; i < longerRules.length; i++) {
      while (longerRules[i].rightSide.symbols.length > 2) {
        let ending = new GrammaticWord(longerRules[i].rightSide.symbols.slice(
          longerRules[i].rightSide.symbols.length - 2,
          longerRules[i].rightSide.symbols.length
        ));
        
        let existing = addedRules.filter((r) => r.rightSide.equals(ending));
        
        if (existing.length > 0) {
          longerRules[i].rightSide.symbols.splice(
            longerRules[i].rightSide.symbols.length - 2, 2,
            existing[0].leftSide.symbols[0].copy()
          );
        } else {
          let newSymbol = new GrammaticSymbol("W", String(index++));
          
          longerRules[i].rightSide.symbols.splice(longerRules[i].rightSide.symbols.length - 2, 2, newSymbol);
          addedRules.push(new GrammaticRule(new GrammaticWord([newSymbol.copy()]), ending));
        }
      }
    }
    
    grammar.push(...addedRules);
    
    GrammaticRule.sort(grammar);
    
    return grammar;
  }

  static normalForm(grammar) {
    NormalForm.reduce(grammar);
    NormalForm.epsilonFree(grammar);
    NormalForm.chainFree(grammar);
    NormalForm.reduce(grammar);
    NormalForm.fakeNonTerminals(grammar);
    NormalForm.lengthReduce(grammar);
    
    return grammar;
  }
}
