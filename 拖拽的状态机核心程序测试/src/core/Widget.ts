import Rect from './Rect'
import {CSSProperties} from 'react'


type Display  = "flex" | "block"

interface Layout {
  display : Display,
}

export default class Widget extends Rect{
  style : CSSProperties 
  layout : Layout
  constructor(rect:Rect, style : CSSProperties, layout? : Layout){

    super(0,0,0,0)
    this.copyFrom(rect)
    this.layout = layout || {
      display : "block"
    } 
    this.style = style
  }

  getStyle(isMoving : boolean) : CSSProperties{
    const boxStyle = {
      position : "absolute",
      left : this.left + "px",
      top : this.top + "px",
      width : this.width + "px",
      height : this.height + "px",
      zIndex : isMoving ? 100 : 0
    }

    return Object.assign(boxStyle, this.style)
  }
}
