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



function NFAtoDFA(){
    var Transitions=getTransition();
    var InitialNode=getInitialNode();
    var FinalNode  =getFinalNodes();
    var Nodes = getNodes();
    var NewStates = CreateDFAStates(Nodes);
    var StatesSpliter = null;
    var Alphabet = getAlphabet(Transitions);
    var ENode= new Array;
    console.log("Todas las Transitions:");
    console.log(Transitions);
    ENode=NoDuplicates(recursiveFindE(Transitions,Nodes[0],0,ENode,Nodes[0]));

 
};

function getNewInitialNode(Transitions,Node){

};



function FindReach(Transitions,Node){



};

function FindE(Transitions,Node){





};

function getAlphabet(Transitions){
    var Alphabet = new Array;
    var Symbol="";
    for(var i=0; i<Transitions.length;i++){
        for(var j=0; j<Transitions[i].links.length;j++){
            Symbol=Transitions[i].links[j].symbol;
            if(!arrayContains(Symbol,Alphabet)){
                Alphabet.push(Symbol);
            }
        }

    }
    return Alphabet;

};

function FindDelta(Transitions,Node,Symbol){
    var LinksToPush = new Array;
    for(var i=0; i<Transitions.length;i++){
        if(Transitions[i].node.text==Node){
           for(var j=0; j<Transitions[i].links.length;j++){
                    if(Transitions[i].links[j].symbol==Symbol){
                        LinksToPush.push(Transitions[i].links[j]);
                    }          
                    
                }
            return  {'node': Transitions[i].node,'links': LinksToPush};  
          }
    }
    return null;

};

function CreateDFAStates(Nodes){
    var NewStates = new Array;
    var justText= new Array;
    var allStates="";
    var toAdd=null;
    var toAddInverse=null;
    for(var i=0; i <Nodes.length ;i++){
        for(var j=1; j<Nodes.length;j++){
            toAdd= new Node(0,0,0);
            toAddInverse=new Node(0,0,0);
            toAdd.setText(Nodes[i].text+","+Nodes[j].text);
            toAddInverse.setText(Nodes[j].text+","+Nodes[i].text);
            if(!(arrayContains(toAdd.getText(),justText))&& !(arrayContains(toAddInverse.getText(),justText)) &&(Nodes[j].text!=Nodes[i].text)){
                justText.push(toAdd.getText());
                NewStates.push(toAdd);

            }
        }
        allStates+=Nodes[i].text+",";
        NewStates.push(Nodes[i]);
    }

    allStates=allStates.slice(0, -1);
    toAdd= new Node(0,0,0);
    toAdd.setText(allStates);   
    if(!arrayContains(toAdd.getText(),justText)&& justText.length>1){
        NewStates.push(toAdd);

    }
    toAdd= new Node(0,0,0);
    toAdd.setText("Ø");
    NewStates.push(toAdd);
    return NewStates;
};

function CreateDFATransitions(Transitions,Nodes){


};

function recursiveFindE(Transitions, Node,NextNode, ArrayE,InitialNode){
   
    for(var i=0; i<Transitions[NextNode].links.length;i++){
        if(Transitions[NextNode].node.text==Node.text){
            if(Transitions[NextNode].links[i].symbol=="#"){//found Epsilon
                ArrayE.push(Transitions[Transitions[NextNode].links[i].node.idNext].node);
                var SaveStates= recursiveFindE(Transitions, Transitions[Transitions[NextNode].links[i].node.idNext].node,Transitions[NextNode].links[i].node.idNext, ArrayE);
                if(SaveStates!=null){
                    return SaveStates;
                }

            }else{
                console.log("Not Found Epsilon so Keep Looking in this node");

            }

        } 
    }
    if(Transitions[NextNode].node==InitialNode){

        return ArrayE;
    }
     
};
