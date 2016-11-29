function consumeStringDFA(){

	if(validateAutomataEstructure()){
	    $('#str_validate').text('DFA definido'); 	
	    var stringToConsume = $('#str_cadena').val();
		var isAccepted = recursiveConsumeDFA(getTransition(),getInitialNode().idNext,0,stringToConsume.length,stringToConsume,0);
	    if(isAccepted){
	        if(isAccepted.isAcceptState){
	            swal("Nice!", "Cadena Aceptada", "success");
	        }else{
	            swal("Opps!", "Cadena Rechazada", "error");
	        }
	    }else{
	          
	           swal("Opps", "Cadena Rechazada", "error");
	    }
		$('#str_cadena').val('');
	}
};

var recursiveConsumeDFA = function(Transitions, NextNode, ActualPosString, LengthString, StringToConsume, LinkPos){
    if(ActualPosString === LengthString){
        return Transitions[NextNode].node;
    }else{
		if(Transitions[NextNode].links[LinkPos]){
			if(Transitions[NextNode].links[LinkPos].symbol === StringToConsume.charAt(ActualPosString)){
				return recursiveConsumeDFA(Transitions, Transitions[NextNode].links[LinkPos].node.idNext,ActualPosString+1,LengthString,StringToConsume,0);
			}else{
				if(LinkPos >= Transitions[NextNode].links.length){
					return recursiveConsumeDFA(Transitions, NextNode, LengthString, LengthString, StringToConsume,LinkPos );
				}else{
					return recursiveConsumeDFA(Transitions, NextNode, ActualPosString, LengthString, StringToConsume, LinkPos+1);
				}
			}
		}else{
			return null;
		}
    }
}

function DFAtoNFA(){
	var trans = getTransition();
    var init = getInitialNode();
    var fin = getFinalNodes();
    for(var i = 0; i < trans.length; i++){
    	for(var j =0; j< trans[i].links.length; j++){
    		trans[i].links[j].node.text = "{"+trans[i].links[j].node.text+"}";
    	}	
    }
    for(var i = 0; i < fin.length; i++){
    	fin[i].text = "{"+fin[i].text+"}";
    }
    init.text = "{"+init[i].text+"}";
    $("#vizGraphBefore").html(drawGraph(init, trans, fin));
    $("#vizGraphAfter").html(drawGraph(init, trans, fin));
    $("#vizModal").modal();
}