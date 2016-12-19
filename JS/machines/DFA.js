function consumeStringDFA(){
	if(validateAutomataEstructure()){
	    $('#str_validate').text('DFA definido'); 	
	    var stringToConsume = $('#str_cadena').val();
	    var trans = getTransition();
	    var route = new Array();
		var isAccepted = recursiveConsumeDFA(trans,getInitialNode().idNext,0,stringToConsume.length,stringToConsume,0,route);
	    if(isAccepted){
	        if(isAccepted.node.isAcceptState){
	        	console.log(isAccepted.route)
	            for(var i = 0; i < isAccepted.route.length; i++){
                    if(i == isAccepted.route.length-1){
                        addAnimation(isAccepted.route[i].links,(i+1)*7,'red',true);
                    }else{
                        addAnimation(isAccepted.route[i].links,(i+1)*7,'red',false);
                    }
                }
	        }else{
	            swal("Opps!", "Cadena Rechazada", "error");
	        }
	    }else{
	          
	           swal("Opps", "Cadena Rechazada", "error");
	    }
		$('#str_cadena').val('');
	}
};

function addAnimation(link, time,color, last) {
    setTimeout(function() {
        link.changeColor(color);
    }, 300 * time);
    setTimeout(function() {
        link.changeColor('black');
    }, 400 * time);
    if(last){
        setTimeout(function() {
            swal("Nice!", "Cadena Aceptada", "success");
        }, 400 * time);
    }
};

var recursiveConsumeDFA = function(Transitions, NextNode, ActualPosString, LengthString, StringToConsume, LinkPos, Route){
	var routes = Route.concat();
    if(ActualPosString === LengthString){
    	var ans = {
            'route': routes,
            'node': Transitions[NextNode].node,
        }
        return ans;
    }else{
		if(Transitions[NextNode].links[LinkPos]){
			if(Transitions[NextNode].links[LinkPos].symbol === StringToConsume.charAt(ActualPosString)){
				routes.push(Transitions[NextNode].links[LinkPos]);
				return recursiveConsumeDFA(Transitions, Transitions[NextNode].links[LinkPos].node.idNext,ActualPosString+1,LengthString,StringToConsume,0, routes);
			}else{
				if(LinkPos >= Transitions[NextNode].links.length){
					return recursiveConsumeDFA(Transitions, NextNode, LengthString, LengthString, StringToConsume,LinkPos,routes);
				}else{
					return recursiveConsumeDFA(Transitions, NextNode, ActualPosString, LengthString, StringToConsume, LinkPos+1,routes);
				}
			}
		}else{
			return null;
		}
    }
}

function Ambiguos(Transitions){

	
	for(var i=0; i<Transitions.length;i++){
		var veredicto=false;
		var nodeAlphabet= new Array;
		for(var j=0;j<Transitions[i].links.length;j++){
			if(!arrayContains(Transitions[i].links[j].symbol,nodeAlphabet)){
				nodeAlphabet.push(Transitions[i].links[j].symbol);
			}else{
				veredicto=true;
			}

		}
		if(veredicto){
    		return true;
		}

	}
	return false;
};

function DFAtoNFA(){
	var Transitions = getTransition();
	if(validateAutomataEstructure()){
		if(!Ambiguos(Transitions)){
		    $('#str_validate').text('DFA definido'); 
			var trans = getTransition();
		    var init = getInitialNode();
		    var fin = getFinalNodes();
		    $("#modal_Title1").text('Before(DFA)');
		    $("#modal_Title2").text('After(NFA)');
		    $("#vizGraphBefore").html(drawGraphDFA(init, trans, fin));
		    $("#vizGraphAfter").html(drawGraph(init, trans, fin));
		    $("#vizModal").modal();
		    $(".modal-wide").on("show.bs.modal", function() {
			  var height = $(window).height() - 200;
			  $(this).find(".modal-body").css("max-height", height);
			});
		}else{
			$('#str_validate').text('No puede existir Abmiguedad en un DFA'); 
		}
	}
}