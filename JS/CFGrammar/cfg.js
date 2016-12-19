(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Rule = require('./types').Rule;
var assert = require('./assert');
// pass in the Grammar constructor and its prototype will be modified to have various algorithms
module.exports = function(Grammar) {

// modify the grammar so each symbol has a 'nullable' property
// and the grammar to have a 'nullables' property, a list of nullable symbols
// returns the list of nullables
// http://cstheory.stackexchange.com/a/2493
Grammar.prototype.annotateNullables = function() {
  if(this.hasOwnProperty('nullables')) return this.nullables; // already done, don't redo
  
  this.nullables = [];
  var queue = [];
  var cs = []; // count of non-distinct symbols in RHS of rule i currently marked non-nullable, which does not make for a good variable name
  var rMap = this.getReverseMap();

  for(var i=0; i<this.symbolsList.length; ++i) {
    this.symbolMap[this.symbolsList[i]].nullable = false;
  }
  
  for(var i=0; i<this.rules.length; ++i) {
    var c = 0;
    var rule = this.rules[i];
    var maybeNullable = true; // does this rule produce a string with only nonterminals?
    for(var j=0; j<rule.production.length; ++j) {
      if(rule.production[j].type === 'NT') {
        ++c;
      }
      else {
        maybeNullable = false;
        break;
      }
    }
    if(maybeNullable) {
      cs.push(c);
    }
    else {
      cs.push(0);
    }
    
    
    if(rule.production.length == 0 && !this.symbolMap[rule.name].nullable) {
      this.symbolMap[rule.name].nullable = true;
      queue.push(rule.name);
      this.nullables.push(rule.name);
    }
  }

  for(var i=0; i<this.rules.length; ++i) {
    this.rules[i]._index = i;
  }
  
  while(queue.length > 0) {
    var cur = queue.pop();
    for(var i=0; i<rMap[cur].length; ++i) {
      var affected = rMap[cur][i];
      if(--cs[affected._index] === 0 && !this.symbolMap[affected.name].nullable) { // can only have been positive if the rule contained no terminals, so ok
        this.symbolMap[affected.name].nullable = true;
        queue.push(affected.name);
        this.nullables.push(affected.name);
      }
    }
  }

  for(var i=0; i<this.rules.length; ++i) {
    delete this.rules[i]._index;
  }

  
  return this.nullables;
}


// modify the grammar so each symbol has an "unreachable" property
// ie, no chain of derivations from the start symbol reaches that symbol. note that something may be reachable even if no chain which produces a string involves that thing. (eg S -> AB, B->'', A->A. then B is reachable.)
// grammar gets an "unreachables" property
// returns the list of unreachables
Grammar.prototype.annotateUnreachables = function() {
  if(this.hasOwnProperty('unreachables')) return this.unreachables; // already done, don't redo
  
  this.unreachables = [];
  var queue = [this.start];

  for(var i=0; i<this.symbolsList.length; ++i) {
    this.symbolMap[this.symbolsList[i]].unreachable = true;
  }
  this.symbolMap[this.start].unreachable = false;
  

  while(queue.length > 0) {
    var cur = queue.pop();
    for(var j=0; j<this.symbolMap[cur].rules.length; ++j) {
      var rule = this.symbolMap[cur].rules[j];
      for(var k=0; k<rule.production.length; ++k) {
        var sym = rule.production[k];
        if(sym.type === 'NT' && this.symbolMap[sym.data].unreachable) {
          this.symbolMap[sym.data].unreachable = false;
          queue.push(sym.data);
        }
      }
    }
  }
  
  for(var i=0; i<this.symbolsList.length; ++i) {
    if(this.symbolMap[this.symbolsList[i]].unreachable) {
      this.unreachables.push(this.symbolsList[i]);
    }
  }
  
  return this.unreachables;
}


// modify the grammar so each symbol has a "useless" property
// ie, there is no terminal string derivable from that symbol
// grammar gets a "uselesses" property (forgive me)
// returns the list of useless symbols
Grammar.prototype.annotateUseless = function() {
  if(this.hasOwnProperty('uselesses')) return this.uselesses; // already done, don't redo
  
  this.uselesses = [];
  var queue = [];
  var cs = []; // count of non-distinct symbols in RHS of rule i currently marked possibly-useless, which does not make for a good variable name
  var rMap = this.getReverseMap();

  // very similar logic to finding nullables, except things are assumed useless until proven otherwise
  for(var i=0; i<this.symbolsList.length; ++i) {
    this.symbolMap[this.symbolsList[i]].useless = true;
  }
  
  for(var i=0; i<this.rules.length; ++i) {
    var c = 0;
    var rule = this.rules[i];
    for(var j=0; j<rule.production.length; ++j) {
      if(rule.production[j].type === 'NT') {
        ++c;
      }
    }
    cs.push(c);
    if(c == 0 && this.symbolMap[rule.name].useless) {
      this.symbolMap[rule.name].useless = false;
      queue.push(rule.name);
    }
  }

  for(var i=0; i<this.rules.length; ++i) {
    this.rules[i]._index = i;
  }

  
  while(queue.length > 0) {
    var cur = queue.pop();
    for(var i=0; i<rMap[cur].length; ++i) {
      var affected = rMap[cur][i];
      if(--cs[affected._index] === 0 && this.symbolMap[affected.name].useless) {
        this.symbolMap[affected.name].useless = false;
        queue.push(affected.name);
      }
    }
  }

  for(var i=0; i<this.symbolsList.length; ++i) {
    if(this.symbolMap[this.symbolsList[i]].useless) {
      this.uselesses.push(this.symbolsList[i]);
    }
  }

  for(var i=0; i<this.rules.length; ++i) {
    delete this.rules[i]._index;
  }
  
  return this.uselesses;
}




// modify the grammar so each symbol has a "selfDeriving" property
// ie,  A *=> A (via some chain of length > 0)
// grammar gets a "selfDerivings" property
// returns the list of self-deriving symbols
// http://cs.stackexchange.com/a/40967/12130
Grammar.prototype.annotateSelfDeriving = function() {
  if(this.hasOwnProperty('selfDerivings')) return this.selfDerivings; // already done, don't redo
  
  this.selfDerivings = [];
  
  this.annotateNullables();
  
  var derives = {}; // derives.A.B holds if A *=> B
  for(var i=0; i<this.symbolsList.length; ++i) {
    derives[this.symbolsList[i]] = {};
  }
  
  
  // initialization: set the one-step derivations.
  o:for(var i=0; i<this.rules.length; ++i) {
    var name = this.rules[i].name;
    var production = this.rules[i].production;
    
    // easy cases: production empty, contains terminals, or contains exactly one nonterminal
    if(production.length == 0) {
      continue;
    }
    
    for(var j=0; j<production.length; ++j) {
      if(production[j].type == 'T') {
        continue o;
      }
    }
    
    if(production.length == 1) {
      derives[name][production[0].data] = true;
      continue;
    }
    
    
    // harder case: production consists of two or more nonterminals. TODO could merge some loops but speedup is negligible probably
    var nonnullable = null;
    for(var j=0; j<production.length; ++j) {
      if(!this.symbolMap[production[j].data].nullable) {
        if(nonnullable !== null) {
          continue o; // two or more nonnullable nonterminals: so this rule can't derive any single nonterminal
        }
        nonnullable = production[j].data;
      }
    }
    
    if(nonnullable !== null) { // exactly one nonnullable nonterminal: that and only that is derived.
      derives[name][nonnullable] = true;
    }
    else { // two or more nullable: everything is derived
      for(var j=0; j<production.length; ++j) {
        derives[name][production[j].data] = true; // everything is a nonterminal, so this is safe
      }
    }
  }
  
  // recursion: floyd-warshall, basically
  for(var i=0; i<this.symbolsList.length; ++i) {
    for(var j=0; j<this.symbolsList.length; ++j) {
      for(var k=0; k<this.symbolsList.length; ++k) {
        if(derives[this.symbolsList[i]][this.symbolsList[k]] && derives[this.symbolsList[k]][this.symbolsList[j]]) {
          // if i derives k and k derives j then i derives j
          derives[this.symbolsList[i]][this.symbolsList[j]] = true;
        }
      }
    }
  }
  
  for(var i=0; i<this.symbolsList.length; ++i) {
    var cur = this.symbolsList[i];
    if(derives[cur][cur]) {
      this.symbolMap[cur].selfDeriving = true;
      this.selfDerivings.push(cur);
    }
    else {
      this.symbolMap[cur].selfDeriving = false;
    }
  }
  
  return this.selfDerivings;
}







// returns a copy of the grammar without useless symbols. does not modify the grammar,
// except annotating. if the result is empty, returns {empty: true}.
Grammar.prototype.strippedUseless = function() {
  this.annotateUseless();
  var newRules = [];
  
  for(var i=0; i<this.rules.length; ++i) {
    var rule = this.rules[i];
    if(!this.symbolMap[rule.name].useless) {
      var j;
      for(j=0; j<rule.production.length; ++j) {
        if(rule.production[j].type == 'NT' && this.symbolMap[rule.production[j].data].useless) {
          break;
        }
      }
      if(j == rule.production.length) { // ie rule does not contain any useless symbols
        newRules.push(rule);
      }
    }
  }
  
  if(newRules.length == 0) {
    return {empty: true};
  }
  
  var newGrammar = Grammar(newRules, this.start);
  if(newGrammar.symbolMap[newGrammar.start].rules.length === 0) {
    return {empty: true}; // nowhere to go: empty.
  }
  
  
  assert(newGrammar.annotateUseless().length == 0, 'Haven\'t actually eliminated all useless productions?');
  
  return newGrammar;
}

// returns a copy of the grammar without useless symbols. does not modify the grammar,
// except annotating. if the result is empty, returns {empty: true}.
Grammar.prototype.strippedUnreachable = function() {
  this.annotateUnreachables();
  var newRules = [];
  for(var i=0; i<this.rules.length; ++i) {
    var rule = this.rules[i];
    if(!this.symbolMap[rule.name].unreachable) {
      // sufficient that the LHS is unreachable, since RHS does not contain unreachable unless LHS is unreachable
      newRules.push(rule);
    }
  }

  if(newRules.length == 0) {
    return {empty: true};
  }
  
  var newGrammar = Grammar(newRules, this.start);
  if(newGrammar.symbolMap[newGrammar.start].rules.length === 0) {
    return {empty: true}; // nowhere to go: empty.
  }
  assert(newGrammar.annotateUnreachables().length == 0, 'Haven\'t actually eliminated all unreachable productions?');
  
  return newGrammar;
}


// returns a copy of the grammar with unit productions removed (A -> B) removed.
// does not modify the grammar. if the result is empty, returns {empty: true}.
Grammar.prototype.strippedUnitProductions = function() {
  var newRules = [];
  
  var done = [];
  var queue = [];
  function seen(rule) {
    for(var i=0; i<done.length; ++i) {
      if(done[i].equals(rule)) {
        return true;
      }
    }
    for(var i=0; i<queue.length; ++i) {
      if(queue[i].equals(rule)) {
        return true;
      }
    }
    return false;
  }
  
  function enqueue(rule) {
    if(!seen(rule)) {
      queue.push(rule);
    }
  }
  for(var i=0; i<this.rules.length; ++i) {
    var rule = this.rules[i];
    if(rule.production.length !== 1 || rule.production[0].type == 'T') {
      newRules.push(rule);
    }
    else { // rule is of the form A->B
      enqueue(rule);
    }
  }
  
  while(queue.length > 0) {
    var rule = queue.pop();
    done.push(rule);
    var sym = rule.production[0].data; // everything in the queue is a unit production
    if(sym !== rule.name) { // rule is not A->A, which can just be ignored
      for(var j=0; j<this.symbolMap[sym].rules.length; ++j) {
        var origRule = this.symbolMap[sym].rules[j]; // B->whatever
        var newRule = Rule(rule.name, origRule.production.slice(0)); // A->whatever
        if(newRule.production.length !==1 || newRule.production[0].type == 'T') {
          newRules.push(newRule);
        }
        else {
          enqueue(newRule);
        }
      }
    }
  }
  
  if(newRules.length == 0) {
    return {empty: true};
  }
  
  return Grammar(newRules, this.start); // I'm... pretty sure this is correct.
}


// returns a copy of the grammar with duplicate rules removed.
// does not modify the grammar.
Grammar.prototype.strippedDuplicates = function() {
  var newRules = [];
  for(var i=0; i<this.rules.length; ++i) {
    var rule = this.rules[i];
    var j;
    for(j=0; j<newRules.length; ++j) {
      if(newRules[j].equals(rule)) {
        break;
      }
    }
    if(j == newRules.length) {
      newRules.push(rule);
    }
  }
  return Grammar(newRules, this.start);
}

// TODO some testing about the proper order to strip things, to make grammar as small as possible.
// returns a copy of the grammar without useless or unreachable symbols.
// also removes duplicate rules and rules of the form A->B. does not modify the grammar,
// except annotating. if the result is empty, returns {empty: true}.
Grammar.prototype.stripped = function() {
  var newGrammar = this.strippedUnitProductions();
  if(newGrammar.empty) return newGrammar;

  // useless, then unreachable. not the other way around.
  newGrammar = newGrammar.strippedUseless();
  if(newGrammar.empty) return newGrammar;
  
  newGrammar = newGrammar.strippedUnreachable();
  if(newGrammar.empty) return newGrammar;

  assert(newGrammar.annotateUseless().length == 0, 'Suddenly there are more useless symbols?');  
  
  newGrammar = newGrammar.strippedDuplicates();
  return newGrammar;
}



// not exactly the world's most efficient implement, but whatever.
// used in stripping nullables.
function nthSubset(list, n) {
  var out = [];
  for(var i = 0, p = 1; p<=n; ++i, p<<=1) {
    if(p & n) {
      out.push(list[i]);
    }
  }
  return out;
}


// returns a copy of the grammar which recognizes the same language (except without the empty string)
// does not modify the grammar. new grammar has a property 'makesEpsilon' which is true iff epsilon
// was recognized by the original grammar.
// if the language is otherwise empty, returns {empty: true, makesEpsilon: [as appropriate]}
Grammar.prototype.deNulled = function() {

  var newGrammar = this.stripped();
  if(newGrammar.empty) {
    newGrammar.makesEpsilon = false;
    return newGrammar;
  }
  
  newGrammar.annotateNullables();
  var makesEpsilon = newGrammar.symbolMap[newGrammar.start].nullable;
  newRules = [];
  for(var i=0; i<newGrammar.rules.length; ++i) {
    var rule = newGrammar.rules[i];
    if(rule.production.length == 0) {
      continue; // do not add epsilon productions
    }
    var nullableRHSIndices = [];
    for(var j=0; j<rule.production.length; ++j) {
      if(rule.production[j].type == 'NT' && newGrammar.symbolMap[rule.production[j].data].nullable) {
        nullableRHSIndices.push(j);
      }
    }
    
    if(nullableRHSIndices.length == 0) { // don't actually need this case, but meh.
      newRules.push(rule);
      continue;
    }
    
    var skipFinal = (nullableRHSIndices.length == rule.production.length)?1:0; // if all X's are nullable, do not make an epsilon production.
    var lastSubset = Math.pow(2, nullableRHSIndices.length) - skipFinal;
    
    // one new rule for each subset of nullable RHS symbols, omitting precisely that subset
    for(var j = 0; j<lastSubset; ++j) {
      var skippedSubset = nthSubset(nullableRHSIndices, j);
      
      var newProduction = [];
      for(var k=0; k<rule.production.length; ++k) {
        if(skippedSubset.indexOf(k) == -1) {
          newProduction.push(rule.production[k]);
        }
      }
      
      newRules.push(Rule(rule.name, newProduction));
    }
    
  }
  
  if(newRules.length == 0) {
    return {empty: true, makesEpsilon: makesEpsilon};
  }
  
  newGrammar = Grammar(newRules, newGrammar.start);
  assert(newGrammar.annotateNullables().length == 0, 'Having removed nullables, there are still nullables.');
  
  newGrammar = newGrammar.stripped();
  newGrammar.makesEpsilon = makesEpsilon;
  
  assert(newGrammar.empty || newGrammar.annotateSelfDeriving().length == 0, 'Removing nullables and unit productions did not prevent self-deriving, somehow.');
  
  return newGrammar;
}

}

},{"./assert":2,"./types":7}],2:[function(require,module,exports){
module.exports = function(condition, message) {
  if(!condition) {
    throw new Error(message);
  }
}

},{}],3:[function(require,module,exports){
var assert = require('./assert');
var parser = require('./parser');
var generator = require('./generate');


// Attempts to prove two grammars are different through the magic of fuzzing.
// If it finds a string s which is accepted by one but not the other,
// returns {string: s, acceptedByFirst: boolean} (acceptedByFirst is true if A accepts
// and B rejects, false if A rejects and B accepts. In other cases s is not a witness
// to A and B being different.)
// If no witness is found, returns false. (So you can use this in an `if` if you don't
// care what the witness is.)
// 'count' and 'length' are optional parameters specifying how many strings at each
// length to check and the maximum length of strings to check respectively.
// Default count is 10 and length is 20.
// Ends up wasting some time generating duplicates at low lengths, but whatever.
// TODO: for efficiency, should use the ftables from generator to limit how count at
// a given length
function locatableDifference(A, B, count, length) {
  count = count || 10;
  length = length || 20;
  if(length < 0 || count < 1) return false;
  
  var oldProduceCount = parser.PRODUCECOUNT;
  parser.PRODUCECOUNT = parser.PRODUCEONE;
  
  function witness(s, which) {
    parser.PRODUCECOUNT = oldProduceCount; // found a witness: done, so reset. yeah, probably shouldn't go here.
    return {string: s, acceptedByFirst: which};
  }
  
  var genA = generator(A);
  var genB = generator(B);
  
  for(var n=0; n<length; ++n) {
    // first, check that they both either do or do not produce any strings of this length
    var a = genA(n);
    var b = genB(n);
    if(a === null && b === null) {
      continue; // not gonna get any strings; move on.
    }
    else if(a !== null && b === null) {
      assert(parser.parse(A, a).length === 1, 'Generated a string "' + a + '" which did not parse.');
      return witness(a, true);
    }
    else if(a === null && b !== null) {
      assert(parser.parse(B, b).length === 1, 'Generated a string "' + b + '" which did not parse.');
      return witness(b, false);
    }
    // ok, at least some strings in each.
    // strictly speaking, could compare a and b here, but whatever.
    for(var i=0; i<count; ++i) {
      a = genA(n);
      if(parser.parse(B, a).length !== 1) {
        return witness(a, true);
      }
      
      b = genB(n);
      if(parser.parse(A, b).length !== 1) {
        return witness(b, false);
      }
    }
  }
  
  parser.PRODUCECOUNT = oldProduceCount;
  return false;
}


module.exports.locatableDifference = locatableDifference;
},{"./assert":2,"./generate":4,"./parser":5}],4:[function(require,module,exports){
// taken directly from http://citeseerx.ist.psu.edu/viewdoc/summary?doi=10.1.1.32.8707

var assert = require('./assert');

function sum(l) {
  var out = 0;
  for(var i=0; i<l.length; ++i) {
    out += l[i];
  }
  return out;
}

function choose(l) {
  var total = sum(l);
  if(total == 0) return -1; // no valid options
  var r = Math.random();
  for(var i=0; i<l.length; ++i) {
    var t = l[i]/total;
    if(r < t) return i;
    r -= t;
  }
  console.log('No choices? This shouldn\'t really happen.', r);
  return l.length-1;
}


function generatorFactory(grammar) {
  grammar = grammar.deNulled();
  if(!grammar.empty && grammar.annotateSelfDeriving().length > 0) {
    throw Error('Generator does not work when there are infinitely many parses for a string. (ie, when A*=>A is possible.)');
  }


  var ftable = {};
  function f(sym, n) {
    if(!(sym in ftable)) {
      ftable[sym] = {};
    }
    if(n in ftable[sym]) {
      return ftable[sym][n];
    }
  
    var out = [];
    for(var j=0; j<grammar.symbolMap[sym].rules.length; ++j) {
      out.push(sum(fprime(sym, j, 0, n)));
    }
  
    ftable[sym][n] = out;
    return out;
  }

  var fprimetable = {};
  function fprime(sym, j, k, n) {
    if(n == 0) return [];
  
    if(!(sym in fprimetable)) {
      fprimetable[sym] = {};
    }
    if(!(j in fprimetable[sym])) {
      fprimetable[sym][j] = {};
    }
    if(!(k in fprimetable[sym][j])) {
      fprimetable[sym][j][k] = {};
    }
    if(n in fprimetable[sym][j][k]) {
      return fprimetable[sym][j][k][n];
    }
  
    var x = grammar.symbolMap[sym].rules[j].production[k];
    var tij = grammar.symbolMap[sym].rules[j].production.length-1;
    var out;
    if(x.type == 'T') {
      if(k == tij) { // basically, if we are being asked about the last symbol
        if(n == 1) { // paper has n=0. pretty sure that's a typo.
          out = [1];
        }
        else {
          out = [0];
        }
      }
      else {
        out = [sum(fprime(sym, j, k+1, n-1))];
      }
    }
    else {
      if(k == tij) {
        out = [sum(f(x.data, n))];
      }
      else {
        out = [];
        for(var l=1; l<=n-tij+k; ++l) {
          out.push(sum(f(x.data, l)) * sum(fprime(sym, j, k+1, n-l)));
        }
      }
    }
  
    fprimetable[sym][j][k][n] = out;
    return out;
  }



  function g(sym, n) {
    var r = choose(f(sym, n));
    if(r == -1) return null; // no valid options
    return gprime(sym, r, 0, n);
  }


  function gprime(sym, j, k, n) {
    var x = grammar.symbolMap[sym].rules[j].production[k];
    //console.log(sym, j, k, n, x)
    var tij = grammar.symbolMap[sym].rules[j].production.length-1;
  
    if(x.type == 'T') {
      if(k == tij) {
        return x.data;
      }
      else {
        return x.data + gprime(sym, j, k+1, n-1);
      }
    }
    else {
      if(k == tij) {
        return g(x.data, n);
      }
      else {
        var l = choose(fprime(sym, j, k, n)); // paper has i, i, k, n. pretty sure that's a typo
        assert(l !== -1, "Couldn't find a valid choice.");
        return g(x.data, l+1) + gprime(sym, j, k+1, n-(l+1)); // l is a length, not an index
      }
    }
  }


  function generate(n) {
    if(n == 0) {
      return grammar.makesEpsilon?'':null;
    }
    if(grammar.empty) {
      return null;
    }
    return g(grammar.start, n);
  }
  
  // TODO probably get rid of this.
  // determine if there are any strings in the grammar of length in [start, start+range)
  // returns such an n, if one exists, or -1 if none exist, or -2 if the language is {''},
  // or -3 if the language is the empty set.
  // by default, start=0, range=10
  generate.findLength = function(start, range) {
    if(grammar.empty) {
      return grammar.makesEpsilon?-2:-3;
    }
    start = start || 0;
    range = range || 10;

    if(start == 0 && grammar.makesEpsilon) {
      return 0;
    }

    for(var n=start; n<start+range; ++n) {
      if(choose(f(grammar.start, n)) !== -1) {
        return n;
      }
    }
    
    return -1;
  }
  
  // In the range [start, start+range), which lengths are possible?
  // Returns null if the grammar is empty.
  // TODO could also tell people when the only possibility is the empty string...
  generate.findLengths = function(start, range) {
    start = start || 0;
    range = range || 10;
    if(grammar.empty) {
      if(!grammar.makesEpsilon) {
        return null;
      }
      else {
        return start == 0 ? [0]:[];
      }
    }
    
    var lengths = [];
    if(start == 0) {
      if(grammar.makesEpsilon) {
        lengths.push(0);
      }
      start = 1;
    }
    
    for(var length = start; length<start+range; ++length) {
      if(choose(f(grammar.start, length)) !== -1) {
        lengths.push(length);
      }
    }
    
    return lengths;
  }
  
  return generate;
}


module.exports = generatorFactory;
},{"./assert":2}],5:[function(require,module,exports){
// http://cs.stackexchange.com/questions/40965/cfgs-detecting-infinitely-many-derivations-of-a-single-string
// http://www.cs.laurentian.ca/jdompierre/html/MATH2056E_W2011/cours/s8.4_closures_relations_BW.pdf
// https://a2c2a.wordpress.com/2014/09/18/implementing-an-earley-parser-that-handles-nullable-grammars-and-draws-all-unique-parse-trees-in-python/
// http://web.stanford.edu/~crwong/cfg/grammar.html
// http://en.wikipedia.org/wiki/Floyd%E2%80%93Warshall_algorithm


var assert = require('./assert');
var types = require('./types');
require('./algorithms')(types.Grammar);

var parser = {};

var enums = {
  DISTINCT: {},
  SIMILAR: {},
  IDENTICAL: {}, // ie, same rule, index, and predecessor, but different sub-parses
  PRODUCEONE: {},
  PRODUCETWO: {},
  PRODUCEALL: {}
}
parser.PRODUCEONE = enums.PRODUCEONE;
parser.PRODUCETWO = enums.PRODUCETWO;
parser.PRODUCEALL = enums.PRODUCEALL;



parser.PRODUCECOUNT = enums.PRODUCETWO;

// TODO this is not the best way of doing this.
NT = types.NT;
T = types.T;
Rule = types.Rule;
Grammar = types.Grammar;


// library code, woo
function arraysEqual(a, b) {
  if(a === b) return true;
  if(a == null || b == null) return false;
  if(a.length != b.length) return false;
  for(var i = 0; i < a.length; ++i) {
    if(a[i] !== b[i]) return false;
  }
  return true;
}




// a State in an Earley parse is a tuple (rule, index, predecessor, backPointers)
// Conceptually, a State is a possibly-partial sub-parse of some part of the string.
// 'rule' is the rule which this state is a (possibly partial) parse of
// 'index' is how far along in the rule's production this state is
// 'predecessor' is the index in the string-being-parsed at which this rule began
// 'backPointers' is the children of this rule, essentially: that is,
//   when index > 0, index has been pushed along by a series of sub-parses completing,
//   each sub-parse representing a terminal or nonterminal in this rule's production.
//   backPointers is an array containing those completed sub-parses/States.
//   in particular, backPointers[i] is the State object corresponding to
//   rule.production[i] (or null if said production is a terminal).
// TODO rename backPointers, do away with index
// TODO have 'c' instead of null for terminals in backPointers
function State(rule, index, predecessor, backPointers) {
  if(!(this instanceof State)) return new State(rule, index, predecessor, backPointers);
  this.rule = rule;
  this.index = index;
  this.predecessor = predecessor;
  this.backPointers = backPointers || [];
  assert(this.index == this.backPointers.length); // honestly could just do away with index at this point
}
State.prototype.done = function(){ return this.index === this.rule.production.length; }
State.prototype.compare = function(other) {
  if(this.rule === other.rule
  && this.index === other.index
  && this.predecessor === other.predecessor) {
    if(arraysEqual(this.backPointers, other.backPointers)) {
      return enums.IDENTICAL;
    }
    else {
      return enums.SIMILAR;
    }
  }
  else {
    return enums.DISTINCT;
  }
}
State.prototype.next = function(){ return this.rule.production[this.index]; } 
State.prototype.toString = function(){
  return '(' + this.rule.name + ' -> ' + this.rule.production.slice(0, this.index).join('')
          + '*' + this.rule.production.slice(this.index).join('') + ', ' + this.predecessor.toString() + ')';
}







function parse(grammar, str, produceCount) {
  if(typeof str !== 'string') throw Error('Can\'t parse non-string object ' + (typeof str));
  var oldProduceCount = parser.PRODUCECOUNT;
  if(produceCount) {
    parser.PRODUCECOUNT = produceCount;
  }
  
  var chart = [];
  for(var i=0; i<=str.length; ++i) chart.push([]);
  
  function seen(state, strPos) {
    var count = 0;
    for(var i=0; i<chart[strPos].length; ++i) {
      var equalness = state.compare(chart[strPos][i]);
      if(equalness == enums.IDENTICAL || (equalness == enums.SIMILAR && parser.PRODUCECOUNT == enums.PRODUCEONE)) { // either we've seen this exact thing before, or we've seen this modulo different parses and don't care about different parses
        return true;
      }
      if(equalness == enums.SIMILAR && parser.PRODUCECOUNT == enums.PRODUCETWO && ++count > 1) { // we've seen something similar and do care
        return true;
      }
    }
    return false;
  }
  
  function scanner(state, strPos) {
    if(state.next().equals(T(str[strPos]))) {
      var newBPs = state.backPointers.slice(0);
      newBPs.push(null); // terminals do not need backpointers, of course
      var advanced = State(state.rule, state.index+1, state.predecessor, newBPs);
      if(!seen(advanced, strPos+1)) {
        chart[strPos+1].push(advanced);
      }
    }
  }
  
  function predictor(state, strPos) {
    var sym = state.next();
    for(var i=0; i<grammar.symbolMap[sym.data].rules.length; ++i) {
      var advanced = State(grammar.symbolMap[sym.data].rules[i], 0, strPos);
      if(!seen(advanced, strPos)) {
        chart[strPos].push(advanced);
      }
    }
    
    // handle silly nullable cornercase: we might need to "re-run" completer for a nullable
    // if we are predicting that nullable but it's already been processed
    // given 'nullable' annotation, we could skip this when 'sym' is not nullable
    for(var i=0; i<chart[strPos].length; ++i) { // can actually abort when we hit current state, but no real need (todo check speedup)
      var candidate = chart[strPos][i];
      if(candidate.rule.name === sym.data && candidate.predecessor === strPos && candidate.done()) {
        var newBPs = state.backPointers.slice(0);
        newBPs.push(candidate); // 'candidate' is already done
        var advanced = State(state.rule, state.index+1, state.predecessor, newBPs);
        if(!seen(advanced, strPos)) {
          chart[strPos].push(advanced);
        }
      }
    }
  }
  
  function completer(state, strPos) {
    var thisSym = NT(state.rule.name);
    for(var i=0; i<chart[state.predecessor].length; ++i) {
      var prevState = chart[state.predecessor][i];
      if(!prevState.done() && thisSym.equals(prevState.next())) {
        var newBPs = prevState.backPointers.slice(0);
        newBPs.push(state); // just finished 'state'
        var advanced = State(prevState.rule, prevState.index+1, prevState.predecessor, newBPs);
        if(!seen(advanced, strPos)) {
          chart[strPos].push(advanced);
        }
      }      
    }
  }
  

  if(parser.PRODUCECOUNT == enums.PRODUCEALL && grammar.annotateSelfDeriving().length !== 0) {
    throw Error('Asked for all parses, but grammar can produce infinitely many parses for some string. Check grammar.annotateSelfDeriving() for specifics.');
  }
    
  
  var startSym = grammar.start;
  var gammaRule = Rule(['GAMMA'], [NT(startSym)]); // needs a _unique_ identifier. Easiest way: new object
  chart[0].push(State(gammaRule, 0, 0));
  
  for(var i=0; i<=str.length; ++i) {
    for(var j=0; j<chart[i].length; ++j) {
      var state = chart[i][j];
      if(!state.done()) {
        if(state.next().type == 'NT') {
          predictor(state, i);
        }
        else {
          scanner(state, i);
        }
      }
      else {
        completer(state, i);
      }
    }
  }

  // done constructing chart; time to find parses
  var parses = [];
  for(var i=0; i<chart[str.length].length; ++i) {
    var state = chart[str.length][i];
    if(state.rule === gammaRule && state.done()) {
      parses.push(state);
    }
  }
  
  parser.PRODUCECOUNT = oldProduceCount;
  return parses;
}

parser.parse = parse;



module.exports = parser;

},{"./algorithms":1,"./assert":2,"./types":7}],6:[function(require,module,exports){
var INDENT = '  ';
function subtreePrinter(state, depth) {
  depth = depth | 0;
  var prefix = '';
  for(var i=0; i<depth; ++i) {
    prefix += INDENT;
  }
  console.log(prefix + state.rule)// + ' ' + state.backPointers.length);
  prefix += INDENT;
  for(var i=0; i<state.backPointers.length; ++i) {
    var backPointer = state.backPointers[i];
    if(backPointer === null) { // ie, terminal
      console.log(prefix + state.rule.production[i].data); 
    }
    else {
      subtreePrinter(backPointer, depth+1);
    }
  }
}


function rewritePrinter(parse) {
  var str = [parse];
  
  function formatIntermediateString(highlightIndex) { // highlightIndex must be a state, not a final symbol
    var o = '';
    for(var i=0; i<str.length; ++i) {
      if(i == highlightIndex) {
        o += '*' + str[i].rule.name + '*';
      }
      else {
        if(typeof str[i] === 'string') {
          o += str[i];
        }
        else {
          o += str[i].rule.name;
        }
      }
    }
    return o;
  }
  
  for(var i = 0; i<str.length; ++i) { // NB: both str.length and i change within the rewrite
    if(typeof str[i] === 'string') {
      continue;
    }
    
    var state = str[i];
    var out = state.rule.toString() + '  |  ';
    out += formatIntermediateString(i) + '  |  ';
    
    var rewritten = [];
    for(var j=0; j<state.index; ++j) {
      if(state.rule.production[j].type == 'T') {
        rewritten.push(state.rule.production[j].data);
      }
      else {
        rewritten.push(state.backPointers[j]);
      }
    }
    str = str.slice(0, i).concat(rewritten).concat(str.slice(i+1));
    out += formatIntermediateString(-1);
    console.log(out);
    --i; // gotta reprocess the index we just rewrote
  }
  
}


function astPrinter(parse, collapseUnitProductions, discardImplicitTerminals, ruleRenamingFunction) {
  // collapseUnitProductions defaults to false. If true, rules of the form X->Y will not generate an additional level in the AST.
  // discardImplicitTerminals: if a production contains both terminals and nonterminals, children does not contain the terminals.
  // ruleRenamingFunction should be a function from Rules in the grammar to names of rules (e.g. strings), which will then be used as the 'type' of nodes. If not present, 'type' will be the Rule itself.
  // Non-terminals in the resulting AST have 'type' and 'children' properties, with 'children' being an array. Terminals have type 'Terminal' and a 'value' property containing their value.
  
  var rename = typeof ruleRenamingFunction === 'function';
  
  function backPointerToSubtree(bp) {
    if (collapseUnitProductions && bp.backPointers.length === 1) {
      var child = bp.backPointers[0];
      if (child === null) {
        return {
          type: 'Terminal',
          value: bp.rule.production[0].data
        };
      } else {
        return backPointerToSubtree(child);
      }
    }
    var tree = {
      type: rename ? ruleRenamingFunction(bp.rule) : bp.rule,
      children: []
    }
    var keepTerminals = !(discardImplicitTerminals && bp.backPointers.some(function(c){return c!== null;}));
    for (var i = 0; i<bp.backPointers.length; ++i) {
      var current = bp.backPointers[i];
      if (current === null) {
        if (keepTerminals) {
          tree.children.push({
            type: 'Terminal',
            value: bp.rule.production[i].data
          });
        }
      } else {
        tree.children.push(backPointerToSubtree(current));
      }
    }
    return tree;
  }
  return backPointerToSubtree(parse.backPointers[0]);
}


// Helper for domRule and domGrammar
// Returns a span representing a RHS.
function domProduction(production) {
  var o = document.createElement('span');
  if(production.length == 0) {
    o.appendChild(document.createTextNode('\u025B')); // epsilon
  }
  else {
    for(var i=0; i<production.length; ++i) {
      if(production[i].type == 'T') {
        o.appendChild(document.createTextNode(production[i].data));
      }
      else {
        var sp = document.createElement('span');
        sp.className = 'cfg-symbol';
        sp.appendChild(document.createTextNode(production[i].data));
        o.appendChild(sp);
      }
    }
  }
  return o;
}

// helper for domPrinter
// create a DOM node representing the rule. obviously only call in browsers.
// symbols get class cfg-symbol, the rule itself class cfg-rule.
function domRule(rule) {
  var o = document.createElement('span');
  o.className = 'cfg-rule';
  
  var sp = document.createElement('span');
  sp.className = 'cfg-symbol';
  sp.appendChild(document.createTextNode(rule.name));
  o.appendChild(sp);
  o.appendChild(document.createTextNode(' \u2192 ')); // right arrow
  
  o.appendChild(domProduction(rule.production));
    
  return o;
}

// create a DOM table representing the entire parse. obviously only call in browsers.
function domPrinter(parse) {
  var str = [parse];
  
  function formatIntermediateString(highlightStart, highlightLength) {
    if(typeof highlightLength !== 'number' || highlightLength < 0) highlightLength = 1;
    
    var o = document.createElement('span');
    c = o;
    for(var i=0; i<str.length; ++i) {
      if(i == highlightStart) {
        c = document.createElement('span');
        c.className = 'cfg-rewrite';
        o.appendChild(c);
      }
      
      if(i - highlightStart >= highlightLength) {
        c = o;
      }
      
      if(typeof str[i] === 'string') {
        c.appendChild(document.createTextNode(str[i]));
      }
      else {
        var sp = document.createElement('span');
        sp.className = 'cfg-symbol';
        sp.appendChild(document.createTextNode(str[i].rule.name));
        c.appendChild(sp);
      }
    }
    return o;
  }

  var out = document.createElement('table');
  out.className = 'cfg-derivations derivations'; // TODO second is for compat
  out.innerHTML = '<thead><tr><th>Rule</th><th>Application</th><th>Result</th></tr></thead>';
  
  
  // handle GAMMA state specially
  var row = document.createElement('tr');
  var cell = document.createElement('td');
  var sp = document.createElement('sp');
  sp.className = 'cfg-rule';
  sp.innerHTML = 'Start \u2192 ' + '<span class="cfg-symbol">' + parse.backPointers[0].rule.name + '</span>';
  cell.appendChild(sp);
  row.appendChild(cell);

  cell = document.createElement('td');
  var sp = document.createElement('span');
  sp.className = 'cfg-start';
  sp.appendChild(document.createTextNode('Start'));
  cell.appendChild(sp);
  row.appendChild(cell);
  
  str = [parse.backPointers[0]]; // ie, start symbol
  cell = document.createElement('td');
  cell.appendChild(formatIntermediateString(-1));
  row.appendChild(cell);
  
  out.appendChild(row);

  
  for(var i = 0; i<str.length; ++i) { // NB: both str.length and i change within the body of the loop
    if(typeof str[i] === 'string') {
      continue;
    }
    
    var state = str[i];

    var row = document.createElement('tr');
    var cell = document.createElement('td');
    cell.appendChild(domRule(state.rule));
    row.appendChild(cell);
  
    cell = document.createElement('td');
    cell.appendChild(formatIntermediateString(i));
    row.appendChild(cell);
    

    
    var rewritten = [];
    for(var j=0; j<state.index; ++j) {
      if(state.rule.production[j].type == 'T') {
        rewritten.push(state.rule.production[j].data);
      }
      else {
        rewritten.push(state.backPointers[j]);
      }
    }
    str = str.slice(0, i).concat(rewritten).concat(str.slice(i+1));

    cell = document.createElement('td');
    cell.appendChild(formatIntermediateString(i, rewritten.length));
    row.appendChild(cell);
    out.appendChild(row);

    --i; // gotta reprocess the index we just rewrote
  }
  
  return out;
}



function escapeHTML(str) {
  // not my preferred solution, but whatever.
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

// create a DOM div representing the entire parse. obviously only call in browsers.
function domGrammarPrinter(grammar) {
  var o = document.createElement('div');
  var line = document.createElement('span');
  line.innerHTML = 'Start symbol: <span class="cfg-symbol">' + escapeHTML(grammar.start) + '</span>';
  o.appendChild(line);
  o.appendChild(document.createElement('br'));
  
  for(var i=0; i<grammar.symbolsList.length; ++i) {
    var sym = grammar.symbolsList[i];
    line = document.createElement('span');
    var sp = document.createElement('span');
    sp.className = 'cfg-symbol';
    sp.appendChild(document.createTextNode(sym));
    line.appendChild(sp);
    line.appendChild(document.createTextNode(' \u2192 '));
    for(var j=0; j<grammar.symbolMap[sym].rules.length; ++j) {
      if(j > 0) {
        line.appendChild(document.createTextNode(' | '));
      }
      var rule = grammar.symbolMap[sym].rules[j];
      line.appendChild(domProduction(rule.production));
    }
    o.appendChild(line);
    o.appendChild(document.createElement('br'));
  }
  
  return o;
}


module.exports = {
  subtreePrinter: subtreePrinter,
  rewritePrinter: rewritePrinter,
  astPrinter: astPrinter,
  domPrinter: domPrinter,
  domGrammarPrinter: domGrammarPrinter
}
},{}],7:[function(require,module,exports){
function Sym(type, data) {
  this.type = type;
  this.data = data; 
}
Sym.prototype.equals = function(other) {
  return other.type === this.type && other.data === this.data;
}
Sym.prototype.toString = function(){ 
  return this.data.toString(); //return this.type + '(' + this.data + ')';
}

function NT(data) { return new Sym('NT', data); }
function T(data) { return new Sym('T', data); }

function reprEscape(str) { // does not handle unicode or exceptional cases properly.
  return str.replace(/['\\]/g, function(c) { return '\\' + c; })
    .replace(/\n/g, '\\n').replace(/\r/g, '\\r');
}

function Rule(name, production) {
  if(!(this instanceof Rule)) return new Rule(name, production);
  this.name = name; // LHS
  this.production = production; // RHS\
}
Rule.prototype.equals = function(other) {
  if(other.name !== this.name) return false;
  if(other.production.length !== this.production.length) return false;
  
  for(var i=0; i<other.production.length; ++i) {
    if(!other.production[i].equals(this.production[i])) return false;
  }
  return true;
}
Rule.prototype.toString = function() {
  return this.name + ' -> ' + this.production.join('');
}
Rule.prototype.repr = function() {
  var out = 'Rule(\'' + reprEscape(this.name) + '\', [';
  for(var i=0; i<this.production.length; ++i) {
    if(i>0) out += ', ';
    out += this.production[i].type + '(\'' + reprEscape(this.production[i].data) + '\')';
  }
  out += '])';
  return out;
}




function Grammar(rules, start) { // if not given, start is LHS of the first rule.
  if(!(this instanceof Grammar)) return new Grammar(rules, start);
  this.rules = rules;
  this.start = start || rules[0].name; // TODO warn
  this.symbolMap = {}; // initially just rules for each symbol; eventually can contain annotations like 'nullable'
  this.symbolsList = start?[start]:[];
  
  if(start) this.symbolMap[start] = {rules: []};
  
  for(var i=0; i<this.rules.length; ++i) {
    var sym = this.rules[i].name;
    if(!(sym in this.symbolMap)) {
      this.symbolMap[sym] = {rules: []};
      this.symbolsList.push(sym);
    }
    
    for(var j=0; j<this.rules[i].production.length; ++j) {
      var rhsSym = this.rules[i].production[j];
      if(rhsSym.type == 'NT' && !(rhsSym.data in this.symbolMap)) {
        this.symbolMap[rhsSym.data] = {rules: []};
        this.symbolsList.push(rhsSym.data);
      }
    }
    this.symbolMap[sym].rules.push(this.rules[i]);
  }
}
Grammar.prototype.repr = function() {
  var out = 'Grammar([\n  ';
  for(var i=0; i<this.rules.length; ++i) {
    if(i>0) out += ',\n  ';
    out += this.rules[i].repr();
  }
  out += '\n], \'' + reprEscape(this.start) + '\')';
  return out;
}


// get a map from symbols to a list of the rules they appear in the RHS of
// if a symbol appears in a RHS more than once, that rule will appear more than once in the list
// modifies the grammar to have _reverseMap property, for caching
Grammar.prototype.getReverseMap = function() {
  if(!this.hasOwnProperty('_reverseMap')) {
    this._reverseMap = {};
    for(var i=0; i<this.symbolsList.length; ++i) {
      this._reverseMap[this.symbolsList[i]] = [];
    }
    for(var i=0; i<this.rules.length; ++i) {
      var rule = this.rules[i];
      for(var j=0; j<rule.production.length; ++j) {
        if(rule.production[j].type === 'NT') {
          this._reverseMap[rule.production[j].data].push(rule);
        }
      }
    }
  }
  
  return this._reverseMap;
}



module.exports = {
  Sym: Sym,
  NT: NT,
  T: T,
  Rule: Rule,
  Grammar: Grammar
}
},{}],8:[function(require,module,exports){
module.exports = exports = {
  types: require('./types'),
  generator: require('./generate'),
  parser: require('./parser'),
  checks: require('./check'),
  printers: require('./printers')
}

},{"./check":3,"./generate":4,"./parser":5,"./printers":6,"./types":7}]},{},[8]);
