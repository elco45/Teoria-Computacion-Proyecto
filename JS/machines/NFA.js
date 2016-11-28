function NFAtoDFA() {        
    var trans = getTransition();
    var init = getInitialNode();
    var fin = getFinalNodes();
    console.log(trans);
    console.log(init);
    console.log(fin)
    $("#vizGraph").html(drawGraph(init, trans, fin));
    $("#vizModal").modal();
};  

function consumeStringNFA(){    


    if(validateNFA()){
        var stringToConsume = $('#str_cadena').val();
        console.log(getInitialNode().idNext);
        var isAccepted = recursiveConsume(getTransition(),getInitialNode().idNext,0,stringToConsume.length,stringToConsume);
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

var recursiveConsume = function(Transitions, NextNode, ActualPosString, LengthString, StringToConsume){
    console.log(NextNode);
    console.log(ActualPosString);
    console.log(LengthString);
    console.log("--------------");
    if(ActualPosString == LengthString){
       return Transitions[NextNode].node;
    }
    for(var i = 0; i < Transitions[NextNode].links.length; i++){
        console.log(i)
        if(Transitions[NextNode].links[i].symbol === StringToConsume.charAt(ActualPosString)){
            return recursiveConsume(Transitions, Transitions[NextNode].links[i].node.idNext, ActualPosString+1, LengthString, StringToConsume);
        }else if(Transitions[NextNode].links[i].symbol === '#'){
            return recursiveConsume(Transitions, Transitions[NextNode].links[i].node.idNext, ActualPosString, LengthString, StringToConsume);
        }
    }
}

function validateNFA(){
     console.log(getInitialNode());
     console.log("Que putas");
    if(getInitialNode()==null){
        $('#str_validate').val('No se ha definido un estado inicial');
        return false;
    }else{

        return true;
    }



};

function sendMessage(){



};

function E(node){    
    
};

var recursiveFindE = function(Transitions, NextNode, ArrayE){    
    
};