export interface Point {
    x: number;
    y: number;
}
export declare class DocumentScanner {
    private cv;
    constructor();
    detect(source: HTMLImageElement | HTMLCanvasElement): Point[];
    crop(source: HTMLImageElement | HTMLCanvasElement, points?: Point[], width?: number, height?: number): HTMLCanvasElement;
    distance(p1: Point, p2: Point): number;
    getCornerPoints(contour: any): Point[];
}
