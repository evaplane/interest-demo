import { MouseEvent } from 'react';
import Node from './Node';
export declare class Selection {
    set: Set<Node>;
    cache: Map<Node, any>;
    startX: number;
    startY: number;
    constructor();
    add(node: Node): void;
    replace(node: Node): void;
    contains(node: Node): boolean;
    startMoving(currentSelect: Node | null, x: number, y: number): void;
    move(x: number, y: number): void;
    finishMove(): void;
    clear(): void;
}
declare enum DragState {
    Start = 0,
    DragSelect = 1,
    Selected = 2,
    Moving = 3,
    StartResize = 4,
    Resize = 5
}
declare enum DragTrigger {
    Down = 0,
    Up = 1,
    Move = 2,
    CtrlDown = 3,
    BarDown = 4
}
declare class StateMachine<T, U> {
    map: Map<T, Map<U, () => T>>;
    state: T;
    constructor(initialState: T);
    addRule(from: T, trigger: U, fn: () => T): void;
    next(trigger: U): void;
}
export declare class DragController extends StateMachine<DragState, DragTrigger> {
    ctrlDown: boolean;
    root: Node;
    x: number;
    y: number;
    selection: Selection;
    constructor(root: Node);
    startDrag: () => DragState.Start | DragState.DragSelect;
    startDrag2: () => DragState.Selected | DragState.Moving;
    dragMove: () => DragState;
    endMove: () => DragState;
    waitSelect: () => DragState;
    waitSelectMore: () => DragState.Start | DragState.Selected;
    waitResize: () => DragState;
    resizing: () => DragState;
    endResizing: () => DragState;
    init(): void;
    saveMovePosition: (e: MouseEvent) => void;
    onMouseDown: (e: MouseEvent) => void;
    onMouseMove: (e: MouseEvent) => void;
    onMouseUp: (e: MouseEvent) => void;
}
declare const useDragging: (root: Node) => DragController;
export default useDragging;
