from copy import deepcopy
from communication.tsm.flownet import Flow_net
from communication.dcel.dcel import Dcel
import networkx as nx

class Compaction:
    '''
    Assign minimum lengths to the segments of the edges of the orthogonal representation.
    Never reverse ortho in this class.
    '''

    def __init__(self, ortho):
        self.planar = ortho.planar
        self.G = self.planar.G
        self.dcel = self.planar.dcel

        self.bendsData = []

        flow_dict = deepcopy(ortho.flow_dict)
        self.bend_point_processor(flow_dict)  
        ori_edges = list(self.G.edges)
        
        halfedge_side = self.face_side_processor(flow_dict)
        self.refine_faces(halfedge_side)

        halfedge_length = self.tidy_rectangle_compaction(halfedge_side)
        self.pos = self.layout(halfedge_side, halfedge_length)
        self.remove_dummy()
        self.G.add_edges_from(ori_edges)


    def bend_point_processor(self, flow_dict):
        '''
            Create dummy nodes for bends.
        '''

        bends = {}  # left to right
        for he in self.planar.dcel.half_edges.values():
            lf, rf = he.twin.inc, he.inc
            flow = flow_dict[lf.id][rf.id][he.id]
            if flow > 0:
                bends[he.id] = flow

        idx = 0
        # (u, v) -> (u, bend0, bend1, ..., v)
        for he_id, n_bends in bends.items():
            he = self.planar.dcel.half_edges[he_id]
            u, v = he.get_points()
            lf_id, rf_id = he.twin.inc.id, he.inc.id

            self.G.remove_edge(u, v)

            #assign the flow of (u,v) to (v, bend0) and remove the flow for (u,v) for the rf
            flow_dict[u][rf_id][u, f'b{idx}'] = flow_dict[u][rf_id].pop((u, v))

            temp_bend_array = [u]

            for i in range(n_bends):
                cur_node = f'b{idx}'
                pre_node = f'b{idx - 1}' if i > 0 else u
                nxt_node = f'b{idx + 1}' if i < n_bends - 1 else v
                
                temp_bend_array.append(cur_node)

                self.G.add_edge(pre_node, cur_node)
                self.dcel.add_node_between(pre_node, cur_node, v)
                
                flow_dict.setdefault(cur_node, {}).setdefault(lf_id, {})[cur_node, pre_node] = 1
                flow_dict.setdefault(cur_node, {}).setdefault(rf_id, {})[cur_node, nxt_node] = 3
                
                idx += 1

            temp_bend_array.append(v)
            self.bendsData.append(temp_bend_array)

            flow_dict[v][lf_id][v, f'b{idx - 1}'] = flow_dict[v][lf_id].pop((v, u))
            self.G.add_edge(f'b{idx - 1}', v)


    def rectangular_face_processor(self, flow_dict):  
        #all faces in the graph must be rectangular for Tamassia's compaction to work correctly

        idx = 0
        faces = list(self.dcel.faces.values())
        for face in faces:

            print("Working on", face.id)
            print(face)
            if (face.id == self.dcel.ext_face.id):
                continue

            data_array = face.getEdgeData(self.dcel, flow_dict, True)

            #now we have the data of where dummy nodes have to be created
            #now create the dummy nodes and associated dummy edges
            #also update the angle and bend data for these nodes and edges

            #create a storage for keeping tracking of dummy nodes introduced in the edges of the face
            dummy_array = {}
            for data in data_array:
                dummy_array[data[0]] = []

            for data in data_array:
                turn = data[-2]
                check = False
                if (turn < 0):
                    #such edges destroy the rectangular shape of the graph
                    front = data[-1]
                    print("front is ", front.id)
                    #remove the front edge from the graph
                    if front.id in self.planar.dcel.half_edges:
                        he = self.planar.dcel.half_edges[front.id]
                        src, tgt = he.get_points()
                    else:
                        #front has been split with a rectangular dummy node
                        src = front.id[0]
                        tgt = front.id[1]
                        if src in face.nodes_id:
                            srcIndex = face.nodes_id.index(src)
                            if srcIndex == len(face.nodes_id) - 1:
                                tgtIndex = 0
                            else:
                                tgtIndex = srcIndex + 1
                        else:
                            #then target must be inside this face
                            tgtIndex = face.nodes_id.index(tgt)
                            srcIndex = tgtIndex - 1
                        src = face.nodes_id[srcIndex]
                        tgt = face.nodes_id[tgtIndex]
                        he = self.planar.dcel.half_edges[(src,tgt)]


                    lf_id, rf_id = he.twin.inc.id, he.inc.id
                    self.G.remove_edge(src, tgt)

                    #adding dummy node and its edge to split the front edge
                    rectDummyNode = ('rect', idx)
                    self.G.add_edge(src, rectDummyNode)
                    self.G.add_edge(rectDummyNode, tgt)
                    self.planar.dcel.add_node_between(src, tgt, rectDummyNode)

                    print("Added dummy node", rectDummyNode, "between ", src, "and", tgt)
                    
                    # update flow dictionary
                    flow = flow_dict[src][rf_id].pop((src, tgt))
                    flow_dict[src][rf_id][src, rectDummyNode] = flow
                    flow_dict.setdefault(rectDummyNode, {}).setdefault(rf_id, {})[rectDummyNode, tgt] = 2

                    flow = flow_dict[tgt][lf_id].pop((tgt, src))
                    flow_dict[tgt][lf_id][tgt, rectDummyNode] = flow
                    flow_dict.setdefault(rectDummyNode, {}).setdefault(lf_id, {})[rectDummyNode, src] = 2  

                    #now add the dummy edge (corner(e), dummyNode)
                    corner = data[2]
                    self.G.add_edge(corner, rectDummyNode)
                    self.planar.dcel.add_edge(corner, rectDummyNode)
                    self.planar.dcel.add_edge(rectDummyNode, corner)

                    print("Dummy edge inserted from ", corner, "to", rectDummyNode)

                    #now we split the face based on this new dummy edge
                    #start from the dummy node and traverse the face until the corner node is reached
                    dummyIndex = face.nodes_id.index(rectDummyNode)
                    
                    cornerIndex = face.nodes_id.index(corner)

                    #extracting nodes for new face from original face and updating original face
                    if (dummyIndex > cornerIndex):
                        # print("dummy vertex is greater than corner index")
                        face_split_1 = face.nodes_id[dummyIndex:] + face.nodes_id[0:cornerIndex + 1]
                        face_split_2 = face.nodes_id[cornerIndex: dummyIndex + 1]
                    else:

                        # print("dummy vertex is lesser than corner index")
                        # print(face.nodes_id)
                        face_split_1 = face.nodes_id[dummyIndex:cornerIndex + 1]
                        face_split_2 = face.nodes_id[cornerIndex:] + face.nodes_id[0:dummyIndex + 1]
                        # print(face_split_2)

                    # print(face_split_1)

                    newFace = self.dcel.addFace(face_split_1)
                    face.nodes_id = face_split_2

                    

                    #updating flow dictionary

                    #add flow value from dummy vertex to corner with old face
                    flow_dict.setdefault(rectDummyNode, {}).setdefault(face.id, {})[rectDummyNode, corner] = 1

                    for i in range(0, len(newFace.nodes_id)):
                        currNode = newFace.nodes_id[i]
                        if (i == 0): #first node
                            nextNode = newFace.nodes_id[i+1]
                            flow = 1
                        elif (i == len(newFace.nodes_id) - 1):   #last node
                            nextNode = newFace.nodes_id[0]
                            flow = 2
                        else:
                            nextNode = newFace.nodes_id[i+1]
                            flow = flow_dict[currNode][face.id][currNode, nextNode]

                        #create flow value with new face
                        flow_dict.setdefault(currNode, {}).setdefault(newFace.id, {})[currNode, nextNode] = flow

                        #remove flow value of nodes with old face
                        if (i < len(newFace.nodes_id) - 1):
                            flow_dict[currNode][face.id].pop((currNode, nextNode))
                            #check if the dictionary is empty now
                            if not bool(flow_dict[currNode][face.id]):
                                flow_dict[currNode].pop(face.id)

                        #update flow value with old face for corner node
                        else: 
                            index = face.nodes_id.index(currNode) + 1
                            nextNodeIndex = index if (index < len(face.nodes_id)) else 0 
                            nextNode = face.nodes_id[nextNodeIndex]
                            flow_dict[currNode][face.id][(currNode, nextNode)] = 1
                    

                    #update face to start from the corner node            
                    face.updateData(self.planar.dcel.half_edges)
                    faceRectCheck = face.isRectangular(self.dcel, flow_dict)
                    newfaceRectCheck = newFace.isRectangular(self.dcel, flow_dict)

                    if (faceRectCheck and not newfaceRectCheck):
                        temp = newFace
                        newFace = face
                        face = temp
                    elif (not faceRectCheck and not newfaceRectCheck):
                        #both faces are not rectangular
                        #might happen if the turn is 360 degrees i.e. there is a one degree node at the corner
                        faces.append(newFace)
                        faces.append(face)
                        check = True
                    print(face.id, "is rectangular: ", faceRectCheck)
                    print(newFace.id, "is rectangular: ", newfaceRectCheck)

                    print("new face is ",newFace.id, ":", newFace.nodes_id)
                    newFace.getEdgeData(self.dcel, flow_dict)
                    print("updated face is", face.nodes_id)
                    face.getEdgeData(self.dcel, flow_dict)

                    print("\n\n\n");

                    idx += 1

                if (check):
                    break

          
            
    def face_side_processor(self, flow_dict):
        '''Associating edges with face sides.
        '''

        halfedge_side = {}

        def set_side(init_he, side):
            for he in init_he.traverse():
                halfedge_side[he] = side
                angle = flow_dict[he.succ.ori.id][he.inc.id][he.succ.id]
                if angle == 1:
                    # turn right in internal face or turn left in external face
                    side = (side + 1) % 4
                elif angle == 3:
                    side = (side + 3) % 4
                elif angle == 4:  # a single edge
                    side = (side + 2) % 4

            for he in init_he.traverse():
                if he.twin not in halfedge_side:
                    set_side(he.twin, (halfedge_side[he] + 2) % 4)

        set_side(self.dcel.ext_face.inc, 0)
        return halfedge_side

    def dfs_face_order(self):  # dfs dual graph, starts at ext_face
        res = []
        marked = set()
        def dfs(face):
            res.append(face)
            marked.add(face.id)
            for nb in set(face.surround_faces()):
                if nb.id not in marked:
                    dfs(nb)
        dfs(self.dcel.ext_face)
        return res
    
    def refine_faces(self, halfedge_side):
        """Make face rectangle, create dummpy nodes.
        Modify self.G, self.dcel, halfedge_side
        """

        def find_front(init_he, target):  # first
            cnt = 0
            for he in init_he.traverse():
                side, next_side = halfedge_side[he], halfedge_side[he.succ]
                if side == next_side:  # go straight
                    pass
                elif (side + 1) % 4 == next_side:  # go right
                    cnt += 1
                elif (side + 2) % 4 == next_side:  # go back
                    cnt -= 2
                else:  # go left
                    cnt -= 1
                if cnt == target:
                    return he.succ
            raise Exception(f"can't find front edge of {init_he}")

        def refine_internal(face):
            """Insert only one edge to make face more rect"""
            for he in face.surround_half_edges():
                side, next_side = halfedge_side[he], halfedge_side[he.succ]
                if side != next_side and (side + 1) % 4 != next_side:
                    front_he = find_front(he, 1)
                    extend_node_id = he.twin.ori.id

                    l, r = front_he.ori.id, front_he.twin.ori.id
                    he_l2r = self.dcel.half_edges[l, r]
                    dummy_node_id = ("dummy", extend_node_id)
                    self.G.remove_edge(l, r)
                    self.G.add_edge(l, dummy_node_id)
                    self.G.add_edge(dummy_node_id, r)

                    face = self.dcel.half_edges[l, r].inc
                    self.dcel.add_node_between(l, dummy_node_id, r)
                    he_l2d = self.dcel.half_edges[l, dummy_node_id]
                    he_d2r = self.dcel.half_edges[dummy_node_id, r]
                    halfedge_side[he_l2d] = halfedge_side[he_l2r]
                    halfedge_side[he_l2d.twin] = (
                        halfedge_side[he_l2r] + 2) % 4
                    halfedge_side[he_d2r] = halfedge_side[he_l2r]
                    halfedge_side[he_d2r.twin] = (
                        halfedge_side[he_l2r] + 2) % 4
                    halfedge_side.pop(he_l2r)
                    halfedge_side.pop(he_l2r.twin)

                    self.G.add_edge(dummy_node_id, extend_node_id)
                    self.dcel.connect(face, extend_node_id,
                                      dummy_node_id, halfedge_side, halfedge_side[he])

                    he_e2d = self.dcel.half_edges[extend_node_id,
                                                  dummy_node_id]
                    lf, rf = he_e2d.twin.inc, he_e2d.inc
                    halfedge_side[he_e2d] = halfedge_side[he]
                    halfedge_side[he_e2d.twin] = (halfedge_side[he] + 2) % 4

                    refine_internal(lf)
                    refine_internal(rf)
                    break

        def build_border(G, dcel, halfedge_side):
            """Create border dcel"""
            border_nodes = [("dummy", -i) for i in range(1, 5)]
            border_edges = [(border_nodes[i], border_nodes[(i + 1) % 4])
                            for i in range(4)]
            border_G = nx.Graph(border_edges)
            border_side_dict = {}
            is_planar, border_embedding = nx.check_planarity(border_G)
            border_dcel = Dcel(border_G, border_embedding)
            ext_face = border_dcel.half_edges[(
                border_nodes[0], border_nodes[1])].twin.inc
            border_dcel.ext_face = ext_face
            ext_face.is_external = True

            for face in list(border_dcel.faces.values()):
                if not face.is_external:
                    for i, he in enumerate(face.surround_half_edges()):
                        he.inc = self.dcel.ext_face
                        halfedge_side[he] = i  # assign side
                        halfedge_side[he.twin] = (i + 2) % 4
                        border_side_dict[i] = he
                    border_dcel.faces.pop(face.id)
                    border_dcel.faces[self.dcel.ext_face.id] = self.dcel.ext_face
                else:
                    # rename border_dcel.ext_face's name
                    border_dcel.faces.pop(face.id)
                    face.id = ("face", -1)
                    border_dcel.faces[face.id] = face
            G.add_edges_from(border_edges)

            # merge border dcel into self.dcel
            dcel.vertices.update(border_dcel.vertices)
            dcel.half_edges.update(border_dcel.half_edges)
            dcel.faces.update(border_dcel.faces)
            dcel.ext_face.is_external = False
            dcel.ext_face = border_dcel.ext_face
            return border_side_dict

        ori_ext_face = self.dcel.ext_face
        border_side_dict = build_border(self.G, self.dcel, halfedge_side)

        for he in ori_ext_face.surround_half_edges():
            extend_node_id = he.succ.ori.id
            side, next_side = halfedge_side[he], halfedge_side[he.succ]
            if next_side != side and next_side != (side + 1) % 4:
                if len(self.G[extend_node_id]) <= 2:
                    front_he = border_side_dict[(side + 1) % 4]
                    dummy_node_id = ("dummy", extend_node_id)
                    l, r = front_he.ori.id, front_he.twin.ori.id
                    he_l2r = self.dcel.half_edges[l, r]
                    # process G
                    self.G.remove_edge(l, r)
                    self.G.add_edge(l, dummy_node_id)
                    self.G.add_edge(dummy_node_id, r)
                    self.G.add_edge(dummy_node_id, extend_node_id)

                    # # process dcel

                    self.dcel.add_node_between(l, dummy_node_id, r)
                    self.dcel.connect_diff(
                        ori_ext_face, extend_node_id, dummy_node_id)

                    he_e2d = self.dcel.half_edges[extend_node_id,
                                                  dummy_node_id]
                    he_l2d = self.dcel.half_edges[l, dummy_node_id]
                    he_d2r = self.dcel.half_edges[dummy_node_id, r]
                    # process halfedge_side
                    halfedge_side[he_l2d] = halfedge_side[he_l2r]
                    halfedge_side[he_l2d.twin] = (
                        halfedge_side[he_l2r] + 2) % 4
                    halfedge_side[he_d2r] = halfedge_side[he_l2r]
                    halfedge_side[he_d2r.twin] = (
                        halfedge_side[he_l2r] + 2) % 4

                    halfedge_side[he_e2d] = halfedge_side[he]
                    halfedge_side[he_e2d.twin] = (halfedge_side[he] + 2) % 4
                    halfedge_side.pop(he_l2r)
                    halfedge_side.pop(he_l2r.twin)
                    break
        else:
            raise Exception("not connected")

        for face in list(self.dcel.faces.values()):
            if face.id != ("face", -1):
                refine_internal(face)



    def tidy_rectangle_compaction(self, halfedge_side):
        """
        Compute every edge's length, depending on halfedge_side
        """

        def build_flow(target_side):
            flow = Flow_net()
            for he, side in halfedge_side.items():
                if side == target_side:
                    lf, rf = he.twin.inc, he.inc
                    lf_id = lf.id
                    rf_id = rf.id if not rf.is_external else ('face', 'end')
                    flow.add_edge(lf_id, rf_id, he.id)
            return flow

        def min_cost_flow(flow, source, sink):
            if not flow:
                return {}
            for node in flow:
                flow.nodes[node]['demand'] = 0
            flow.nodes[source]['demand'] = -2 ** 32
            flow.nodes[sink]['demand'] = 2 ** 32
            for lf_id, rf_id, he_id in flow.edges:
                # TODO: what if selfloop?
                flow.edges[lf_id, rf_id, he_id]['weight'] = 1
                flow.edges[lf_id, rf_id, he_id]['lowerbound'] = 1
                flow.edges[lf_id, rf_id, he_id]['capacity'] = 2 ** 32
            flow.add_edge(source, sink, 'extend_edge',
                          weight=0, lowerbound=0, capacity=2 ** 32)

            return flow.min_cost_flow()

        hor_flow = build_flow(1)  # up -> bottom
        ver_flow = build_flow(0)  # left -> right

        hor_flow_dict = min_cost_flow(
            hor_flow, self.dcel.ext_face.id, ('face', 'end'))
        ver_flow_dict = min_cost_flow(
            ver_flow, self.dcel.ext_face.id, ('face', 'end'))

        halfedge_length = {}

        for he, side in halfedge_side.items():
            if side in (0, 1):
                rf = he.inc
                rf_id = ('face', 'end') if rf.is_external else rf.id
                lf_id = he.twin.inc.id

                if side == 0:
                    hv_flow_dict = ver_flow_dict
                else:
                    hv_flow_dict = hor_flow_dict

                length = hv_flow_dict[lf_id][rf_id][he.id]
                halfedge_length[he] = length
                halfedge_length[he.twin] = length

        return halfedge_length

    def layout(self, halfedge_side, halfedge_length):
        """ return pos of self.G"""
        pos = {}

        def set_coord(init_he, x, y):
            for he in init_he.traverse():
                pos[he.ori.id] = (x, y)
                side = halfedge_side[he]
                length = halfedge_length[he]
                if side == 1:
                    x += length
                elif side == 3:
                    x -= length
                elif side == 0:
                    y += length
                else:
                    y -= length

            for he in init_he.traverse():
                for e in he.ori.surround_half_edges():
                    if e.twin.ori.id not in pos:
                        set_coord(e, *pos[e.ori.id])

        set_coord(self.dcel.ext_face.inc, 0, 0)
        return pos

    def remove_dummy(self):
        for node in list(self.G.nodes):
            if type(node) is tuple and len(node) > 1:
                if node[0] == "dummy":
                    self.G.remove_node(node)
                    self.pos.pop(node, None)


