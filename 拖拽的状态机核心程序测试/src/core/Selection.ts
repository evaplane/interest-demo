import Node from "./Node" 

export default class Selection {
  set : Set<Node>
  cache : Map<Node, any>
  startX : number
  startY : number

  constructor(){
    this.set = new Set()
    this.cache = new Map()
    this.startX = 0
    this.startY = 0
  }

  add(node : Node) {
    this.set.add(node)
    node.isSelected = true
    const list = []
    for(const p of this.set) {
      if(node.isAncestorOf(p)) {
        list.push(p)
      }
    }
    list.forEach(p => this.set.delete(p))
    node.emit("selection-change")
  }

  replace(node : Node) {
    this.clear()
    this.add(node)
  }

  contains(node : Node) : boolean {
    return this.set.has(node) 
  }

  startMoving(currentSelect : Node | null, x : number, y : number){
    this.startX = x
    this.startY = y

    this.cache.clear()
    for(let node of this.set) {
      this.cache.set(node, [
        node.widget.left,
        node.widget.top,
      ])
    }
  }

  move(x : number, y : number) : void {
    for(let node of this.set) {
      const [sx, sy] = this.cache.get(node) 
      node.moveTo(sx + (x - this.startX), sy + (y - this.startY))
    }
  }

  finishMove() {
    for(let node of this.set) {
      node.finishMove()
    }
  }

  clear(){

    const list = [...this.set]
    this.set.clear()
    list.forEach(node => {
      node.emit("selection-change")
    })
  }
}
