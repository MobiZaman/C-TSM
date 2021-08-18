from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect, HttpResponseBadRequest, JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import time
import networkx as nx
from communication.tsm.TSM import TSM
from matplotlib import pyplot as plt

# Create your views here.
def home(request):
	return render(request, "demo-compound.html")


@csrf_exempt
def dataTransport(request):
	if request.method == "POST":
		data = json.loads(request.body)

		#received the graph data from javascript
		#now construct the graph with this data

		pos = {}
		nodeData = data['nodes'] #this is an object containing objects of nodes
		edgeData = data['edges'] #this is an array containing (src,tgt) pairs

		G = nx.Graph()

		print("Node data is:")
		print(nodeData)
		print("Edge data is:")
		print(edgeData)

		for node in nodeData:
			G.add_node(node)
			pos[node] = nodeData[node]

		for edge in edgeData:
			src = edge[0]
			tgt = edge[1]
			G.add_edge(src, tgt)

		tsm = TSM(G, pos)

		#convert the position entries from tuple to list
		for value in tsm.pos:
			tsm.pos[value] = list(tsm.pos[value])	

		returnData = { 'nodes': tsm.pos, 'bends': tsm.bendsData}

		temp = json.dumps(returnData)

		return JsonResponse(temp, safe = False, status=201)

	else:
		return HttpResponseBadRequest("Requested page does not exist")