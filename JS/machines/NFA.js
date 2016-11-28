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
    //}
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

function validateNFA(){
    if(typeof getInitialNode().idNext=='undefined'){
        $('#str_validate').text('No se ha definido un estado inicial');
    }else if (getFinalNodes().length <= 0){
        $('#str_validate').text('No se ha definido un estado final');       
    }else if(!searchTransitions()){
       $('#str_validate').text('No se han hecho las transiciones correspondientes entre estados'); 
    }
    else{

        return true;
    }

    return false;

};

function sendMessage(){



};

function searchTransitions(){
    var Transitions = getTransition();
    var Nodes = getNodes().length;
    var TempNodes= new Array;
    var includeFather=false;
    var finalCounter=0;
    for (var j =0; j < Transitions.length; j++) {
        if(Transitions[j].node.idNext===0){
            includeFather=true;
        }
        for (var i =0; i <Transitions[j].links.length; i++) { 
                if(!arrayContains(Transitions[j].links[i].node.text,TempNodes)){
                    TempNodes.push(Transitions[j].links[i].node.text);
                }
        }

    }
    console.log("A probar");
    finalCounter=TempNodes.length;
    if(includeFather && !(finalCounter===Nodes)){
        finalCounter++;
    }

    if(finalCounter===Nodes){
        return true;
    }


    return true;

};   
    
   

function arrayContains(node, nodes)
{
    return (nodes.indexOf(node) > -1);
}


function E(node){    
    
};

var recursiveFindE = function(Transitions, NextNode, ArrayE){    
    
}