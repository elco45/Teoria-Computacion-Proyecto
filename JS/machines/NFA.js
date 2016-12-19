function NFAtoDFA() {        
    var trans = getTransition();
    var init = getInitialNode();
    var fin = getFinalNodes();
    $("#vizGraphBefore").html(drawGraph(init, trans, fin));
    $("#vizGraphAfter").html(drawGraph(init, trans, fin));
    $("#vizModal").modal();
};  

function consumeStringNFA(){  
    if(validateAutomataEstructure()){
        $('#str_validate').text('NFA definido'); 
        var stringToConsume = $('#str_cadena').val();
        var route = new Array();
        var nodeAns = recursiveConsumeNFA(getTransition(),getInitialNode().idNext,0,stringToConsume.length,stringToConsume,route);
        if(nodeAns){
            
            if(nodeAns.actualPos == stringToConsume.length && nodeAns.node.isAcceptState){
                for(var i = 0; i < nodeAns.route.length; i++){
                    if(i == nodeAns.route.length-1){
                        addAnimation(nodeAns.route[i].links,i*7,'red',true);
                    }else{
                        addAnimation(nodeAns.route[i].links,i*7,'red',false);
                    }
                }
            }else{
                swal("Opps", "Cadena Rechazada", "error");
            }
        }else{
            swal("Opps", "Cadena Rechazada", "error");
        }
        $('#str_cadena').val('');
    }
};

function addAnimation(link, time,color, last) {
    setTimeout(function() {
        link.changeColor(color);
    }, 300 * time);
    setTimeout(function() {
        link.changeColor('black');
    }, 400 * time);
    if(last){
        setTimeout(function() {
            swal("Nice!", "Cadena Aceptada", "success");
        }, 400 * time);
    }
};

function pause( time, node ){
    var sDialogScript = 'window.setTimeout( function () {  }, ' + time + ');';
	alert("Estado: " + node.text);
};


function recursiveConsumeNFA(Transitions, NextNode, ActualPosString, LengthString, StringToConsume,route){
    var routes = route.concat();
    if(ActualPosString == LengthString && Transitions[NextNode].node.isAcceptState){
        var ans = {
            'actualPos': ActualPosString,
            'node': Transitions[NextNode].node,
            'route': routes
        }
        return ans;
    }
    for(var i = 0; i < Transitions[NextNode].links.length; i++){
        if(Transitions[NextNode].links[i].symbol === StringToConsume.charAt(ActualPosString)){
            routes.push(Transitions[NextNode].links[i]);
            var t = recursiveConsumeNFA(Transitions, Transitions[NextNode].links[i].node.idNext, ActualPosString+1, LengthString, StringToConsume,routes);
            if(t){
                if(t.actualPos == LengthString){
                    return t
                }
            }
            
            
        }else if(Transitions[NextNode].links[i].symbol === '#'){
            routes.push(Transitions[NextNode].links[i]);
            var t = recursiveConsumeNFA(Transitions, Transitions[NextNode].links[i].node.idNext, ActualPosString, LengthString, StringToConsume,routes);
            if(t){
                if(t.actualPos == LengthString){
                    return t
                }
            }
            
        }
    }
}



function NFAtoDFA(){
    if(validateAutomataEstructure()){
        var Transitions=getTransition();
        var InitialNode=getInitialNode();
        var FinalNodes  =getFinalNodes();
        var Nodes = getNodes();
        var NewStates = CreateDFAStates(Nodes);
        var StatesSpliter = null;
        var Alphabet = getAlphabet(Transitions);
        var idNode=0;
        var newTransitions= new Array;
        var newFinalNodes = getNewFinalNodes(NewStates,FinalNodes);
        var newInitialNode= getNewInitialNode(Transitions,InitialNode,Nodes,NewStates);
        var ReachedMe = false;
        for(var i=0; i<NewStates.length;i++){
            if(NewStates[i].text!="Ø"){

                console.log("State: : "+NewStates[i].text);
                StatesSpliter=NewStates[i].text.split(",");
                var tempLinks= new Array;
                for(var k=0; k<Alphabet.length;k++){  
                   // console.log("Con : "+Alphabet[k]);
                    var NodeDeltaUEnode = new Array;
                    var ENode= new Array;            
                    for(var j=0; j<StatesSpliter.length;j++){
                       // console.log("Con parte de nodo : "+StatesSpliter[j]);             
                        var DeltaReturn=(FindDelta(Transitions,StatesSpliter[j],Alphabet[k]));
                       // console.log(DeltaReturn);                  
                        if(DeltaReturn){
                            for(var x=0; x<DeltaReturn.length;x++){
                                NodeDeltaUEnode.push(DeltaReturn[x]);
                                idNode=DeltaReturn[x].idNext;
                                ENode=NoDuplicates(recursiveFindE(Transitions,Nodes[idNode],idNode,ENode,Nodes[idNode]));
                                if(ENode){
                                    NodeDeltaUEnode=addEnodes(NodeDeltaUEnode,ENode);    
                                }
                            }
                                          
                        }              
                    }
                   //Create Temp link
                    NodeDeltaUEnode=NoDuplicates(NodeDeltaUEnode);
                    var NodetoAdd=findNode(NewStates,createSet(NodeDeltaUEnode));
                   // console.log("Node to add");
                    //console.log(NodetoAdd); 
                    tempLinks.push({'symbol': Alphabet[k],'node': NodetoAdd});
                    if(NodetoAdd.text=="Ø"){
                        ReachedMe=true;
                    }
                    /*console.log("============================TEMP LINKS=================================");
                    console.log(tempLinks); */
                }
                //create Transition
                if(tempLinks.length>0){
                    newTransitions.push({'links':tempLinks,'node': NewStates[i]});

                }
          }
        }
        console.log("==================================================");
        console.log(InitialNode);
        console.log(FinalNodes);
        console.log(Transitions);
        console.log("====================================================");
        console.log(newInitialNode);
        console.log(newFinalNodes);
        console.log(newTransitions);

        if(ReachedMe){
            newTransitions.push({'links':TheyTouchedME(Alphabet,Transitions,NewStates[NewStates.length-1]),'node': NewStates[NewStates.length-1]});
            console.log("Me tocaron");
        }

        $('#modal_Title1').text('Before(NFA)');
        $('#modal_Title2').text('After(DFA)');
        $("#vizGraphBefore").html(drawGraph(InitialNode, Transitions, FinalNodes));
        $("#vizGraphAfter").html(drawGraph(newInitialNode, newTransitions, newFinalNodes));
        $("#vizModal").modal();
        $(".modal-wide").on("show.bs.modal", function() {
    	  var height = $(window).height() - 200;
    	  $(this).find(".modal-body").css("max-height", height);
    	});
    }
 
};


