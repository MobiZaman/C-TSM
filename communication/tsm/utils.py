from networkx import PlanarEmbedding
from math import atan2

def convert_pos_to_embdeding(G, pos):
    '''only straight line in G.
    '''
    emd = PlanarEmbedding()
    for node in G:
        neigh_pos = {}
        for neigh in G[node]:
            neigh_pos[neigh]  = (pos[neigh][0]-pos[node][0], pos[neigh][1]-pos[node][1]) 
        
        neighes_sorted = sorted(G.adj[node],
                                key=lambda v: atan2(
                                    neigh_pos[v][1], neigh_pos[v][0])
                                )  # counter clockwise
        last = None
        for neigh in neighes_sorted:
            emd.add_half_edge_ccw(node, neigh, last)
            last = neigh
    emd.check_structure()
    return emd


def number_of_cross(G, pos):
    '''
    not accurate, may be equal to actual number or double
    '''
    def doIntersect(p1, q1, p2, q2):
        def orientation(p, q, r):
            val = (q[1] - p[1]) * (r[0] - q[0]) - (q[0] - p[0]) * (r[1] - q[1])
            if (val == 0):
                return 0
            elif (val > 0):
                return 1
            else:
                return 2
        
        def onSegment(p, q, r):
            if (q[0] <= max(p[0], r[0]) 
                and q[0] >= min(p[0], r[0]) 
                and q[1] <= max(p[1], r[1]) 
                and q[1] >= min(p[1], r[1])):
                return True;
            return False;

        o1 = orientation(p1, q1, p2);
        o2 = orientation(p1, q1, q2);
        o3 = orientation(p2, q2, p1);
        o4 = orientation(p2, q2, q1);

        if (o1 != o2 and o3 != o4):
            return True;

        if (o1 == 0 and onSegment(p1, p2, q1)): 
            return True;

        if (o2 == 0 and onSegment(p1, q2, q1)): 
              return True;

        if (o3 == 0 and onSegment(p2, p1, q2)): 
              return True;

        if (o4 == 0 and onSegment(p2, q1, q2)): 
              return True;

        return False
        #end of doIntersect function
    
    count = 0
    for a, b in G.edges:
        for c, d in G.edges:
            if a not in (c, d) and b not in (c, d):
                if doIntersect(pos[a], pos[b], pos[c], pos[d]):
                    print("Edge crossing:")
                    print(a, b)
                    print(c, d)
                    print("\n")
                    count += 1
    return count


def overlap_nodes(G, pos):
    inv_pos = {}
    for k, v in pos.items():
        #############
        v = tuple(v) # compatible with pos given by nx.spring_layout()
        ##############333
        inv_pos[v] = inv_pos.get(v, ()) + (k,)
    return [node for nodes in inv_pos.values() if len(nodes) > 1 for node in nodes]


def overlay_edges(G, pos):
    res = set()
    for a, b in G.edges:
        (xa, ya), (xb, yb) = pos[a], pos[b]
        for c, d in G.edges:
            (xc, yc), (xd, yd) = pos[c], pos[d]
            if (a, b) != (c, d):
                if xa == xb == xc == xd:
                    if min(ya, yb) >= max(yc, yd) or max(ya, yb) <= min(yc, yd):
                        continue
                    res.add((a, b))
                    res.add((c, d))
                if ya == yb == yc == yd:
                    if min(xa, xb) >= max(xc, xd) or max(xa, xb) <= min(xc, xd):
                        continue
                    res.add((a, b))
                    res.add((c, d))
    return list(res)
