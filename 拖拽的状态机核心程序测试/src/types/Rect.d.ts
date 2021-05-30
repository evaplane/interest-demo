export default class Rect {
    left: number;
    top: number;
    width: number;
    height: number;
    constructor(left: number, top: number, width: number, height: number);
    static of(left: number, top: number, width: number, height: number): Rect;
    copyFrom(rect: Rect): void;
    right(): number;
    bottom(): number;
    boundX(x: number): boolean;
    boundY(y: number): boolean;
    bound(x: number, y: number): boolean;
    contains(rect: Rect): boolean;
    area(): number;
    intersect(rect: Rect): Rect | null;
}
