/* global GrammaticSymbol GrammaticRule NormalForm CYK PrettyPrinter */

let examples = [
  {
    "rules":
`S -> aA|bB|ε
A -> CACD|ε|BD
B -> DD|D
C -> a|abA
D -> ab|S|ε`,
    "word": ""
  },
  {
    "rules":
`S -> bCB|bBB|abD
A -> ADb|bD
C -> bBc|aCB
D -> DD|Cb|ε`,
    "word": ""
  },
  {
    "rules":
`S -> AS|SB|a
A -> BC|a
B -> AB|CC|b
C -> AB|c`,
    "word": "aabbcc"
  },
  {
    "rules":
`S -> AB|CD
A -> AA|CS|a
B -> BB|DS|b
C -> DA|CB|a
D -> DD|b`,
    "word": "aabba"
  }
];

window.addEventListener("load", init, false);

let mainContainer;

function init() {
  mainContainer = document.getElementById("mainContainer");
  mainContainer.addEventListener("dom-change", ready, false);
}

function toggle(e) {
  e.target.classList.toggle("closed");
  e.target.nextElementSibling.classList.toggle("closed");
}

function ready() {
  mainContainer.$.processButton.addEventListener("click", process, false);
  
  if (location.hash) {
    let x = parseInt(location.hash.substring(1));
    
    mainContainer.rulesValue = examples[x].rules;
    mainContainer.wordValue = examples[x].word;
  }

  let toggles = document.getElementsByClassName("toggle");
  
  for (let i = 0; i < toggles.length; i++) {
    toggles[i].addEventListener("click", toggle, false);
  }
}


function evaluateCFG(){
	var s = $('#str_cadena').val();
	
	var tokenStream = s.trim().split(' ');

    var rules = $('#str_cfg').val().trim().split('\n');
    var grammar = new tinynlp.Grammar(rules);

    var rootProduction = rules[0].charAt(0);
    var chart = tinynlp.parse(tokenStream, grammar, rootProduction);

    var state = chart.getFinishedRoot(rootProduction);
	
	if(state){
		swal("Nice!", "Cadena Aceptada", "success");
    	$('#str_cadena').val('');
	}else{
		swal("Oops", "Cadena Rechazada", "error");
	}
	
}


function toCNF(){
	init();
	var myString = ``;
	myString = myString + document.getElementById("mainContainer").value;
	mainContainer.rulesValue = myString;
	console.log(document.getElementById("mainContainer").value);
	process();
}

function removeAllChildren(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
  
  element.style.setProperty("height", "0px");
}

function process() {
  if (!mainContainer.rulesValue) {
    return;
  }
  
  let padding = 16;
  let lineHeight = 24;
  
  let grammar = GrammaticRule.listFromString(mainContainer.rulesValue);
  
  grammar = NormalForm.reduce(grammar);
  //removeAllChildren(mainContainer.$.reduced);
  //mainContainer.$.reduced.appendChild(PrettyPrinter.ruleSetToDenseHTML(grammar));
  //mainContainer.$.reduced.style.setProperty("height", `${padding + lineHeight * mainContainer.$.reduced.firstChild.children.length}px`);
  
  grammar = NormalForm.epsilonFree(grammar);
  //removeAllChildren(mainContainer.$.epsilonFree);
  //mainContainer.$.epsilonFree.appendChild(PrettyPrinter.ruleSetToDenseHTML(grammar));
  //mainContainer.$.epsilonFree.style.setProperty("height", `${padding + lineHeight * mainContainer.$.epsilonFree.firstChild.children.length}px`);
  
  grammar = NormalForm.chainFree(grammar);
  //removeAllChildren(mainContainer.$.chainFree);
  //mainContainer.$.chainFree.appendChild(PrettyPrinter.ruleSetToDenseHTML(grammar));
  //mainContainer.$.chainFree.style.setProperty("height", `${padding + lineHeight * mainContainer.$.chainFree.firstChild.children.length}px`);
  
  grammar = NormalForm.fakeNonTerminals(grammar);
  //removeAllChildren(mainContainer.$.fakedNonTerminal);
  //mainContainer.$.fakedNonTerminal.appendChild(PrettyPrinter.ruleSetToDenseHTML(grammar));
  //mainContainer.$.fakedNonTerminal.style.setProperty("height", `${padding + lineHeight * mainContainer.$.fakedNonTerminal.firstChild.children.length}px`);
  
  grammar = NormalForm.lengthReduce(grammar);
  //removeAllChildren(mainContainer.$.lengthReduced);
  //mainContainer.$.lengthReduced.appendChild(PrettyPrinter.ruleSetToDenseHTML(grammar));
  //mainContainer.$.lengthReduced.style.setProperty("height", `${padding + lineHeight * mainContainer.$.lengthReduced.firstChild.children.length}px`);
  
  console.log(grammar);
  
  //removeAllChildren(mainContainer.$.pyramid);
  //removeAllChildren(mainContainer.$.deduction);
  if (mainContainer.wordValue) {
    let startSymbol = new GrammaticSymbol("S");
    let pyramid = [];
    let result = CYK.checkDeductibility(grammar, startSymbol, mainContainer.wordValue, pyramid);
    
    mainContainer.$.pyramid.appendChild(PrettyPrinter.pyramidToHtml(pyramid, mainContainer.wordValue));
    mainContainer.$.pyramid.style.setProperty("background-color", result ? "#99ff99" : "#ff9999");
    mainContainer.$.pyramid.style.setProperty("height", `${padding + 26 * mainContainer.$.pyramid.firstChild.children.length}px`);
    
    if (result) {
      mainContainer.$.deduction.appendChild(PrettyPrinter.deductionToHTML(startSymbol, pyramid));
      mainContainer.$.deduction.style.setProperty("height", `${padding + 20 * mainContainer.$.deduction.firstChild.children.length}px`);
    }
  }
}

// function validate() {
//
// }
