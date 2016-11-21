function NFAtoDFA() {        
    var trans = getTransition()
    console.log(trans)
    console.log(getInitialNode());
    console.log(getFinalNodes())
};  

function consumeString(){    
    var stringToConsume = $('#cadena').val();
    console.log( recursiveConsume(getTransition(),getInitialNode().id,0,stringToConsume.length,stringToConsume,0,getInitialNode().id,0,0) )
};

var recursiveConsume = function(Transitions, NextNode, ActualPosString, LengthString, StringToConsume, LinkPos, BeforeNode, BeforeLink, BeforePosString){
    console.log(ActualPosString)
    if(ActualPosString === LengthString && Transitions[NextNode].node.isAcceptState){
        return Transitions[NextNode].node;
    }else{
        /*console.log(LinkPos)
        console.log(NextNode)
        console.log(Transitions[NextNode].links[LinkPos])
        console.log(ActualPosString)*/
        
        if(Transitions[NextNode].links[LinkPos] != undefined && (Transitions[NextNode].links[LinkPos].symbol == StringToConsume.charAt(ActualPosString) || Transitions[NextNode].links[LinkPos].symbol == '#' )){
            if(Transitions[NextNode].links[LinkPos].symbol === StringToConsume.charAt(ActualPosString)){
                return recursiveConsume(Transitions, Transitions[NextNode].links[LinkPos].node.id,ActualPosString+1,LengthString,StringToConsume,0,NextNode,LinkPos,ActualPosString);
            }else{
                return recursiveConsume(Transitions, Transitions[NextNode].links[LinkPos].node.id,ActualPosString,LengthString,StringToConsume,0,NextNode,LinkPos,ActualPosString);
            }
            
        }else{
            if(Transitions[NextNode].links[LinkPos] == undefined || LinkPos >= Transitions[NextNode].links.length){
                return recursiveConsume(Transitions,BeforeNode,BeforePosString,LengthString,StringToConsume,BeforeLink+1,BeforeNode,BeforeLink+1,BeforePosString)
            }else{
                return recursiveConsume(Transitions,NextNode,ActualPosString,LengthString,StringToConsume,LinkPos+1,BeforeNode,BeforeLink,BeforePosString)
            }
        }
    }
}



function E(node){    
    
};  