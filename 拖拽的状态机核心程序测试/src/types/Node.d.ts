import Widget from "./Widget";
import Emiter from './Emiter';
export default class Node extends Emiter {
    static __id: number;
    static nodes: {
        [index: string]: Node;
    };
    parent: Node | null;
    widget: Widget;
    children: Array<Node>;
    name?: string;
    id: number;
    isSelected: boolean;
    isMoving: boolean;
    constructor(widget: Widget, name?: string);
    add(node: Node): void;
    finishMove(): void;
    moveTo(x: number, y: number): void;
    static selectById(id?: string): Node | null;
    absPosition(): Array<number>;
    root(): Node;
    isAncestorOf(node: Node): boolean;
    absContains(node: Node): boolean;
    moveA2B(a: Node, b: Node): void;
    insert(node: Node): void;
    bfs(): Generator<Node>;
    float(): void;
    redrop(): void;
    remove(node: Node): void;
    select(x: number, y: number): Node | null;
}
