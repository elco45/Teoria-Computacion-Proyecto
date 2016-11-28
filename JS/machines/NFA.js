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
        if(isAccepted == stringToConsume.length){
                swal("Nice!", "Cadena Aceptada", "success");
        }else{
               swal("Opps", "Cadena Rechazada", "error");
        }

        $('#str_cadena').val('');
    }
};

function recursiveConsume(Transitions, NextNode, ActualPosString, LengthString, StringToConsume){
    if(ActualPosString == LengthString && Transitions[NextNode].node.isAcceptState){
       return ActualPosString;
    }
    for(var i = 0; i < Transitions[NextNode].links.length; i++){
        if(Transitions[NextNode].links[i].symbol === StringToConsume.charAt(ActualPosString)){
            var t = recursiveConsume(Transitions, Transitions[NextNode].links[i].node.idNext, ActualPosString+1, LengthString, StringToConsume);
            if(t == LengthString){
                return t
            }
        }else if(Transitions[NextNode].links[i].symbol === '#'){
            var t = recursiveConsume(Transitions, Transitions[NextNode].links[i].node.idNext, ActualPosString, LengthString, StringToConsume);
            if(t == LengthString){
                return t
            }
        }
    }
}

function validateNFA(){
    if(typeof getInitialNode().idNext=='undefined'){
        $('#str_validate').text('No se ha definido un estado inicial');
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