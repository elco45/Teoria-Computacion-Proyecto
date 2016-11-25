function NFAtoDFA() {        
    var trans = getTransition()
    console.log(trans)
    console.log(getInitialNode());
    console.log(getFinalNodes())
};  

function consumeString(){    
    var stringToConsume = $('#cadena').val();
    console.log( recursiveConsume(getTransition(),getInitialNode().idNext,0,stringToConsume.length,stringToConsume,false,0) )
};

var recursiveConsume = function(Transitions, NextNode, ActualPosString, LengthString, StringToConsume, NoMoreRoutes, j){
    if(ActualPosString == LengthString){
        return true
    }
    for(var i = 0; i < Transitions[NextNode].links.length; i++){
        if(Transitions[NextNode].links[i].symbol === StringToConsume.charAt(ActualPosString)){
            return recursiveConsume(Transitions, Transitions[NextNode].links[i].node.idNext, ActualPosString+1, LengthString, StringToConsume, false+1,j+1)
        }else if(Transitions[NextNode].links[i].symbol === '#'){
            return recursiveConsume(Transitions, Transitions[NextNode].links[i].node.idNext, ActualPosString, LengthString, StringToConsume, false,j)
        }else{
            continue;
        }
    }

}



function E(node){    
    
};  