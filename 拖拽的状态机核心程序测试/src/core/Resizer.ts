import Node from './Node'
import Rect from './Rect'

export default class Resizer {

  cubeType? : number
  node? : Node
  x : number = 0
  y : number = 0
  cache? : Rect

  static resizerData = [
    ["topleft", 1, [1, 1, -1, -1]],
    ["topmiddle", 2, [0, 1, 0, -1]],
    ["topright", 3, [0, 1, 1, -1]],
    ["middleright", 4, [0, 0, 1, 0]],
    ["bottomright", 5, [0, 0, 1, 1]],
    ["bottommiddle", 6, [0, 0, 0, 1]],
    ["bottomleft", 7, [1, 0, -1, 1]],
    ["middleleft", 8, [1, 0, -1, 0]],
  ]

  setCubeType(type : number) {
    this.cubeType = type
  }

  setNode(node : Node) {
    this.node = node
  }

  startResizing(x : number, y : number) {
    this.cache = this.node?.widget.clone()
    this.x = x
    this.y = y
  }


  resizing(x : number, y : number) {
    if(!this.cubeType){return}
    if(!this.cache) {return}
    if(!this.node) {return}

    const dx = x - this.x
    const dy = y - this.y
    const type : number = this.cubeType
    const nvec = Resizer.resizerData[type-1][2] as Array<number>

    const vec4 = [
      nvec[0] * dx,
      nvec[1] * dy,
      nvec[2] * dx,
      nvec[3] * dy,
    ]

    const rect = this.cache.apply(vec4[0], vec4[1], vec4[2], vec4[3])
    if(rect) this.node.widget.replace(rect)
    
    this.node?.emit('update')
  }
}