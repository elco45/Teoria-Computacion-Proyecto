function consumeStringPDA(){ 
    //saveBackup()
    var stringToConsume = $('#str_cadena').val();
    var Stack = new Array();
    var nodeAns = recursiveConsumePDA(getTransitionPDA(),getInitialNode().idNext,0,stringToConsume.length,stringToConsume,Stack);
    console.log(nodeAns)
    if(nodeAns){
        if(nodeAns.actualPos == stringToConsume.length && nodeAns.node.isAcceptState && nodeAns.stack.length == 0){
            swal("Nice!", "Cadena Aceptada", "success");
        }else{
            swal("Opps", "Cadena Rechazada", "error");
        }
    }else{
        swal("Opps", "Cadena Rechazada", "error");
    }
    
    $('#str_cadena').val('');
};


function recursiveConsumePDA(Transitions, NextNode, ActualPosString, LengthString, StringToConsume, Stack){
    if(ActualPosString == LengthString && Transitions[NextNode].node.isAcceptState && Stack.length == 0){
        var ans = {
            'actualPos': ActualPosString,
            'node': Transitions[NextNode].node,
            'stack': Stack
        }
        return ans;
    }
    for(var i = 0; i < Transitions[NextNode].links.length; i++){
        //console.log(Transitions[NextNode].links[i])
        if(Transitions[NextNode].links[i].input === StringToConsume.charAt(ActualPosString) && 
        (Transitions[NextNode].links[i].popElement === '#' ||  Transitions[NextNode].links[i].popElement === Stack[Stack.length-1]  )){
            console.log(Transitions[NextNode].links[i].input+","+Transitions[NextNode].links[i].popElement+","+Transitions[NextNode].links[i].pushElement)
            
            if(Transitions[NextNode].links[i].popElement != '#' && Stack[Stack.length-1] === Transitions[NextNode].links[i].popElement){
                Stack.pop();
            }
            if(Transitions[NextNode].links[i].pushElement != '#'){
                Stack.push(Transitions[NextNode].links[i].pushElement)
            }
            var t = recursiveConsumePDA(Transitions, Transitions[NextNode].links[i].node.idNext, ActualPosString+1, LengthString, StringToConsume,Stack);
            if(t){
                if(t.actualPos == LengthString && Stack.length==0 && t.node.isAcceptState){
                    return t
                }
            }
            
        }else if(Transitions[NextNode].links[i].input === '#'){
            console.log(Transitions[NextNode].links[i].input+","+Transitions[NextNode].links[i].popElement+","+Transitions[NextNode].links[i].pushElement)
            if(Transitions[NextNode].links[i].popElement != '#' && Stack[Stack.length-1] === Transitions[NextNode].links[i].popElement){
                Stack.pop();
            }
            if(Transitions[NextNode].links[i].pushElement != '#'){
                Stack.push(Transitions[NextNode].links[i].pushElement)
            }
            var t = recursiveConsumePDA(Transitions, Transitions[NextNode].links[i].node.idNext, ActualPosString, LengthString, StringToConsume,Stack);
            if(t){
                if(t.actualPos == LengthString && Stack.length==0 && t.node.isAcceptState){
                    return t
                }
            }
        }
    }
}