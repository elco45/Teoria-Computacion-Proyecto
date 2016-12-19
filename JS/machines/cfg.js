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
	
};