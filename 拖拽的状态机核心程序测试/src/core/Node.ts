import Widget from "./Widget";
import Emiter from './Emiter'
import Rect from "./Rect";

export default class Node extends Emiter {
  
  static __id : number = 0;
  static nodes : {[index:string] : Node}  = {}
  parent : Node | null
  widget : Widget 
  children : Array<Node>
  name ?:string
  id : number
  isSelected : boolean
  isMoving :boolean

  constructor(widget : Widget, name = ""){
    super()
    this.parent = null
    this.widget = widget
    this.children = []
    this.name = name
    this.id = ++Node.__id
    Node.nodes[this.id] = this
    this.isSelected = false 
    this.isMoving = false

  }

  add(node : Node) {
    this.children.push(node)
    node.parent = this
  }

  finishMove(){
    this.redrop()
    this.isMoving = false
    this.emit('updated')
  }

  moveTo(x:number, y : number) : void {
    if (
      this.parent &&
      this.parent.widget.layout.display === "block"
    ) {
      this.isMoving = true
      this.widget.left = x
      this.widget.top = y
      this.emit("update")
    }
  }

  static selectById(id? : string) : Node | null {
    if(!id) {return null}
    return this.nodes[id]
  }

  absPosition() : Array<number> {
    
    if(!this.parent) {
      return [this.widget.left, this.widget.top]
    }

    const [x, y] = this.parent.absPosition()
    return [x + this.widget.left, y + this.widget.top]
  }

  root() : Node{
    if(this.parent) {
      return this.parent.root()
    }
    return this
  }

  isAncestorOf(node : Node) : boolean {
    while(node.parent && node.parent !== this) {
      node = node.parent
    }
    return node.parent === this
  }

  absContains(node : Node) : boolean{
    const [x, y] = this.absPosition()
    const [x1, y1] = node.absPosition()

    const intersect = Rect.of(x, y, this.widget.width, this.widget.height) 
      .intersect(Rect.of(x1, y1, node.widget.width, node.widget.height))

    if(intersect === null) {
      return false
    }
    return intersect.area() / node.widget.area() >= 0.8
  }


  moveA2B(a: Node, b: Node) {
    const [x, y] = a.absPosition()
    const [sx, sy] = b.absPosition()
    a.widget.left = x - sx
    a.widget.top = y - sy
    if(a.parent) {a.parent.remove(a)}
    b.add(a)
  }

  insert(node : Node) {

    let p = this.select(
      node.widget.left + node.widget.width / 2,
      node.widget.top + node.widget.height / 2
    )

    let q : Node|null = null
    while(p && !p.absContains(node)) {
      q = p
      p = p.parent
    }

    // no matched node found 
    if(!p) {
      return
    }
    
    this.moveA2B(node, p)
    this.emit('update')
    if(q) {
      this.moveA2B(q, node)
      q.emit('update')
    }
    
  }


  *bfs() : Generator<Node>{
    const queue : Array<Node> = [this]

    let limit = 1000
    while(queue.length > 0 && limit-- > 0) {
      const node = queue.shift()
      if(!node) {
        continue
      }
      yield node

      for(let child of node.children) {
        queue.push(child)
      }
    }
    if(limit == -1) {
      throw "limit exceeded."
    }
  }

  float() {
    const [x, y] = this.absPosition()
    if(this.parent){
      this.parent.remove(this)
    }
    this.parent = null
    this.widget.left = x
    this.widget.top = y

  }

  redrop() {
    if(!this.parent) {
      return
    }
    const all = [...this.bfs()]
    const root = this.root()
    all.forEach(node => {
      node.float()
      root.insert(node)
    })
    
  }

  remove(node : Node) {
    this.children = this.children.filter(x => x !== node)
  }


  select(x:number, y:number, depth = 0) : Node | null {

    if(depth > 10) {
      throw "depth overflow"
    }
    
    if(this.widget.bound(x, y)) {

      if (
        !this.children.find((node) =>
          node.widget.bound(x - this.widget.left, y - this.widget.top)
        )
      ) {
        return this
      }
    }

    for(let child of this.children) {
      const result = child.select(
        x - this.widget.left,
        y - this.widget.top,
        depth + 1
      )
      if(result != null) {
        return result
      }
    }
    return null
  }

}