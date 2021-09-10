class HalfEdge():
    def __init__(self, name):
        self.id = name
        self.inc = None  #the incident face
        self.twin = None
        self.ori  = None #origin i.e. source
        self.prev = None #prev half edge in the incident face
        self.succ = None #next half edge in the incident face

        #data of next edge in ccw traversal of face
        self.next = None
        self.corner = None
        self.turn = None
        self.front = None

    def get_points(self):
        #returns source, target
        return self.ori.id, self.twin.ori.id

    def set(self, twin, ori, prev, succ, inc):
        self.twin = twin
        self.ori = ori
        self.prev = prev
        self.succ = succ
        self.inc = inc

    def traverse(self):
        he = self.succ
        yield self
        while he is not self:
            yield he
            he = he.succ

    def print_data(self):
        print("")
        print(self.id)
        print(self.ori.id)
        print(self.prev.id) if self.pred != None else print(self.pred)
        print(self.succ.id) if self.succ != None else print(self.succ)
        print(self.inc.id)
        print("")

    def __repr__(self) -> str:
        return f'{self.ori}->{self.twin.ori}'

    def __hash__(self):
        return hash(self.id)