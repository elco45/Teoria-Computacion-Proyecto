function consumeStringPDA(){ 
    //saveBackup()
    var stringToConsume = $('#str_cadena').val();
    var Stack = new Array();
    var nodeAns = recursiveConsumePDA(getTransitionPDA(),getInitialNode().idNext,0,stringToConsume.length,stringToConsume,Stack);
    console.log(nodeAns)
    if(nodeAns){
        if(nodeAns.actualPos == stringToConsume.length && nodeAns.node.isAcceptState && nodeAns.stack == 0){
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
    var tmp = Stack.concat()
    console.log("a="+ActualPosString+","+Transitions[NextNode].node.isAcceptState+",stack="+tmp)
    if(ActualPosString == LengthString  && Stack.length == 0){
        console.log("asdsadasdasd")
        var ans = {
            'actualPos': ActualPosString,
            'node': Transitions[NextNode].node,
            'stack': tmp.length
        }
        return ans;
    }else if(ActualPosString<=LengthString){
        for(var i = 0; i < Transitions[NextNode].links.length; i++){
            //console.log("tmp="+tmp+",input="+Transitions[NextNode].links[i].input+",pop="+Transitions[NextNode].links[i].popElement+",push"+Transitions[NextNode].links[i].pushElement)
           
            if(Transitions[NextNode].links[i].input === StringToConsume.charAt(ActualPosString) && 
                (Transitions[NextNode].links[i].popElement === tmp[tmp.length-1] && Transitions[NextNode].links[i].pushElement === '#')){
                if(Transitions[NextNode].links[i].popElement == '$' && ActualPosString<LengthString){
                    continue;
                }
                if(Transitions[NextNode].links[i].popElement != '#' && tmp[tmp.length-1] === Transitions[NextNode].links[i].popElement){
                    tmp.pop();
                }
                if(Transitions[NextNode].links[i].pushElement != '#'){
                    tmp.push(Transitions[NextNode].links[i].pushElement)
                }
                var t = recursiveConsumePDA(Transitions, Transitions[NextNode].links[i].node.idNext, ActualPosString+1, LengthString, StringToConsume,tmp);
                if(t){
                    console.log(t)
                    if(t.actualPos == LengthString && t.stack==0 && t.node.isAcceptState){
                        return t
                    }
                }else{
                    var tmp2 = tmp.concat()
                    //console.log(Transitions[NextNode].links[i].popElement+","+tmp[tmp.length-1]+","+Transitions[NextNode].links[i].pushElement)
                    var t2 = recursiveConsumePDA(Transitions, Transitions[NextNode].links[i].node.idNext, ActualPosString+1, LengthString, StringToConsume,tmp);
                    if(t2){
                        console.log(t2)
                        if(t2.actualPos == LengthString && t2.stack==0 && t2.node.isAcceptState){
                            return t2
                        }
                    }
                }
                
                
            }else if(Transitions[NextNode].links[i].input === StringToConsume.charAt(ActualPosString) && 
            (Transitions[NextNode].links[i].popElement === '#')){
                //console.log("pop  "+Transitions[NextNode].links[i].input+","+Transitions[NextNode].links[i].popElement+","+tmp[tmp.length-1])
                
                if(Transitions[NextNode].links[i].popElement != '#' && tmp[tmp.length-1] === Transitions[NextNode].links[i].popElement){
                    if(Transitions[NextNode].links[i].popElement == '$' && ActualPosString == LengthString){
                        tmp.pop();
                    }else if(Transitions[NextNode].links[i].popElement != '$'){
                        tmp.pop();
                    }
                }
                if(Transitions[NextNode].links[i].pushElement != '#'){
                    tmp.push(Transitions[NextNode].links[i].pushElement)
                }
                var t = recursiveConsumePDA(Transitions, Transitions[NextNode].links[i].node.idNext, ActualPosString+1, LengthString, StringToConsume,tmp);
                if(t){
                    console.log(t)
                    if(t.actualPos == LengthString && t.stack==0 && t.node.isAcceptState){
                        return t
                    }
                }
                
            }else if(Transitions[NextNode].links[i].input === '#' && 
            (Transitions[NextNode].links[i].popElement === '#' ||  Transitions[NextNode].links[i].popElement === tmp[tmp.length-1]  )){
                //console.log("pop  "+Transitions[NextNode].links[i].input+","+Transitions[NextNode].links[i].popElement+","+tmp[tmp.length-1])
                if(Transitions[NextNode].links[i].popElement != '#' && tmp[tmp.length-1] === Transitions[NextNode].links[i].popElement){
                    if(Transitions[NextNode].links[i].popElement == '$' && ActualPosString == LengthString){
                        tmp.pop();
                    }else if(Transitions[NextNode].links[i].popElement != '$'){
                        tmp.pop();
                    }
                }
                if(Transitions[NextNode].links[i].pushElement != '#'){
                    tmp.push(Transitions[NextNode].links[i].pushElement)
                }
                var t = recursiveConsumePDA(Transitions, Transitions[NextNode].links[i].node.idNext, ActualPosString, LengthString, StringToConsume,tmp);
                if(t){
                    console.log(t)
                    if(t.actualPos == LengthString && t.stack==0 && t.node.isAcceptState){
                        return t
                    }
                }
            }
        }
        
    }
}