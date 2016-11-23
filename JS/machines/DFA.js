function consumeStringDFA(){    
    var stringToConsume = $('#cadena').val();
	var isAccepted = recursiveConsumeDFA(getTransition(),getInitialNode().idNext,0,stringToConsume.length,stringToConsume,0);
	if(isAccepted){
		if(isAccepted.isAcceptState){
			alert("Aceptada");
		}else{
			alert("Rechazada");
		}
	}else{
			alert("Rechazada");
	}
};

var recursiveConsumeDFA = function(Transitions, NextNode, ActualPosString, LengthString, StringToConsume, LinkPos){
    if(ActualPosString === LengthString){
        return Transitions[NextNode].node;
    }else{
        console.log(Transitions[NextNode])
        if(Transitions[NextNode].links[LinkPos].symbol === StringToConsume.charAt(ActualPosString)){
            return recursiveConsumeDFA(Transitions, Transitions[NextNode].links[LinkPos].node.idNext,ActualPosString+1,LengthString,StringToConsume,0);
        }else{
            if(LinkPos >= Transitions[NextNode].links.length){
                return recursiveConsumeDFA(Transitions, NextNode, LengthString, LengthString, StringToConsume,LinkPos );
            }else{
                return recursiveConsumeDFA(Transitions, NextNode, ActualPosString, LengthString, StringToConsume, LinkPos+1);
            }
        }
    }
}