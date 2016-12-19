/* exported PrettyPrinter */
/* global GrammaticWord */

class PrettyPrinter {
  static symbolToHTML(symbol) {
    let symbolSpan = document.createElement("span");
    symbolSpan.classList.add("grammatic-symbol");
    
    let symbolText = document.createTextNode(symbol.base);
    
    symbolSpan.appendChild(symbolText);
    
    if (symbol.sub !== null) {
      let subSub = document.createElement("sub");
      let subText = document.createTextNode(symbol.sub);
      
      subSub.appendChild(subText);
      
      symbolSpan.appendChild(subSub);
    }
    
    return symbolSpan;
  }
  
  static wordToHTML(word) {
    let wordSpan = document.createElement("span");
    wordSpan.classList.add("grammatic-word");
    
    for (let currentSymbol of word.symbols) {
      wordSpan.appendChild(PrettyPrinter.symbolToHTML(currentSymbol));
    }
    
    return wordSpan;
  }
  
  static ruleToHTML(rule) {
    let ruleSpan = document.createElement("span");
    ruleSpan.classList.add("grammatic-rule");
    
    ruleSpan.appendChild(PrettyPrinter.wordToHTML(rule.leftSide));
    
    let arrowText = document.createTextNode(" -> ");
    ruleSpan.appendChild(arrowText);
    
    ruleSpan.appendChild(PrettyPrinter.wordToHTML(rule.rightSide));
    
    return ruleSpan;
  }
  
  static ruleSetToHTML(ruleSet) {
    let ruleSetP = document.createElement("p");
    ruleSetP.classList.add("grammatic-rule-set");
    
    for (let currentRule of ruleSet) {
      ruleSetP.appendChild(PrettyPrinter.ruleToHTML(currentRule));
    }
    
    return ruleSetP;
  }
  
  static ruleSetToDenseHTML(ruleSet) {
    let ruleSetP = document.createElement("p");
    ruleSetP.classList.add("grammatic-rule-set");
    ruleSetP.classList.add("dense");
    
    let leftSideStrings = {};
    
    for (let currentRule of ruleSet) {
      let currentLeftSideString = currentRule.leftSide.toString();
      if (!(currentLeftSideString in leftSideStrings)) {
        leftSideStrings[currentLeftSideString] = [];
      }
      
      leftSideStrings[currentLeftSideString].push(currentRule.rightSide);
    }
    
    for (let currentLeftSideString in leftSideStrings) {
      // if ({}.hasOwnProperty.call(leftSideStrings, currentLeftSideString)) {
      if (leftSideStrings.hasOwnProperty(currentLeftSideString)) {
        let ruleSpan = document.createElement("span");
        ruleSpan.classList.add("grammatic-rule");
        
        ruleSpan.appendChild(PrettyPrinter.wordToHTML(GrammaticWord.fromString(currentLeftSideString)));
        
        let arrowText = document.createTextNode(" -> ");
        ruleSpan.appendChild(arrowText);
        
        let separatorText = document.createTextNode("|");
        let isFirst = true;
        
        for (let currentRightSide of leftSideStrings[currentLeftSideString]) {
          if (isFirst) {
            isFirst = false;
          } else {
            ruleSpan.appendChild(separatorText.cloneNode());
          }
          
          ruleSpan.appendChild(PrettyPrinter.wordToHTML(currentRightSide));
        }
        
        ruleSetP.appendChild(ruleSpan);
      }
    }
    
    return ruleSetP;
  }
  
  static pyramidToHtml(pyramid, word) {
    let pyramidDiv = document.createElement("div");
    pyramidDiv.classList.add("CYK-pyramid");
    
    let separatorText = document.createTextNode(",");
    let emptyText = document.createTextNode("∅");
    
    for (let currentLevel of pyramid) {
      let levelDiv = document.createElement("div");
      levelDiv.classList.add("CYK-pyramid-level");
      
      for (let currentCell of currentLevel) {
        let cellDiv = document.createElement("div");
        cellDiv.classList.add("CYK-cell");
        cellDiv.classList.add("CYK-pyramid-cell");
        
        if (currentCell.length === 0) {
          cellDiv.appendChild(emptyText.cloneNode());
        }
        
        let isFirst = true;
        
        for (let currentSymbol of currentCell) {
          if (isFirst) {
            isFirst = false;
          } else {
            cellDiv.appendChild(separatorText.cloneNode());
          }
          
          cellDiv.appendChild(PrettyPrinter.symbolToHTML(currentSymbol));
        }
        
        levelDiv.appendChild(cellDiv);
      }
      
      // pyramidDiv.appendChild(levelDiv);
      pyramidDiv.insertBefore(levelDiv, pyramidDiv.firstChild);
    }
    
    let levelDiv = document.createElement("div");
    levelDiv.classList.add("CYK-word-level");
    
    for (let character of word) {
      let cellDiv = document.createElement("div");
      cellDiv.classList.add("CYK-cell");
      cellDiv.classList.add("CYK-word-cell");
      
      let characterText = document.createTextNode(character);
      cellDiv.appendChild(characterText);
      
      levelDiv.appendChild(cellDiv);
    }
    
    pyramidDiv.appendChild(levelDiv);
    
    return pyramidDiv;
  }

  static deductionToHTML(startSymbol, pyramid) {
    let deductionP = document.createElement("p");
    
    // let separatorText = document.createTextNode(" => ");
    
    let deducedStartSymbol = pyramid[pyramid.length - 1][0].filter((s) => s.equals(startSymbol))[0];
    
    let currentWord = new GrammaticWord([deducedStartSymbol]);
    
    while (!currentWord.isTerminal()) {
      let currentIndex = currentWord.getFirstNonTerminalIndex();
      
      let currentSymbol = currentWord.symbols[currentIndex];
      
      deductionP.appendChild(PrettyPrinter.wordToHTML(currentWord));
      // deductionP.appendChild(separatorText.cloneNode());
      deductionP.appendChild(PrettyPrinter.ruleToHTML(currentSymbol.rule));
      console.log(currentSymbol.rule.toString());
      
      currentWord.symbols.splice(currentIndex, 1, ...currentSymbol.results);
    }
    
    deductionP.appendChild(PrettyPrinter.wordToHTML(currentWord));
    
    // let queue = [deducedStartSymbol];
    // while (queue.length > 0) {
    //   let currentSymbol = queue.pop();
    //
    // }
    
    return deductionP;
  }
}
