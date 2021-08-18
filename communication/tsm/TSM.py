"""TSM means topology-shape-metrics, one approach for generating orthogonal layout.
"""
from communication.tsm.planarization import Planarization
from communication.tsm.orthogonalization import Orthogonalization
from communication.tsm.compaction import Compaction
from communication.tsm.utils import number_of_cross, overlap_nodes, overlay_edges
import networkx as nx
from matplotlib import pyplot as plt
import matplotlib.patches as mpatches

def ortho_layout(G, init_pos=None, uselp=True):
    """
    Returns
    -------
    G : Networkx graph
        which may contain bend nodes

    pos : dict
        A dictionary of positions keyed by node
    """
    # precheck(G, init_pos)
    planar = Planarization(G, init_pos)
    ortho = Orthogonalization(planar, uselp)
    compa = Compaction(ortho)
    return compa

def precheck(G, pos=None):
    """Check if input is valid. If not, raise an exception"""
    if max(degree for node, degree in G.degree) > 4:
        raise Exception(
            "Max node degree larger than 4, which is not supported currently")
    if nx.number_of_selfloops(G) > 0:
        raise Exception("G contains selfloop")
    if not nx.is_connected(G):
        raise Exception("G is not a connected graph")

    if pos is None:
        is_planar, _ = nx.check_planarity(G)
        if not is_planar:
            raise Exception("G is not a planar graph")
    else:
        if number_of_cross(G, pos) > 0:
            raise Exception("There are cross edges in given layout")

    for node in G.nodes:
        if type(node) is tuple and len(node) > 1 and node[0] in ("dummy", "bend"):
            raise Exception(f"Invalid node name: {node}")



class TSM:
    def __init__(self, G, init_pos=None, checkit=True, uselp=False):
        compa = ortho_layout(G, init_pos, uselp)
        self.G = compa.G
        self.pos = compa.pos
        self.bendsData = compa.bendsData
      
    def display(self):
        bend_nodes = {node for node in self.G.nodes if ('b' in node and not 'l' in node and not 'r' in node)}

        corner_nodes = {node for node in self.G.nodes if ('br' in node or 'bl' in node or  'tr' in node or 'tl' in node)}

        rect_dummy_nodes = {node for node in self.G.nodes if type(node) == tuple and node[0] == 'rect'}

        draw_nodes_kwds = {'G': self.G, 'pos': self.pos, 'node_size': 100, "edgecolors": 'black'}

        #all nodes
        nx.draw_networkx_nodes(node_color='white', **draw_nodes_kwds)

        # bend nodes(dummy nodes, not exist in original graph)
        nx.draw_networkx_nodes(nodelist = bend_nodes, node_color='blue', **draw_nodes_kwds)

        #rectangle face dummy nodes
        nx.draw_networkx_nodes(nodelist = rect_dummy_nodes, node_color='green', **draw_nodes_kwds)

        nx.draw_networkx_nodes(nodelist = rect_dummy_nodes, node_color='green', **draw_nodes_kwds)

        # overlap nodes
        nx.draw_networkx_nodes(nodelist = overlap_nodes(self.G, self.pos), node_color="red", **draw_nodes_kwds)

        # all edges
        nx.draw_networkx_edges(self.G, self.pos)

        # overlay edges
        nx.draw_networkx_edges(self.G, self.pos, edgelist = overlay_edges(self.G, self.pos), edge_color='red')

        # red_patch = mpatches.Patch(color='red', label='overlaps')
        # blue_patch = mpatches.Patch(color='blue', label='bend node')
        # green_patch = mpatches.Patch(color='green', label='rect dummy node')

        # plt.legend(handles=[red_patch, blue_patch, green_patch])
