//@author devenbhooshan

function Graph(){
	this.isWeighted=false;
	this.NODES=[]
	this.addNode=addNode;
	this.removeNode=removeNode;
	this.nodeExist=nodeExist;
	this.getAllNodes=getAllNodes;
	function addNode(Name){
		temp=new NODE(Name);
		this.NODES.push(temp);
		return temp;
	}
	function removeNode(Name){
		
		index=this.NODES.indexOf(Name);
		if(index>-1){
			this.NODES.splice(index,1);
			len=this.NODES.length;

			for (var i = 0; i < len; i++) {
				if(this.NODES[i].adjList.indexOf(Name)>-1){
					this.NODES[i].adjList.slice(this.NODES[i].adjList.indexOf(Name));
					this.NODES[i].weight.slice(this.NODES[i].adjList.indexOf(Name));
				}
			}
		}
		
	}
	function nodeExist(Name){
		index=this.NODES.indexOf(Name);
		if(index>-1){
			return true;
		}
		return false;
	}

	function getAllNodes(){
		return this.NODES;
	}
	
	function getBFSTravaersal(){

	}

	function getBFSTravaersal(){
		
	}
	
	function getBFSTravaersal(){
		
	}

}

function NODE(Name){
	this.name=Name;
	this.adjList=[];
	this.weight=[];
	this.addEdge=addEdge;
	this.compare=compare;
	this.finalState=false;
	this.marked=false;
	this.visited=0;
	function addEdge(neighbour,weight){
		this.adjList.push(neighbour);
		this.weight.push(weight);	
	}
	
	function getAdjList(){
		return adjList;
	}
	function compare(node2){
		return this.weight-node2.weight;
	}

	function setFinalState(State){
		this.finalState=State;
	}
}
function bfs(graph){
	ans=[];
	traversedNodes=[];
	traversedNodes.push(graph.NODES[0]);
	allNodes=graph.getAllNodes();
	marked={};
	while(traversedNodes.length!=0){
		var v=traversedNodes.shift();
		marked[v.name]=true;
		console.log(v);
		ans.push(v);
		adjList=v.adjList;
		for (var i=0;i<adjList.length;i++){
			u=adjList[i];
			if(marked[u.name]!=true){
				traversedNodes.push(u);
				marked[u.name]=true;

			}
		}			
	}
	return ans;
}


function dfs(graph,index){
	ans=[];
	traversedNodes=[];
	traversedNodes.push(graph.NODES[index]);
	allNodes=graph.getAllNodes();
	marked={};
	while(traversedNodes.length!=0){
		var v=traversedNodes.pop();
		marked[v.name]=true;
		adjList=v.adjList;
		console.log(v);
		ans.push(v);
		for (var i=0;i<adjList.length;i++){
			u=findNodeADJ(adjList[i],graph);
			if(marked[u.name]!=true){
				traversedNodes.push(u);
				marked[u.name]=true;
			}
		}			
	}
	return ans;
}

function findNodeADJ(Name,graph){

	for(var i=0;i<graph.NODES.length;i++){
		if(graph.NODES[i].name==Name){
			return	graph.NODES[i];
		}

	}

};


function binaryHeap(){
	this.NODES=[];
}

binaryHeap.prototype.size=function(){
		return this.NODES.length;
};

binaryHeap.prototype.compare = function(node1,node2) {
	return node1.priority-node2.priority;
};
binaryHeap.prototype.insert_push = function(element) {
	this.NODES.push(element);
	this.bubbleUp(this.NODES.length-1);
};

binaryHeap.prototype.remove_pop = function() {
	var ans=this.NODES[0];
	var last_element=this.NODES.pop();
	
	if(this.NODES.length> 0){
		this.NODES[0]=last_element;
		this.sinkDown(0);
	}
	return ans;
};

binaryHeap.prototype.delete_node = function(NODE) {
	var length=this.NODES.length;
	isPresent=false;
	for (var i = 0; i < length; i++) {
		if((this.NODES[i].content!=NODE)) continue;
		var end=this.NODES.pop();
		if(i==length-1) break;
		this.NODES[i]=end;
		this.bubbleUp(i);
		this.sinkDown(i);
		isPresent=true;
		break;
	}
	return isPresent;
};

binaryHeap.prototype.top = function() {
	return this.NODES[0];
};

binaryHeap.prototype.sinkDown = function(i) {
	var length=this.NODES.length;	
	while(true && i<length){
		var flag=0;
		if(2*i+1 < length && this.compare(this.NODES[i],this.NODES[2*i+1])>0){
			if(2*i+2< length && this.compare(this.NODES[2*i+1],this.NODES[2*i+2])>0){
				flag=2;
			}else{
				flag=1;
			}	
		}else if( 2*i+2 < length && this.compare(this.NODES[i],this.NODES[2*i+2])>0){
			flag=2;
		}else {
			break;
		}
			var temp=this.NODES[2*i+flag];
			this.NODES[2*i+flag]=this.NODES[i];
			this.NODES[i]=temp;
			i=2*i+flag;
	}
};


binaryHeap.prototype.bubbleUp = function(i) {
	
	var length=this.NODES.length;	
	while(i>0){
		var index=Math.floor((i+1)/2)-1;
		//console.log(this.compare(this.NODES[i],this.NODES[index]));
		if(this.compare(this.NODES[i],this.NODES[index])<0){
			//console.log(this.NODES[i].priority+' '+this.NODES[index].priority);
			var temp=this.NODES[index];
			this.NODES[index]=this.NODES[i];
			this.NODES[i]=temp;
			i=index;
		}else {
			break;
		}
			
	}
};


function MinPQ(list){
	
	bh=new binaryHeap();
	this.heap=bh;
}

