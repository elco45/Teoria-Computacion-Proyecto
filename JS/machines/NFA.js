function NFAtoDFA() {        
    var trans = getTransition();
    var init = getInitialNode();
    var fin = getFinalNodes();
    console.log(trans);
    console.log(init);
    console.log(fin)
    $("#vizGraphBefore").html(drawGraph(init, trans, fin));
    $("#vizGraphAfter").html(drawGraph(init, trans, fin));
    $("#vizModal").modal();
};  

function consumeStringNFA(){  
    if(validateAutomataEstructure()){
        $('#str_validate').text('NFA definido'); 
        var stringToConsume = $('#str_cadena').val();
        console.log(getInitialNode().idNext);
        var nodeAns = recursiveConsume(getTransition(),getInitialNode().idNext,0,stringToConsume.length,stringToConsume);
        console.log(nodeAns)
        if(nodeAns){
            if(nodeAns.actualPos == stringToConsume.length && nodeAns.node.isAcceptState){
                swal("Nice!", "Cadena Aceptada", "success");
            }else{
                   swal("Opps", "Cadena Rechazada", "error");
            }
        }else{
            swal("Opps", "Cadena Rechazada", "error");
        }
        

        $('#str_cadena').val('');
    }
};


function recursiveConsume(Transitions, NextNode, ActualPosString, LengthString, StringToConsume){
    if(ActualPosString == LengthString && Transitions[NextNode].node.isAcceptState){
        var ans = {
            'actualPos': ActualPosString,
            'node': Transitions[NextNode].node
        }
        return ans;
    }
    for(var i = 0; i < Transitions[NextNode].links.length; i++){
        if(Transitions[NextNode].links[i].symbol === StringToConsume.charAt(ActualPosString)){
            var t = recursiveConsume(Transitions, Transitions[NextNode].links[i].node.idNext, ActualPosString+1, LengthString, StringToConsume);
            if(t){
                if(t.actualPos == LengthString){
                    return t
                }
            }
            
        }else if(Transitions[NextNode].links[i].symbol === '#'){
            var t = recursiveConsume(Transitions, Transitions[NextNode].links[i].node.idNext, ActualPosString, LengthString, StringToConsume);
            if(t){
                if(t.actualPos == LengthString){
                    return t
                }
            }
        }
    }
}




function E(node){    
    
};

function recursiveFindE(Transitions, NextNode, ArrayE){    
    
}