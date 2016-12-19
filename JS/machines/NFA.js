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
                        addAnimation(nodeAns.route[i].links,(i+1)*7,'red',true);
                    }else{
                        addAnimation(nodeAns.route[i].links,(i+1)*7,'red',false);
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
        $('#str_validate').text('NFA definido'); 
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

     if(validateAutomataEstructure()){
            $('#str_validate').text('NFA definido'); 
            var Transitions = getTransitionNoSplit();
            var InitialNode = getInitialNode();
            var FinalNodes = getFinalNodes();
            var ArrayE = new Array;
            var tempArrayE = new Array;
            var Childs=0;
            var Nodes = getNodes();
            JoinTransitions(Transitions);
            selfTransitios(Transitions);   
            console.log(Transitions);

            graph =new Graph(); // creates a graph
            for(var i=0; i<Nodes.length;i++){
               node=graph.addNode(Transitions[i].node.text);

            }
            var FinalNode =null;
            for(var X=0; X<graph.NODES.length;X++){
                for(var i=0; i<Transitions.length;i++){
                    if(graph.NODES[X].name==Transitions[i].node.text){
                         graph.NODES[X].finalState=Transitions[i].node.isAcceptState;                        
                         for(var j=0;j<Transitions[i].links.length;j++){         
                                graph.NODES[i].addEdge(Transitions[i].links[j].node.text,Transitions[i].links[j].symbol);
                         }
                    }
                }

                if(graph.NODES[X].finalState==true){
                    FinalNode=graph.NODES[X];

                }

            }
            console.log(graph);
            console.log(graph.NODES.length);     
            var Expression="";
            console.log("==============================");   
            console.log(graph.NODES[0]);   
            getPaths(graph.NODES[0],FinalNode,tempArrayE,ArrayE,graph);
            console.log(ArrayE);
            console.log("==============================");
            if(FinalNodes.length==1){
                //Only one Final states
                for(var i=0;i<graph.NODES.length;i++){
                    for(var j=0;j<graph.NODES[i].weight.length;j++){
                        Expression+=graph.NODES[i].weight[j];
                    }

                    
                }

                console.log(Expression);
                $('#str_expresion').text(Expression);
                Expression="";
            }else{

                console.log("NODE PODERS");
            }
            console.log(graph);
            console.log(dfs(graph,InitialNode.idNext));

   }
};

function getAllPaths(Transitions, Node,NextNode, ArrayE,InitialNode,FinalNode,tempArrayE,Childs){
    console.log("Estoy en NODO: "+Node.text);
    for(var i=0; i<Transitions[NextNode].links.length;i++){
        if(Transitions[NextNode].links[i].node.marked==false &&Transitions[NextNode].links[i].node.text!=Node.text){
            console.log("No carmado");
            console.log(Transitions[NextNode].links[i].node.text);
                if(!arrayContains(Transitions[NextNode].links[i].node.text),tempArrayE){
                    tempArrayE.push(Transitions[NextNode].links[i].node.text);                    
                    var SaveStates= getAllPaths(Transitions, Transitions[Transitions[NextNode].links[i].node.idNext].node,Transitions[NextNode].links[i].node.idNext, ArrayE,InitialNode,FinalNode,tempArrayE,Childs);
                    if(SaveStates!=null){
                        return SaveStates;
                    }                   
                }
  
            }else{
                console.log("Nodo Ya marcado");
            }

         Transitions[NextNode].node.setMarked(true);
            
     
    }
    if(Transitions[NextNode].node.text==FinalNode.text){
        tempArrayE.push(InitialNode.text);
        tempArrayE= NoDuplicates(tempArrayE);
        ArrayE.push(tempArrayE);
        tempArrayE= new Array;
    }


};

function getPaths(CurrentNode,FinalNode,Path,Paths,graph){
  if(CurrentNode.marked==false &&!(CurrentNode.visited==CurrentNode.adjList.length-1)){ 
        CurrentNode.marked=true;
        if(CurrentNode.finalState==true){
            console.log("Estado Final Agregar Ruta");
            Paths.push(Path);
        }
        if(CurrentNode.adjList.length>0){
           Path.push(CurrentNode);
           console.log("Estoy en : "+CurrentNode.name);  
           for(var i=0;i<CurrentNode.adjList.length;i++){
                console.log(findNodeADJLIST(CurrentNode.adjList[i],graph).finalState);
                if(findNodeADJLIST(CurrentNode.adjList[i],graph).finalState==true){
                    console.log("Estado Final Agregar Ruta");
                    Paths.push(Path);
                }else{
                    console.log("VOY PARA : "+CurrentNode.adjList[i]);
                    var go = getPaths(findNodeADJLIST(CurrentNode.adjList[i],graph),FinalNode,Path,Paths,graph);
                    if(go){
                         return go;
                    }
                   

                }
                console.log("Aumente de : "+CurrentNode.name);
                CurrentNode.visited=CurrentNode.visited+1;
           }

        }else {
            console.log("No más Hijos");
            if(Nodes[CurrentNode].finalState==true){
                Paths.push(Path);
                Path.pop();
            }else{
                Path.pop();
            }

        }
}


};

function findNodeADJLIST(Name,graph){

    for(var i=0;i<graph.NODES.length;i++){
        if(graph.NODES[i].name==Name){
            return  graph.NODES[i];
        }

    }

};

function JoinTransitions(Transitions){
    var newString="";
    var Split =null;
    for(var i =0 ; i<Transitions.length;i++){
        console.log(Transitions[i]);
        for(var k=0; k<Transitions[i].links.length;k++){
            Split=Transitions[i].links[k].symbol.split(",");
            if(Split.length>1){
                for(var j=0; j<Split.length;j++){
                    newString+=Split[j]+"|";
                }
                newString=newString.slice(0, -1);
                Transitions[i].links[k].symbol="("+newString+")";
                newString="";   
            }
        }
    }

};

function selfTransitios(Transitions){

    for(var i =0 ; i<Transitions.length;i++){
        for(var k=0; k<Transitions[i].links.length;k++){
            if(Transitions[i].links[k].node.text==Transitions[i].node.text){
                Transitions[i].links[k].symbol=Transitions[i].links[k].symbol+"*";   
            }
        }
    }

};
