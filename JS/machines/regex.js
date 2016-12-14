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
	
}

function regexToNFA(){
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
			$('#modal_Title1').text('NFA');
			$('#modal_Title2').text('DFA');
			$("#vizGraphBefore").html(result); 
		  } catch(e) {
			$("#vizGraphBefore").html(e);
		  }
		$("#vizModal").modal();
		
		
	}else{
		vizText = "digraph g {node [shape=\"circle\"]; start [shape=Msquare]; start -> \"{0}\"; \"{0}\" [peripheries=2]; }";
		$('#modal_Title1').text('NFA');
		$('#modal_Title2').text('DFA');
        $("#vizGraphBefore").html(Viz(vizText, { format: "svg" }));
        $("#vizModal").modal();
	}
}