function addEnodes(NodeDeltaUEnode,ENode){
    for(var i=0; i<ENode.length;i++){
        if(!arrayContains(ENode[i],NodeDeltaUEnode)){
            NodeDeltaUEnode.push(ENode[i]);
        }
    }    
    return NodeDeltaUEnode;
};

function createSet(Array){
    var set="";
    for(var i=0; i<Array.length;i++){
        set+=Array[i].text+",";
    }
    set=set.slice(0, -1);
    return set;

};


function getNewInitialNode(Transitions,Node,Nodes,NewStates){
    var ENode = new Array;
    var NodeDeltaUEnode=new Array;
    NodeDeltaUEnode.push(Node);
    var idNode=Node.idNext;
    ENode=NoDuplicates(recursiveFindE(Transitions,Nodes[idNode],idNode,ENode,Nodes[idNode]));
    if(ENode){
        NodeDeltaUEnode=addEnodes(NodeDeltaUEnode,ENode);  
        NodeDeltaUEnode=NoDuplicates(NodeDeltaUEnode);
        return findNode(NewStates,createSet(NodeDeltaUEnode));  
    }
    return null;
};

function TheyTouchedME(Alphabet,Transitions,node){
    var tempLinks=new Array;
    for(var i=0; i<Alphabet.length;i++){
        tempLinks.push({'symbol': Alphabet[i],'node': node});

    }
     return tempLinks;

}

function getNewFinalNodes(NewStates,Nodes){
    var newFinalNodes= new Array;
    for(var i=0;i<NewStates.length;i++){
        for(var j =0; j<Nodes.length;j++){
            if(NewStates[i].text.includes(Nodes[j].text)){
                NewStates[i].isAcceptState=true;
                newFinalNodes.push(NewStates[i]);
            }
        }

    }

    return newFinalNodes;
};

function findNodeID(Nodes,Node){

    for(var i=0; i<Nodes.length;i++){
        if(Nodes[i].text===Node){
            return Nodes[i].idNext;
        }

    }     
    return null;
};

function findNode(Nodes,Node){
    var split=Node.split(",");
    var counter =0;
    console.log("Node to find "+Node);
    for(var i=0; i<Nodes.length;i++){
        for(var j=0; j<split.length;j++){
            if(Nodes[i].text.includes(split[j])){
                counter++;
            }   

        }
        console.log("Counter :"+counter);
        console.log("Split length: "+split.length);
        if(counter==(split.length)&&Node.length==Nodes[i].text.length){
            return Nodes[i];
        }
        counter =0;     
    }     
    return Nodes[Nodes.length-1];    

};


function getAlphabet(Transitions){
    var Alphabet = new Array;
    var Symbol="";
    for(var i=0; i<Transitions.length;i++){
        for(var j=0; j<Transitions[i].links.length;j++){
            Symbol=Transitions[i].links[j].symbol;
            if(!arrayContains(Symbol,Alphabet)&&Symbol!="#"){
                Alphabet.push(Symbol);
            }
        }

    }
    return Alphabet;

};

function FindDelta(Transitions,Node,Symbol){
    var NodesToPush = new Array;
    //console.log(Node);
    //console.log(Symbol);
    for(var i=0; i<Transitions.length;i++){
        console.log(Transitions[i].node.text);
        if(Transitions[i].node.text==Node){
           // console.log("Encontre el nodo" +Transitions[i].node.text+" - "+Node );
           for(var j=0; j<Transitions[i].links.length;j++){
                    if(Transitions[i].links[j].symbol==Symbol){
                        NodesToPush.push(Transitions[i].links[j].node);
                    }          
                    
                }
          }
    }
    return NodesToPush;

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
               // console.log("Not Found Epsilon so Keep Looking in this node");

            }

        } 
    }
    if(Transitions[NextNode].node==InitialNode){
        return ArrayE;
    }
     
};

function NFAtoREGEX(){



};