MinPQ.prototype.push=function(NODE,priority){
	var temp=new MinPQNodes(NODE,priority);
	this.heap.insert_push(temp);
};

MinPQ.prototype.pop=function(){
	return this.heap.remove_pop().content;
};


MinPQ.prototype.remove=function(NODE){
	return this.heap.delete_node(NODE);
};

MinPQ.prototype.top=function(){
	return this.heap.top().content;
};
MinPQ.prototype.size=function(){
	return this.heap.size();
};

function MinPQNodes(content,priority){
	this.content=content;
	this.priority=priority;
}


function dijkstra(graph,source,destination){

	this.previousNode=[];
	this.distance=new Array();				
	this.distance[source.name]=0;
	this.pq=new MinPQ();
	var NODES=graph.getAllNodes();
	length=NODES.length;
	for(var i=0;i<length;i++){
		if(NODES[i]!=source){
			this.distance[NODES[i].name]=Number.POSITIVE_INFINITY;
		}
        this.pq.push(NODES[i],this.distance[NODES[i].name]);
	}
	
	while(this.pq.size()!=0){
		u=this.pq.pop();
		adjList=u.adjList;
		for (var i = 0; i < adjList.length; i++) {
			v=adjList[i];
			if(this.distance[u.name]!=Number.POSITIVE_INFINITY){
				alt=this.distance[u.name]+u.weight[i];
				if(alt<this.distance[v.name]){
					this.distance[v.name]=alt;
					this.previousNode[v.name]=u.name;
                    this.pq.remove(v);
                    this.pq.push(v,this.distance[v.name]);
				}
			}
		}
	}
	if(typeof destination==='undefined'){

	}else 
	return this.distance[destination.name];
}

function bellman_ford(graph,source,destination){
	this.previousNode=[];
	this.distance=new Array();				
	this.distance[source.name]=0;
	var NODES=graph.getAllNodes();
	length=NODES.length;
	for(var i=0;i<length;i++){
		if(NODES[i]!=source){
			this.distance[NODES[i].name]=Number.POSITIVE_INFINITY;
		}
	}
	
	for(var k=0;k<length;k++){
		for(var j=0;j<length;j++){
			u=NODES[j];
			adjList=u.adjList;
			for (var i = 0; i < adjList.length; i++) {
				v=adjList[i];
				if(this.distance[u.name]!=Number.POSITIVE_INFINITY){	
					alt=this.distance[u.name]+u.weight[i];
					if(alt<this.distance[v.name]){

						this.previousNode[v.name]=u.name;
						this.distance[v.name]=alt;
					}
				}
			}
		}
	}

	for(var j=0;j<length;j++){
		u=NODES[j];
		adjList=u.adjList;
		for (var i = 0; i < adjList.length; i++) {
			v=adjList[i];
			if(this.distance[u.name]!=Number.POSITIVE_INFINITY){	
				alt=this.distance[u.name]+u.weight[i];
				if(alt<this.distance[v.name]){
					return null;
				}
			}
		}
	}
	
	return this.distance[destination.name];	

}

function johnson(graph){
	try
	{
		// http://en.wikipedia.org/wiki/Johnson%27s_algorithm
		temp=new NODE('temp');
		graph.addNode(temp);
		NODES=graph.getAllNodes();
		length=NODES.length;
		for(var j=0;j<length-1;j++){
			u=NODES[j];
			temp.addEdge(u,0);
		}
		vari=bellman_ford(graph,temp,temp);
		if(vari==null) {
			return null;
		}
		bell=new bellman_ford(graph,temp,temp);
		length=NODES.length;
		h=bell.distance;
		graph.removeNode(temp);		
		length=NODES.length;
		for(var j=0;j<length;j++){
			u=NODES[j];
			adjList=u.adjList;
			for (var i = 0; i < adjList.length; i++) {
				v=adjList[i];
				u.weight[i]=u.weight[i]+h[u.name]-h[v.name];
			}
		}	
		distanceMatrix=new Array()
		length=NODES.length;
		for(var j=0;j<length;j++){
			u=NODES[j];
			list=u.weight;
			len=list.length;
			dij=new dijkstra(graph,NODES[j]);
			distanceMatrix[NODES[j].name]=dij.previousNode;
			
		}
		for(var j=0;j<length;j++){
			u=NODES[j];
			adjList=u.adjList;
			for (var i = 0; i < adjList.length; i++) {
				v=adjList[i];
				u.weight[i]=u.weight[i]-h[u.name]+h[v.name];
			}
		}
	}
	catch(e)
	{
		console.log(e);
	}
	return distanceMatrix;	
}
//Minimum Spanning Tree

function prim(graph){

	NODES=graph.getAllNodes();
	this.error=false;
	this.Vnode=[];
	this.Vedge=[];
	this.Vnode.push(NODES[0]);

	this.pq=new MinPQ();
	
	this.InsertEdgeIntoPQ(NODES[0],this.pq)
	
	while(this.Vnode.length!=NODES.length){

		if(this.pq.size()==0){ 
			this.error=true;
			return ;
		}

		while(this.pq.size()!=0){

			minEdge=this.pq.pop();
			if(this.Vnode.indexOf(minEdge[1])==-1){

				this.Vedge.push(minEdge);
				this.Vnode.push(minEdge[1]);
				this.InsertEdgeIntoPQ(minEdge[1],this.pq);
				break;
			}

		}
	}
	return;
}

prim.prototype.InsertEdgeIntoPQ = function(NODE,pq) {
	adjList=NODE.adjList;
	wights=NODE.weight;
	for (var i = 0; i < adjList.length; i++) {
		temp=[];
		temp.push(NODE);
		temp.push(adjList[i]);
		pq.push(temp,wights[i]);		
	}
}

