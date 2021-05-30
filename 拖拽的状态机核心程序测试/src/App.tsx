import React, { CSSProperties, useEffect,  useState } from 'react';
import Node from './core/Node'
import Widget from './core/Widget'
import Rect from './core/Rect';
import useDragging, {DragController } from './core/useDragging'
import Selection from './core/Selection'
// import {DragController, Selection} from './types/useDragging'
import { throttle } from 'rxjs/operators'
import {interval} from 'rxjs'
import styles from "./core/core.module.css"
import Resizer from './core/Resizer';

const DragingContext = React.createContext<DragController | null>(null)



type ComponentTreeProps = {
  node : Node,
  level? : number
}

type SelectionProps = {
  node : Node,
  selection : Selection
}

const SelectionFrame = ({node, selection} : SelectionProps) => {

  const [, setVer] = useState(0)
  useEffect(() => {
    const subscription = node.on("selection-change").subscribe(() => {
      setVer(x => x + 1)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [node])
  
  return <div className={styles.selection_frame} style={{
    display : selection.contains(node) ? "block" : "none" 
  }}>
    {Resizer.resizerData.map((([name, type])=> {
      return <div data-cube={type} className={`${styles.cube} ${styles["cube_"+name]}`} />
    }))}
  </div> 
}

const ComponentTreeRoot = ({node} : ComponentTreeProps) => {
  const helper = useDragging(node)

  return <div 
    onMouseDown={helper.onMouseDown}
    onMouseMove={helper.onMouseMove}
    onMouseUp={helper.onMouseUp}
  >
    <DragingContext.Provider value={helper}>
      <ComponentTree node={node} level={0} />
    </DragingContext.Provider>
  </div>

}
const ComponentTree = ({node, level = 0} : ComponentTreeProps) => {


  const [ver, setVer] = useState(0)
  useEffect(() => {
    const subscription = node.on("update")
      .pipe(throttle(() => interval(13)))
      .subscribe(() => {
        setVer(x => x + 1)
      })

    return () => {
      subscription.unsubscribe()
    }
  }, [node])


  return <DragingContext.Consumer>
    {value  => {
      if(value === null) return null
      return (
        <div
          style={node.widget.getStyle(node.isMoving)}
          key={ver}
          id={"c-" + node.id}
        >
          <SelectionFrame selection={value.selection} node={node} />
          {node.children.map((child) => {
            return (
              <ComponentTree
                key={child.id}
                node={child}
                level={level + 1}
              />
            )
          })}
        </div>
      )
    }}
  </DragingContext.Consumer>

  
}

const page = {
  type : "div",
  rect : [0,0, 800, 600],
  children : [
    {
      type : "div",
      rect : [0, 0, 100, 100],
      style : {
        backgroundColor : "lightyellow"
      },
      children : [
        {
          type : 'div',
          rect : [20, 20, 50, 50],
          style : {
            backgroundColor : "blue"
          }
        }
      ]
    },
    {
      type : "div",
      rect : [0, 200, 400, 100],
      style : {
        backgroundColor : "green"
      }
    }
  ]
}

interface JsonWidgetTree {
  type : string,
  rect : number[],
  style? : CSSProperties,
  children? : Array<JsonWidgetTree>
}

function fromJson(json : JsonWidgetTree) : Node {

  const rect = new Rect(json.rect[0], json.rect[1], json.rect[2], json.rect[3])
  const widget = new Widget(rect, json.style || {})
  const node = new Node(widget)
  json.children && json.children.forEach(child => {
    node.add(fromJson(child))
  })
  return node
}

function App() {
  const root = fromJson(page)

  return (
    <div className="App">
      <ComponentTreeRoot node={root}/>
    </div>
  );
}

export default App;
