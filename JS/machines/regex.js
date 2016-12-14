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
		
		var nfa = RegexParser.parse(str_regex);
		var i = 0;
		
		for (var state in nfa.states) {
			i++;
			
			if(i==1){
				initialNode.text = state;
				alert(initialNode.text);
			}
		
			console.group(state);
			
			for (var transition in nfa.states[state].transitions) {
			var destinations = nfa.states[state].transitions[transition].map(function(item) {
				return item.label;
			}).join(', ');
			console.log(transition + ' : ' + destinations);
			}
			
			if (nfa.states[state].final) {
				finalNodes.push({'text':state});
				alert("final"+finalNodes[0].text);
				//console.log('-- final state');
			}
			console.groupEnd();
		}
		
		
		
	}else{
		vizText = "digraph g {node [shape=\"circle\"]; start [shape=Msquare]; start -> \"{0}\"; \"{0}\" [peripheries=2]; }";
		$('#modal_Title1').text('NFA');
		$('#modal_Title2').text('DFA');
        $("#vizGraphBefore").html(Viz(vizText, { format: "svg" }));
        $("#vizModal").modal();
	}
}