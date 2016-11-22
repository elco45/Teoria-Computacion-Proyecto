function NFAtoDFA() {        
    var trans = getTransition()
    console.log(trans)
    console.log(getInitialNode());
    console.log(getFinalNodes())
};  

function consumeString(){    
    var stringToConsume = $('#cadena').val();
    console.log( recursiveConsume(getTransition(),getInitialNode().idNext,0,stringToConsume.length,stringToConsume,0,getInitialNode().idNext,0,0,0) )
};

var recursiveConsume = function(Transitions, NextNode, ActualPosString, LengthString, StringToConsume, LinkPos, BeforeNode, BeforeLink, Moved){
    /*console.log(LinkPos)
    console.log(BeforeLink)
    console.log(NextNode)
    console.log(BeforeNode)
    console.log(ActualPosString)
    console.log('---------------------------------------')*/
    if(ActualPosString === LengthString && Transitions[NextNode].node.isAcceptState){
        return Transitions[NextNode].node;
    }else{
        /*console.log(LinkPos)
        console.log(BeforeLink)
        console.log(NextNode)
        console.log(BeforeNode)
        console.log(ActualPosString)
        console.log('---------------------------------------')*/
        
        if(Transitions[NextNode].links[LinkPos] != undefined && (Transitions[NextNode].links[LinkPos].symbol == StringToConsume.charAt(ActualPosString) || Transitions[NextNode].links[LinkPos].symbol == '#' )){
            /*console.log(LinkPos)
        console.log(BeforeLink)
        console.log(NextNode)
        console.log(BeforeNode)
        console.log(ActualPosString)
        console.log('---------------------------------------')*/
            if(Transitions[NextNode].links[LinkPos].symbol === StringToConsume.charAt(ActualPosString)){
                return recursiveConsume(Transitions, Transitions[NextNode].links[LinkPos].node.idNext,ActualPosString+1,LengthString,StringToConsume,0,BeforeNode,LinkPos,Moved+1);
            }else{
                return recursiveConsume(Transitions, Transitions[NextNode].links[LinkPos].node.idNext,ActualPosString,LengthString,StringToConsume,0,BeforeNode,LinkPos,Moved);
            }
            
        }else{
            /*console.log(LinkPos)
        console.log(BeforeLink)
        console.log(NextNode)
        console.log(BeforeNode)
        console.log(ActualPosString)
        console.log('************************************')*/
            if(Transitions[NextNode].links[LinkPos] == undefined || LinkPos >= Transitions[NextNode].links.length){
                if(LinkPos == Transitions[NextNode].links.length){
                   
                    if(Transitions[NextNode].links[Transitions[NextNode].links.length-1].idFather != NextNode){
                        console.log('************************************')
                        console.log(BeforeNode)
                        console.log(NextNode)
                        BeforeNode = Transitions[NextNode].links[Transitions[NextNode].links.length-1].idFather
                        console.log(BeforeNode)
                    }
                    return recursiveConsume(Transitions,BeforeNode,ActualPosString-Moved,LengthString,StringToConsume,BeforeLink+1,BeforeNode,BeforeLink+1,Moved-1)
                }else{
                    return false
                }
            }else{
                /*console.log(LinkPos)
                console.log(BeforeLink)
                console.log(NextNode)
                console.log(BeforeNode)
                console.log(Transitions[NextNode].links[LinkPos])
                console.log(ActualPosString)*/
                return recursiveConsume(Transitions,BeforeNode,ActualPosString,LengthString,StringToConsume,LinkPos+1,BeforeNode,BeforeLink,Moved)
            }
        }
    }
}



function E(node){    
    
};  