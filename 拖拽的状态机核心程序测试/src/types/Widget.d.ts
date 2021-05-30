import Rect from './Rect';
import { CSSProperties } from 'react';
declare type Display = "flex" | "block";
interface Layout {
    display: Display;
}
export default class Widget extends Rect {
    style: CSSProperties;
    layout: Layout;
    constructor(rect: Rect, style: CSSProperties, layout?: Layout);
    getStyle(isMoving: boolean): CSSProperties;
}
export {};
