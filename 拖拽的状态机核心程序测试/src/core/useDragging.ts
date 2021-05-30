import { MouseEvent, useRef} from 'react'
import Node from './Node'
import StateMachine from './StateMachine'
import Selection from './Selection'
import Resizer from './Resizer'



enum DragState{
  Start,
  DragSelect,
  Selected,
  Moving,
  StartResize,
  Resize
}

enum DragTrigger {
  DownWithNode,
  DownWithNothing,
  DownWithBar,
  Up,
  Move,
  CtrlDown
}


export class DragController extends StateMachine<DragState, DragTrigger> {

  ctrlDown : boolean 
  root : Node
  x : number
  y : number
  selection : Selection
  resizer : Resizer

  constructor(root : Node){
    super(DragState.Start)
    this.root = root
    this.ctrlDown = false
    this.x = 0
    this.y = 0
    this.selection = new Selection()
    this.resizer = new Resizer()

    // drag & move
    this.addRule(DragState.Start, DragTrigger.DownWithNode, this.startDrag)
    this.addRule(DragState.DragSelect, DragTrigger.Move, this.dragMove)
    this.addRule(DragState.Moving, DragTrigger.Move, this.dragMove)
    this.addRule(DragState.Moving, DragTrigger.Up, this.endMove)
    
    // select more
    this.addRule(DragState.DragSelect, DragTrigger.Up, this.waitSelect)
    this.addRule(DragState.Selected, DragTrigger.DownWithNode, this.startDrag)
    this.addRule(DragState.Selected, DragTrigger.CtrlDown, this.waitSelectMore)
    this.addRule(DragState.Selected, DragTrigger.Up, this.waitSelect)
    this.addRule(DragState.Selected, DragTrigger.DownWithNothing, this.cancelSelect)

    // resize 
    this.addRule(DragState.Selected, DragTrigger.DownWithBar, this.startResize)
    this.addRule(DragState.StartResize, DragTrigger.Move, this.resizing)
    this.addRule(DragState.Resize, DragTrigger.Move, this.resizing)
    this.addRule(DragState.Resize, DragTrigger.Up, this.endResizing)

    this.init()
  }

  startDrag = () =>{
    const node = this.root.select(this.x, this.y)

    if(!node) {
      return DragState.Start
    }

    if(!this.selection.contains(node)) {
      this.selection.replace(node)
    }
    this.selection.startMoving(node, this.x, this.y)
    return DragState.Moving
    
  }
  cancelSelect = () => {
    this.selection.clear()
    return DragState.Start
  }


  dragMove = () => {
    this.selection.move(this.x, this.y)
    return DragState.Moving
  }

  endMove = () => {
    this.selection.finishMove()
    return DragState.Selected
  }

  waitSelect = () => {
    return DragState.Selected
  }

  waitSelectMore = () => {
    const node = this.root.select(this.x, this.y)
    if(!node) {
      this.selection.clear()
      return DragState.Start
    }
    this.selection.add(node)
    return DragState.Selected
  }

  startResize = () => {
    console.log("resize", this.resizer.cubeType)
    this.resizer.startResizing(this.x, this.y)
    return DragState.StartResize
  }
  resizing = () => {
    this.resizer.resizing(this.x, this.y)
    return DragState.Resize
  }

  endResizing = () => {
    return DragState.Selected
  }

  /* Handlers */
  init(){
    document.addEventListener('keydown', (e) => {
      if(e.ctrlKey) {
        this.ctrlDown = true
      }
    })
    document.addEventListener('keyup', (e) => {
      if(this.ctrlDown)
        this.ctrlDown = false
    }) 
  }

  saveMovePosition = (e : MouseEvent) => {
    this.x = e.clientX
    this.y = e.clientY
  }

  onMouseDown = (e : MouseEvent) => {
    this.saveMovePosition(e)
    if(this.ctrlDown) {
      this.next(DragTrigger.CtrlDown)
      return
    } 
    const target = e.target as Element
    const cubeType = target.getAttribute("data-cube")

    if (cubeType) {
      const nodeId = target.parentElement?.parentElement?.id
      const id  = nodeId?.split('-').pop()
      if(!id) {
        return
      }
      const node = Node.nodes[Number.parseInt(id)]

      this.resizer.setCubeType(Number.parseInt(cubeType))
      this.resizer.setNode(node)
      this.next(DragTrigger.DownWithBar)
    } else {
      const node = this.root.select(this.x, this.y)
      if (!node || !node.parent) {
        this.next(DragTrigger.DownWithNothing)
      } else {
        this.next(DragTrigger.DownWithNode)
      }
    }
  }

  onMouseMove = (e : MouseEvent) => {
    this.saveMovePosition(e)
    this.next(DragTrigger.Move)
  }
  onMouseUp = (e : MouseEvent) => {
    this.saveMovePosition(e)
    this.next(DragTrigger.Up)
  }

}


const useDragging = (root : Node) => {
  const ref = useRef(new DragController(root))
  return ref.current
}

export default useDragging