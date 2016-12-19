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


function toCNF(){
	var rules =  $('#str_cfg').val().trim().split('\n');
	var myJSON = {};
	
	for(var i = 0; i < rules.length; i++){
		var name = "\""+rules[i].split('->')[0].trim()+"\"";
		
		/*var juuzou = "[";
		var jason = rules[i].split('->')[1].split('|');
		for(var j = 0; j < jason.length; j++){//ayy
			if(j < jason.length-1){
				juuzou = juuzou + "\""+jason[j]+"\""+",";
			}else{
				juuzou = juuzou + "\""+jason[j]+"\"";
			}
		}
		juuzou = juuzou + "]";*/
		
		var juuzou = rules[i].split('->')[1].split('|');
		
		
		for(var j = 0; j < juuzou.length; j++){
			juuzou[j] = juuzou[j].trim();
		}
		console.log(juuzou);
		
		
		myJSON[name] = juuzou;//so meta
	}
	
	console.log(myJSON);
};