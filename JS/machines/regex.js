function verifyRegex(){
    var str_regex = new RegExp($('#str_regex').val());
    var str_cadena = $('#str_cadena').val();
    if(str_regex.test(str_cadena)){
    	swal("Nice!", "Cadena Aceptada", "success");
    	$('#str_cadena').val('');
    }else{
    	swal("Opps", "Cadena Rechazada", "error");
    }

}

function regexToDFA(){
	console.log("asdasdas")
	var initialNode = {};
	var finalNodes = [];
    
	var str_regex = $('#str_regex').val();
	if(str_regex){
		
		var regParser = require('regparser');
		var parser = new regParser.RegParser();
		var input = str_regex;
		parser.reset(input);
		try { 
			var nfa = parser.parseToDFA();
			var result = Viz(nfa.toDotScript(), 'svg', 'dot');
			$('#modal_Title3').text('Regex a DFA: ');
			$("#vizGraphRegex").html(result); 
		} catch(e) {
			$("#vizGraphRegex").html(e);
		}
		$("#vizModalRegex").modal();
	}else{
		vizText = "digraph g {node [shape=\"circle\"]; start [shape=Msquare]; start -> \"{0}\"; \"{0}\" [peripheries=2]; }";
		$('#modal_Title3').text('Regex to DFA:');
        $("#vizGraphRegex").html(Viz(vizText, { format: "svg" }));
        $("#vizModalRegex").modal();
	}
}

function regexToNFA(){
	console.log("asdasdas")
	var initialNode = {};
	var finalNodes = [];
    
	var str_regex = $('#str_regex').val();
	if(str_regex){
		
		var regParser = require('regparser');
		var parser = new regParser.RegParser();
		var input = str_regex;
		  parser.reset(input);
		  try { 
			var nfa = parser.parseToNFA();
			var result = Viz(nfa.toDotScript(), 'svg', 'dot');
			$('#modal_Title3').text('Regex a NFA: ');
			$("#vizGraphRegex").html(result); 
		  } catch(e) {
			$("#vizGraphRegex").html(e);
		  }
		$("#vizModalRegex").modal();
		
		
	}else{
		vizText = "digraph g {node [shape=\"circle\"]; start [shape=Msquare]; start -> \"{0}\"; \"{0}\" [peripheries=2]; }";
		$('#modal_Title3').text('Regex to NFA: ');
        $("#vizGraphRegex").html(Viz(vizText, { format: "svg" }));
        $("#vizModalRegex").modal();
	}
}