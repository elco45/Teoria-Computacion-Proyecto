function consumeStringDFA(){
	var Transitions = getTransition();
	if(validateAutomataEstructure()){
		if(!Ambiguos(Transitions)){
		    $('#str_validate').text('DFA definido'); 	
		    var stringToConsume = $('#str_cadena').val();
		    var trans = getTransition();
		    var route = new Array();
			var isAccepted = recursiveConsumeDFA(trans,getInitialNode().idNext,0,stringToConsume.length,stringToConsume,0,route);
		    if(isAccepted){
		        if(isAccepted.node.isAcceptState){
		        	
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
		}else{
			$('#str_validate').text('No puede existir Abmiguedad en un DFA'); 	
		}
	}
};

function addAnimation(link, time,color, last) {
    setTimeout(function() {
        link.changeColor(color);
    }, 250 * time);
    setTimeout(function() {
        link.changeColor('black');
    }, 300 * time);
    if(last){
        setTimeout(function() {
            swal("Nice!", "Cadena Aceptada", "success");
        }, 300 * time);
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


function DFAtoREGEX(){
	var Transitions= getTransition();
 if(validateAutomataEstructure()){
 	if(!Ambiguos(Transitions)){
	            $('#str_validate').text('NFA definido'); 
	            var Transitions = getTransitionNoSplit();
	            var InitialNode = getInitialNode();
	            var FinalNodes = getFinalNodes();
	            var ArrayE = new Array;
	            var tempArrayE = new Array;
	            var Childs=0;
	            var Nodes = getNodes();
	            JoinTransitions(Transitions);
	            selfTransitios(Transitions);   
	            console.log(Transitions);

	            graph =new Graph(); // creates a graph
	            for(var i=0; i<Nodes.length;i++){

	               node=graph.addNode(Transitions[i].node.text);

	            }

	            for(var X=0; X<graph.NODES.length;X++){
	                for(var i=0; i<Transitions.length;i++){
	                    if(graph.NODES[X].name==Transitions[i].node.text){
	                         for(var j=0;j<Transitions[i].links.length;j++){           
	                                graph.NODES[i].addEdge(Transitions[i].links[j].node.text,Transitions[i].links[j].symbol);
	                         }
	                    }
	                }

	            }
	            console.log(graph);
	            console.log(graph.NODES.length);     
	            var Expression="";
	            if(FinalNodes.length==1){
	                //Only one Final states
	                for(var i=0;i<graph.NODES.length;i++){
	                    for(var j=0;j<graph.NODES[i].weight.length;j++){
	                        Expression+=graph.NODES[i].weight[j];
	                    }

	                    
	                }

	                console.log(Expression);
	                $('#str_expresion').text(Expression);
	                Expression="";
	            }else{

	                console.log("NODE PODERS");
	            }

	   }else{
			$('#str_validate').text('No puede existir Abmiguedad en un DFA'); 
	   }
	}
};

function getAllPaths(Transitions, Node,NextNode, ArrayE,InitialNode,FinalNode,tempArrayE,Childs){
    console.log("Estoy en NODO: "+Node.text);
    for(var i=0; i<Transitions[NextNode].links.length;i++){
        if(Transitions[NextNode].links[i].node.marked==false &&Transitions[NextNode].links[i].node.text!=Node.text){
            console.log("No carmado");
            console.log(Transitions[NextNode].links[i].node.text);
                if(!arrayContains(Transitions[NextNode].links[i].node.text),tempArrayE){
                    tempArrayE.push(Transitions[NextNode].links[i].node.text);                    
                    var SaveStates= getAllPaths(Transitions, Transitions[Transitions[NextNode].links[i].node.idNext].node,Transitions[NextNode].links[i].node.idNext, ArrayE,InitialNode,FinalNode,tempArrayE,Childs);
                    if(SaveStates!=null){
                        return SaveStates;
                    }                   
                }
  
            }else{
                console.log("Nodo Ya marcado");
            }

         Transitions[NextNode].node.setMarked(true);
            
     
    }
    if(Transitions[NextNode].node.text==FinalNode.text){
        tempArrayE.push(InitialNode.text);
        tempArrayE= NoDuplicates(tempArrayE);
        ArrayE.push(tempArrayE);
        tempArrayE= new Array;
    }


};

function JoinTransitions(Transitions){
    var newString="";
    var Split =null;
    for(var i =0 ; i<Transitions.length;i++){
        console.log(Transitions[i]);
        for(var k=0; k<Transitions[i].links.length;k++){
            Split=Transitions[i].links[k].symbol.split(",");
            if(Split.length>1){
                for(var j=0; j<Split.length;j++){
                    newString+=Split[j]+"+";
                }
                newString=newString.slice(0, -1);
                Transitions[i].links[k].symbol="("+newString+")";
                newString="";   
            }
        }
    }

};

function selfTransitios(Transitions){

    for(var i =0 ; i<Transitions.length;i++){
        for(var k=0; k<Transitions[i].links.length;k++){
            if(Transitions[i].links[k].node.text==Transitions[i].node.text){
                Transitions[i].links[k].symbol=Transitions[i].links[k].symbol+"*";   
            }
        }
    }

};